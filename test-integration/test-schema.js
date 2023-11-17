const assert = require('assert');

const knex = require('knex')({
	client: 'pg',

	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: 'mysecretpassword',
		// database : process.env.POSTGRES_DATABASE
	}
});

describe('schema builder', function() {
	beforeEach(function() {
		
	})

	it('test', async function() {
		await knex.schema.createTable('users', function (table) {
			table.increments();
			table.string('name');
			table.timestamps();
		})		
	})
})
