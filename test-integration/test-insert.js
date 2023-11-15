const assert = require('assert');

const deps = require('./dependencies');

describe('insert', function() {
	let knex;

	beforeEach(function() {
		knex = deps.resolveSingle('knex');
	})

	it('test', async function() {
		const res = await knex('users')
			.insert({name: 'Don'})
			.returning('*')
			;

		assert.strictEqual(res[0].name, 'Don');

		const users = await knex('users').select('*');

		assert(users.length > 0);
	})
})
