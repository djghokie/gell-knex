const assert = require('assert');
const _ = require('lodash');

const EventEmitter = require('events');

const { State } = require('gell');
const { Configuration } = require('gell/conf');

module.exports = function* save(deps, options={}) {
	assert(deps, 'save future requires deps');
	
	const state = new State();
	const conf = new Configuration();
	const events = new EventEmitter();

	const { logger, knex } = deps.resolve('logger', 'knex');
	
	async function doSave({ table, item }) {
		assert(_.isString(table), 'table name is required');
		assert(item, 'item is required');
		
		// logger.info(`storing item in table (name=${TableName})`);
	
		const { actor } = options;

		const [saved] = await knex(table)
			.insert(item.snapshot ? item.snapshot(actor) : item)
			.returning('*')
			;

		return saved;
	}
	
	let args = yield { state, conf, events };
	
	do {
		args = yield doSave(args || {});
	} while (true)
}
