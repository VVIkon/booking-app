exports.up = function (knex) {
	return knex.schema.createTable('events', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.integer('total_seats').notNullable();
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('events');
};
