const knexfile = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './db.sqlite'
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'migrations'
        }
    }
};

module.exports = knexfile;
