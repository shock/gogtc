import 'ts-node/register'

// Update with your config settings.

const config = {

  test: {
    client: "postgresql",
    connection: {
      database: "gog_test",
      user: "gog",
      password: "gog"
    },
    pool: {
      min: 3,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  development: {
    client: "postgresql",
    connection: {
      database: "gog",
      user: "gog",
      password: "gog"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

export default config;
module.exports = config;