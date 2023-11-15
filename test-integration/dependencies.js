const DependencyContainer = require('gell-dependency/container');
const { runtimeLogger } = require('gell-runtime/logger');

const knex = require('knex');

const factory = deps => {
	return knex({
		client: 'pg',

		connection: {
			host: 'localhost',
			port: 5432,
			user: 'postgres',
			password: 'mysecretpassword',
			// database : process.env.POSTGRES_DATABASE
		}
	})
}

module.exports = new DependencyContainer({
	logger: runtimeLogger('integration-test'),

	knex: factory
});
