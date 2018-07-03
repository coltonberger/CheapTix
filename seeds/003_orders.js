
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert([
        {id: 1, user_id: 1, event_id: 1}
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));"
      )
    })
};
