const assert = require('assert');
const _ = require('lodash');

const { init } = require('gell/future');

// const drain = require('gell/stream/drain');
// const { array: arraySink } = require('gell/stream/sink');

const save = require('./item/save');
const lookup = require('./item/lookup');

module.exports = class Store {

	namedQueries = {}

	namedOperations = {}

	constructor(deps) {
		assert(deps, 'deps is required');
		
		[this.$lookup] = init(lookup(deps));
		[this.$save] = init(save(deps));
		// [this.$queries] = init(queries(this.namedQueries, deps));

		this.knex = deps.resolveSingle('knex');
	}

	insert(table, item) {
		assert(_.isString(table), 'table name is required');
		assert(item);

		return this.$save.next({ table, item }).value;
	}
	
	lookup(table, key) {
		assert(_.isString(table), 'table name is required');
		assert(_.isObject(key), 'item key is required');

		return this.$lookup.next({ table, key }).value;
	}
	
	async list(namedQuery, args={}) {
		assert(_.isString(namedQuery), 'named query is required');

		const def = this.namedQueries[namedQuery];
		assert(def, `no named query (name=${namedQuery}) defined`);
		assert(_.isFunction(def), `named query (name=${namedQuery}) must be a function`);

		return def(this.knex, args);
	}

	/*
	query(namedQuery, queryArgs) {
		assert(_.isString(namedQuery), 'named query is required');

		const res = this.$queries.next({ namedQuery, ...queryArgs }).value;

		if (_.isError(res)) throw res;

		return res;
	}

	async find(namedQuery, args={}) {
		const $items = this.query(namedQuery, args);
		assert($items, `query (name=${namedQuery}) did not yield a stream`)

		return (await $items.next()).value;
	}

	async drain(namedQuery, args={}, $sink) {
		const $items = this.query(namedQuery, args);
		assert($items, `query (name=${namedQuery}) did not yield a stream`)

		if ($sink) return drain($items, $sink);

		const results$ = [];
		await drain($items, arraySink(results$));

		return results$;
	}

	write() {
		const options = {
			namedOperations: this.namedOperations || {}
		}

		const [$txn] = init(write(this.tableDef.name, this._deps, options));

		return $txn;
	}
	*/

}
