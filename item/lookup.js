const assert = require('assert');
const _ = require('lodash');

const EventEmitter = require('events');
const { State } = require('gell');
const { Configuration } = require('gell/conf');

const DEFAULT_OPTIONS = {
}

module.exports = function* lookup(deps, options={}) {
	assert(deps, 'lookup future requires deps');

	const state = new State();
	const conf = new Configuration();
	const events = new EventEmitter();

	let arg = yield { state, conf, events };

	// TODO: this doesn't allow for options to be change; might want to allow through Configuration
	const { materializer } = _.defaults(options, DEFAULT_OPTIONS);

	const { logger, knex } = deps.resolve('logger', 'knex');
	
	async function doLookup({ table, key }) {
		assert(_.isString(table), 'table name is required');
		assert(_.isObject(key), 'key is required');

		const [item$] = await knex(table)
			.where(key)
			;

		if (_.isUndefined(item$)) return item$;
		
		return materializer ? materializer(item$) : item$;
	}

	while (true) arg = yield doLookup(arg || {});
}