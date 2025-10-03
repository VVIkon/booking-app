exports.up = function (knex) {
	return knex.schema.createTable('bookings', (table) => {
		table.increments('id').primary();
		table.integer('event_id').unsigned().notNullable();
		table.string('user_id').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());

		table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');

		// Уникальный индекс для предотвращения двойного бронирования
		table.unique(['event_id', 'user_id']);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('bookings');
};
