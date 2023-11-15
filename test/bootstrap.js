const runtime = require('gell-runtime/mocha');

const Store = require('../mock/store');

exports.mochaGlobalSetup = z => {}
exports.mochaGlobalTeardown = z => {}

function setupContext(...args) {
	const store = new Store();

	this.store = store;

	this.deps = this.deps.branch({
		store
	});
}

exports.mochaHooks = {
	beforeAll: [runtime.beforeAll],

	beforeEach: [setupContext]
}
