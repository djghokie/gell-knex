const assert = require('assert');
const chance = require('chance')();

const deps = require('./dependencies');

const Store = require('../store');

describe('store', function() {
	let knex, store;

	beforeEach(function() {
		knex = deps.resolveSingle('knex');

		store = new Store(deps);
		store.namedQueries.users = knex => {
			return knex('users')
				.select('*')
				;
		}
	})

	describe('save', function() {
		it('returns saved item', async function() {
			const user = {
				name: 'Dan'
			}

			const saved = await store.save('users', user);

			assert(saved);
			assert.strictEqual(saved.name, 'Dan');
		})
	})

	describe('lookup', function() {
		let user;

		beforeEach(async function() {
			user = await store.save('users', {
				name: chance.name()
			});
		})

		it('returns saved item', async function() {
			const saved = await store.lookup('users', { id: user.id });

			assert(saved);
			assert.strictEqual(saved.name, user.name);
		})
	})

	it('named select', async function() {
		const users = await store.list('users');

		assert(users.length > 0);
	})
})
