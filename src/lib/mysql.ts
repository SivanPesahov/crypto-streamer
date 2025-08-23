import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "pesahov2258",
  database: "crypto_streamer",
});
