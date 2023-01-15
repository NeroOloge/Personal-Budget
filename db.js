const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "personalbudget",
  password: "nero2005",
  port: 5432,
});

module.exports = pool;
