import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

let user = process.env.USERNAME;
let password = process.env.PASSWORD;
let host = process.env.HOST;
let port = process.env.PORT;
let database = process.env.DATABASE;

const dbConfig = { user, password, host, port, database };

let songs;

const read = async () => {
  try {
    if (!songs) {
      const pool = new Pool(dbConfig);
      const client = await pool.connect();
      const currentSongsQuery = await client.query("SELECT * FROM song_list");
      songs = currentSongsQuery["rows"];
      client.release();
    }

    return songs;
  } catch (err) {
    console.log(err);
  }
};

const createSong = async (id, name) => {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();

  const queryText =
    "INSERT INTO song_list (id, song_name) " +
    "VALUES ($1, $2) " +
    "RETURNING *";

  // console.log(queryText);
  const res = await client.query(queryText, [id, name]);
  return res.rows;
};

export default {
  read,
  createSong,
};
