const assert = require('assert');

const Store = require('../store');

describe('store', function() {
	it('test', function() {
		new Store(this.deps.branch({ knex: '' }));
	})
})
