const assert = require('assert');

const Store = require('../../mock/store');

describe('mock store', function() {
	let store;

	beforeEach(function() {
		store = new Store();
		store.namedQueries.users = items => {
			return items.users;
		}
	})

	describe('insert', function() {
		it('stores item as lastSaved', async function() {
			await store.insert('users', {});

			assert(store.lastSaved);
		})

		it('returns item', async function() {
			const user = await store.insert('users', {});

			assert(user);
		})

		it('generates id', async function() {
			const user = await store.insert('users', {});

			assert(user.id);
		})
	})

	describe('lookup', function() {
		let user;

		beforeEach(async function() {
			user = await store.insert('users', { });
		})

		it('returns previously saved item', async function() {
			const item$ = await store.lookup('users', { id: user.id });

			assert(item$);
		})
	})

	describe('list', function() {
		beforeEach(async function() {
			await store.insert('users', {});
		})

		it('works', async function() {
			const items = await store.list('users');

			assert.strictEqual(items.length, 1);
		})
	})
})