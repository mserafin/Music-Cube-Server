
exports.up = async knex => await knex.schema.createTable('playlist', (table) => {
    table.increments('playlistId');
    table.string('tagId', 128);
    table.string('albumId', 128);
    table.timestamps();
    table.unique('tagId');
});

exports.down = async knex => await knex.schema.dropTable('playlist');
