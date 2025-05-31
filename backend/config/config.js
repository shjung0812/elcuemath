require('dotenv').config({ path: require('path').resolve(__dirname, '../..', '.env') });
module.exports = {
  development: {
    username: process.env.DB_USER || 'your_dev_username',
    password: process.env.DB_PASSWORD || 'your_dev_password',
    database: process.env.DB_NAME || 'your_dev_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER || 'your_test_username',
    password: process.env.DB_PASSWORD || 'your_test_password',
    database: process.env.DB_NAME || 'your_test_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    use_env_variable: process.env.DATABASE_URL,
  }
};