import "dotenv/config";
import pg from "pg";
import { songList } from "../modules/initialSongs.js";

// Get the Pool class from the pg module.
const { Pool } = pg;

const SongsDatabase = (dbConfig) => {
  return {
    connect: async () => {
      const pool = new Pool(dbConfig);
      return SongQuery(pool, await pool.connect());
    },
  };
};

const SongQuery = (pool, client) => {
  return {
    init: async () => {
      const queryText =
        "DROP TABLE IF EXISTS songs; " +
        "CREATE TABLE IF NOT EXISTS songs (" +
        "id SERIAL PRIMARY KEY, " +
        "genre VARCHAR(30) NOT NULL, " +
        "song_name VARCHAR(50) NOT NULL, " +
        "artist_name VARCHAR(30) NOT NULL, " +
        "mp3_file VARCHAR(100) NOT NULL, " +
        "image_art VARCHAR(100) NOT NULL, " +
        "positivity NUMERIC NOT NULL, " +
        "energy NUMERIC NOT NULL, " +
        "rhythm NUMERIC NOT NULL, " +
        "liveliness NUMERIC NOT NULL); ";

      await client.query(queryText);

      let currentInsert = "";

      for (let i = 0; i < songList.length; ++i) {
        let currentSong = songList[i];

        let genre = currentSong["genre"];
        let songName = currentSong["songName"];
        let artistName = currentSong["artistName"];
        let mp3File = currentSong["mp3File"];
        let imageArt = currentSong["imageArt"];
        let positivity = currentSong["positivity"];
        let energy = currentSong["energy"];
        let rhythm = currentSong["rhythm"];
        let liveliness = currentSong["liveliness"];

        let v = [
          genre,
          songName,
          artistName,
          mp3File,
          imageArt,
          positivity,
          energy,
          rhythm,
          liveliness,
        ];

        currentInsert =
          "INSERT INTO songs" +
          "(genre, song_name, artist_name, mp3_file, image_art, positivity, energy, rhythm, liveliness) VALUES " +
          "($1, $2, $3, $4, $5, $6, $7, $8, $9);";

        await client.query(currentInsert, v);
      }
    },

    /** CREATE Operations */
    createSong: async (
      genre,
      songName,
      artistName,
      mp3File,
      imageArt,
      positivity,
      energy,
      rhythm,
      liveliness
    ) => {
      // Check to see if a record with the same songName and artistName is already
      // in the database
      let queryTextOne =
        "select * from songs where song_name = $1 and artist_name = $2";

      let songInDatabase = await client.query(queryTextOne, [
        songName,
        artistName,
      ]);
      let songInDatabaseRows = songInDatabase.rows;

      if (songInDatabaseRows.length === 1) {
        return [
          {
            msg: "A record with the same songName and artistName is already in the database",
          },
        ];
      }

      let queryTextTwo =
        "insert into songs(genre, song_name, artist_name, mp3_file, image_art, positivity, energy, rhythm, liveliness) " +
        "values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;";
      let v = [
        genre,
        songName,
        artistName,
        mp3File,
        imageArt,
        positivity,
        energy,
        rhythm,
        liveliness,
      ];
      let newSong = await client.query(queryTextTwo, v);

      return newSong.rows;
    },

    /** READ Operations */
    readAllSongs: async () => {
      let allSongs = await client.query("select * from songs order by id asc;");
      return allSongs.rows;
    },

    readSongById: async (id) => {
      let songById = await client.query("select * from songs where id = $1;", [
        id,
      ]);
      return songById.rows;
    },

    readSong: async (songName, artistName) => {
      let queryText =
        "select * from songs where song_name = $1 and artist_name = $2";
      let foundSong = await client.query(queryText, [songName, artistName]);
      return foundSong.rows;
    },

    readSongsByCharacteristics: async (
      positivity,
      energy,
      rhythm,
      liveliness
    ) => {
      let queryText =
        "select * from songs where positivity > $1 and " +
        "energy > $2 and rhythm > $3 and liveliness > $4;";
      let foundSongs = await client.query(queryText, [
        positivity,
        energy,
        rhythm,
        liveliness,
      ]);
      return foundSongs.rows;
    },

    readSongsByCharacteristicsAndGenre: async (
      genre,
      positivity,
      energy,
      rhythm,
      liveliness
    ) => {
      let queryText =
        "select * from songs where genre = $1 and positivity > $2 and " +
        "energy > $3 and rhythm > $4 and liveliness > $5;";

      let foundSongs = await client.query(queryText, [
        genre,
        positivity,
        energy,
        rhythm,
        liveliness,
      ]);
      return foundSongs.rows;
    },

    readSongsByMode: async (
      positivity,
      energy,
      rhythm,
      liveliness,
      positivitySign,
      energySign,
      rhythmSign,
      livelinessSign
    ) => {
      let queryText =
        `select * from songs where positivity ${positivitySign} $1 and ` +
        `energy ${energySign} $2 and rhythm ${rhythmSign} $3 and liveliness ${livelinessSign} $4`;

      let v = [positivity, energy, rhythm, liveliness];
      let foundSongs = await client.query(queryText, v);
      return foundSongs.rows;
    },

    /** UPDATE Operations */
    updateSong: async (
      genre,
      songName,
      artistName,
      mp3File,
      imageArt,
      positivity,
      energy,
      rhythm,
      liveliness
    ) => {
      let queryText =
        "UPDATE songs " +
        "set genre = $1, mp3_file = $2, image_art = $3, " +
        "positivity = $4, energy = $5, rhythm = $6, liveliness = $7 " +
        "where song_name = $8 and artist_name = $9 returning *";
      let updatedArray = [
        genre,
        mp3File,
        imageArt,
        positivity,
        energy,
        rhythm,
        liveliness,
        songName,
        artistName,
      ];
      let res = await client.query(queryText, updatedArray);
      return res.rows;
    },

    deleteSong: async (songName, artistName) => {
      let res = await client.query(
        "delete from songs where song_name = $1 and artist_name = $2 returning *",
        [songName, artistName]
      );

      return res.rows;
    },

    close: async () => {
      client.release();
      await pool.end();
    },
  };
};

export default {
  SongsDatabase,
};
