exports.seed = function (knex) {
	return knex('events')
		.del()
		.then(function () {
			return knex('events').insert([
				{
					id: 1,
					name: 'Концерт рок-группы',
					total_seats: 100,
				},
				{
					id: 2,
					name: 'Театральная премьера',
					total_seats: 50,
				},
				{
					id: 3,
					name: 'Научная конференция',
					total_seats: 200,
				},
			]);
		});
};
