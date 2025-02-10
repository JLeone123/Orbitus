import "dotenv/config";
import pg from "pg";
import { modeList } from "./initialModes.js";

// Get the Pool class from the pg module.
const { Pool } = pg;

const ModesDatabase = (dbConfig) => {
  return {
    connect: async () => {
      const pool = new Pool(dbConfig);
      return ModeQuery(pool, await pool.connect());
    },
  };
};

const ModeQuery = (pool, client) => {
  return {
    init: async () => {
      const queryText =
        "DROP TABLE IF EXISTS modes; " +
        "CREATE TABLE IF NOT EXISTS modes (" +
        "id SERIAL PRIMARY KEY, " +
        "name VARCHAR(50) NOT NULL, " +
        "positivity NUMERIC NOT NULL, " +
        "energy NUMERIC NOT NULL, " +
        "rhythm NUMERIC NOT NULL, " +
        "liveliness NUMERIC NOT NULL, " +
        "positivity_sign VARCHAR(5) NOT NULL, " +
        "energy_sign VARCHAR(5) NOT NULL, " +
        "rhythm_sign VARCHAR(5) NOT NULL, " +
        "liveliness_sign VARCHAR(5) NOT NULL); ";

      await client.query(queryText);

      let currentInsert = "";

      for (let i = 0; i < modeList.length; ++i) {
        let currentSong = modeList[i];

        let name = currentSong["name"];
        let positivityScore = currentSong["positivity"]["score"];
        let positivitySign = currentSong["positivity"]["sign"];

        let energyScore = currentSong["energy"]["score"];
        let energySign = currentSong["energy"]["sign"];

        let rhythmScore = currentSong["rhythm"]["score"];
        let rhythmSign = currentSong["rhythm"]["sign"];

        let livelinessScore = currentSong["liveliness"]["score"];
        let livelinessSign = currentSong["liveliness"]["sign"];

        let v = [
          name,
          positivityScore,
          energyScore,
          rhythmScore,
          livelinessScore,
          positivitySign,
          energySign,
          rhythmSign,
          livelinessSign,
        ];

        currentInsert =
          "INSERT INTO modes" +
          "(name, positivity, energy, rhythm, liveliness, positivity_sign, energy_sign, rhythm_sign, liveliness_sign) VALUES " +
          "($1, $2, $3, $4, $5, $6, $7, $8, $9);";

        await client.query(currentInsert, v);
      }
    },

    /** CREATE Operations */
    createMode: async (
      newModeName,
      pScore,
      eScore,
      rScore,
      vScore,
      pSign,
      eSign,
      rSign,
      vSign
    ) => {
      // let queryTextOne = 'select * from modes where'

      let queryTextTwo =
        "insert into modes(name, positivity, energy, rhythm, liveliness, " +
        "positivity_sign, energy_sign, rhythm_sign, liveliness_sign) " +
        "values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;";
      let v = [
        newModeName,
        pScore,
        eScore,
        rScore,
        vScore,
        pSign,
        eSign,
        rSign,
        vSign,
      ];

      let newMode = await client.query(queryTextTwo, v);

      return newMode.rows;
    },

    /** READ Operations */
    readAllModes: async () => {
      let allModes = await client.query("select * from modes order by id asc;");
      return allModes.rows;
    },

    readMode: async (modeName) => {
      let queryText = "select * from modes where name = $1";
      let foundMode = await client.query(queryText, [modeName]);
      return foundMode.rows;
    },

    close: async () => {
      client.release();
      await pool.end();
    },
  };
};

export default {
  ModesDatabase,
};
