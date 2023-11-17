const assert = require('assert');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const EventEmitter = require('events');

const { State } = require('gell');
const { init } = require('gell/future');

// const drain = require('gell/stream/drain');
// const { array: arraySink } = require('gell/stream/sink');

const write = require('./write');

class Store extends State {

	events = new EventEmitter();

	namedQueries = {}

	writeOptions = {
		namedOperations: {}
	}

	get saved() {
		return this.get('saved');
	}
	
	get lastSaved() {
		return this.get('lastSaved');
	}

	set lastSaved(s$) {
		this.set('lastSaved', s$);
	}

	constructor() {
		super();

		this.set('saved', {});

		// [this.$queries] = init(queries(this.namedQueries, this.saved));
	}

	async insert(table, item) {
		assert(_.isString(table), 'table name is required');
		assert(item);

		const item$ = _.isFunction(item.snapshot) ? item.snapshot() : item;

		if (item$.id)
			var previous$ = await this.lookup(table, item$);
		else item$.id = uuid();  // WIP: for now, assume id is primary key

		let tableItems = this.saved[table];
		if (!tableItems) {
			tableItems = [];
			this.saved[table] = tableItems;
		}

		tableItems.push(item$);

		this.lastSaved = item$;

		this.events.emit('save', { item$, previous$ });

		return item$;
	}

	async lookup(table, key) {
		assert(_.isString(table), 'table name is required');
		assert(key, 'key is required');

		const tableItems = this.saved[table];
		if (tableItems) return tableItems.find(i => _.isMatch(i, key));
	}

	async list(namedQuery, queryArgs) {
		assert(_.isString(namedQuery), 'named query is required');

		const def = this.namedQueries[namedQuery];
		assert(def, `no named query (name=${namedQuery}) defined`);
		assert(_.isFunction(def), `named query (name=${namedQuery}) must be a function`);

		return def(this.saved, queryArgs);
	}

	write() {
		const [$txn] = init(write(this, this.writeOptions));

		return $txn;
	}

	select(template) {
		return this.saved.filter(_.matches(template));
	}

}

module.exports = Store;