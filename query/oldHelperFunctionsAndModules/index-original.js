// import pg from 'pg';
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import crypto from "crypto";

import "dotenv/config";
import Store from "./store.js";
import { checkEvent } from "../modules/checkEvent.js";
import { logger } from "../modules/logger.js";

const app = express();

// Install middleware, use Morgan for logging requests.
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

let user = process.env.USERNAME;
let password = process.env.PASSWORD;
let host = process.env.HOST;
let port = process.env.PORT;
let dbPort = process.env.DBPORT || 5432;
let database = process.env.DATABASE;

const dbConfig = { user, password, host, dbPort, database };

// Store.SongsDatabase returns object that lets
// the query service access the songs database
// in PostgreSQL.
const songDb = Store.SongsDatabase(dbConfig);

// Query service endpoints

/** POST Requests */
app.post("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "POST", endpoint: "events" })
  );
  const event = req.body;
  const query = await songDb.connect();
  let type = event.type;
  let data = event.data;

  let isEventValid = checkEvent(event, type, data, res);

  if (!isEventValid) {
    logger.http(
      JSON.stringify({
        message: "response",
        method: "POST",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    return;
  }

  // Handle SongCreated events by adding a song
  // to the songs database
  if (type === "SongCreated") {
    let genre = data["genre"];
    let songName = data["songName"];
    let artistName = data["artistName"];
    let mp3File = data["mp3File"];
    let imageArt = data["imageArt"];
    let positivity = data["positivity"];
    let energy = data["energy"];
    let rhythm = data["rhythm"];
    let liveliness = data["liveliness"];

    let newSong = await query.createSong(
      genre,
      songName,
      artistName,
      mp3File,
      imageArt,
      positivity,
      energy,
      rhythm,
      liveliness
    );

    let songInDatabaseMessage =
      "A record with the same songName and artistName is already in the database";

    if (newSong[0]["msg"] === songInDatabaseMessage) {
      // error handling here - fix error handling for all events.
      res.status(400).send({ msg: songInDatabaseMessage });
      logger.http(
        JSON.stringify({
          message: "response",
          method: "POST",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      return;
    }

    if (newSong === undefined) {
      res
        .status(500)
        .send({ msg: "ISE: the new song could not be added to the database" });
      logger.http(
        JSON.stringify({
          message: "response",
          method: "POST",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      return;
    }

    res.status(201).send({ newSong });
    logger.http(
      JSON.stringify({
        message: "response",
        method: "POST",
        endpoint: "/events",
        statusCode: res.statusCode,
      })
    );
    logger.info(
      JSON.stringify({
        message: `Successfully added song ${songName} by artist ${artistName}`,
      })
    );
    return;
  }
});

/** GET Requests */
app.get("/allSongs", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "GET", endpoint: "allSongs" })
  );
  // Connect to the song database
  const query = await songDb.connect();

  // Read all of the songs in the song database
  let allSongs = await query.readAllSongs();
  console.log(allSongs);

  if (allSongs === undefined) {
    res.status(500).send({
      msg: "Sorry, the songs could not be retrieved from the songs database",
    });
    logger.error(
      JSON.stringify({
        msg: "Sorry, the songs could not be retrieved from the songs database",
      })
    );
    logger.http(
      JSON.stringify({
        message: "response",
        method: "GET",
        endpoint: "allSongs",
        statusCode: res.statusCode,
      })
    );
    return;
  }

  // Close the connection to the song database
  query.close();

  // Send the list of songs back to the client
  res.status(200).send({ songs: allSongs });
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "allSongs",
      statusCode: res.statusCode,
    })
  );
  logger.info(JSON.stringify({ msg: "Successfully retrieved all songs!" }));
});

app.get("/getSongById", async (req, res) => {
  logger.http(
    JSON.stringify({
      message: "request",
      method: "GET",
      endpoint: "getSongById",
    })
  );
  let { id } = req.body;

  if (id === undefined || id % 1 !== 0 || typeof id !== "number" || id <= 0) {
    let msg =
      "To get a song, provide a positive integer song ID in the request body";
    res.status(400).send({ msg });
    logger.error(JSON.stringify({ msg }));
    return;
  }

  // Connect to the song database
  const query = await songDb.connect();

  let songById = await query.readSongById(id);

  if (songById.length === 0) {
    res
      .status(404)
      .send({ msg: "The song could not be found in the database" });
    logger.error(
      JSON.stringify({ msg: "The song could not be found in the database " })
    );
    return;
  }

  if (songById === undefined) {
    let msg = "Sorry, the song could not be retrieved from the songs database";
    res.status(500).send({ msg });
    logger.error(
      JSON.stringify({
        msg: "Sorry, the song could not be retrieved from the songs database",
      })
    );
    return;
  }

  query.close();

  // Send retrieved song by its id back to the client
  res.status(200).send({ song: songById });
  logger.info(
    JSON.stringify({
      msg: `Successfully retrieved song ${songById[0]["song_name"]} with ID ${songById[0]["id"]}`,
    })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "getSongById",
      statusCode: res.statusCode,
    })
  );
});

app.get("/getSong", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "GET", endpoint: "getSong" })
  );
  let { songName, artistName } = req.body;

  if (songName === undefined || artistName === undefined) {
    res.status(400).send({
      msg: "Please provide a song name and an artist name to get a song",
    });
    logger.error(
      JSON.stringify({
        msg: "Please provide a song name and an artist name to get a song",
      })
    );
    return;
  }

  if (typeof songName !== "string" || typeof artistName !== "string") {
    res.status(400).send({
      msg: "Please provide the song name and an artist name as strings",
    });
    logger.error(
      JSON.stringify({
        msg: "Please provide the song name and an artist name as strings",
      })
    );
    return;
  }

  if (songName.trim().length === 0 || artistName.trim().length === 0) {
    res
      .status(400)
      .send({ msg: "Please provide a non-empty song name or artist name" });
    logger.error(
      JSON.stringify({
        msg: "Please provide a non-empty song name or artist name",
      })
    );
    return;
  }

  const query = await songDb.connect();

  let foundSong = await query.readSong(songName, artistName);

  if (foundSong.length === 0) {
    res
      .status(404)
      .send({ msg: "The song could not be found in the database" });
    logger.error(
      JSON.stringify({ msg: "The song could not be found in the database" })
    );
    return;
  }

  if (foundSong === undefined) {
    res
      .status(500)
      .send({ msg: "The song could not be retrieved in the database" });
    logger.error(
      JSON.stringify({ msg: "The song could not be retrieved in the database" })
    );
    return;
  }

  res.status(200).send({ foundSong });
  logger.info(
    JSON.stringify({
      msg: `Successfully retrieved song ${foundSong[0]["song_name"]} with ID ${foundSong[0]["id"]}`,
    })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "getSong",
      statusCode: res.statusCode,
    })
  );
});

app.get(
  "/getSongsByCharacteristics/:positivityRange/:energyRange/:rhythmRange/:livelinessRange",
  async (req, res) => {
    let { positivity, energy, rhythm, liveliness } = req.params;

    const query = await songDb.connect();
    const foundSongs = await query.readSongsByCharacteristics(
      positivityRange,
      energyRange,
      rhythmRange,
      livelinessRange
    );

    if (foundSongs === undefined) {
      res.status(500).send({
        msg: "The query service could not return the requested foundSongs playlist right now",
      });
      return;
    }

    if (foundSongs.length === 0) {
      res.status(404).send({
        msg: "There are no songs that meet the criteria for the foundSongs playlist",
      });
      return;
    }

    res.send({ foundSongs });
  }
);

app.get(
  "/getSongsByCharacteristicsAndGenre/:genre/:positivityRange/:energyRange/:rhythmRange/:livelinessRange",
  async (req, res) => {
    let { genre, positivityRange, energyRange, rhythmRange, livelinessRange } =
      req.params;

    const query = await songDb.connect();
    const foundSongs = await query.readSongsByCharacteristicsAndGenre(
      genre,
      positivityRange,
      energyRange,
      rhythmRange,
      livelinessRange
    );

    if (foundSongs === undefined) {
      res.status(500).send({
        msg: "The query service could not return the requested foundSongs playlist right now",
      });
      return;
    }

    if (foundSongs.length === 0) {
      res.status(404).send({
        msg: "There are no songs that meet the criteria for the foundSongs playlist",
      });
      return;
    }

    res.send({ foundSongs });
  }
);

app.get(
  "/getSongsByMode/:positivity/:energy/:rhythm/:liveliness/:positivityScore/:energyScore/:rhythmScore/:livelinessScore",
  async (req, res) => {
    let {
      positivity,
      energy,
      rhythm,
      liveliness,
      positivityScore,
      energyScore,
      rhythmScore,
      livelinessScore,
    } = req.params;
    console.log(
      positivity,
      energy,
      rhythm,
      liveliness,
      positivityScore,
      energyScore,
      rhythmScore,
      livelinessScore
    );
    // res.status(200).send({ msg: 'OK'});

    const query = await songDb.connect();
    const foundSongs = await query.readSongsByMode(
      positivity,
      energy,
      rhythm,
      liveliness,
      positivityScore,
      energyScore,
      rhythmScore,
      livelinessScore
    );

    res.status(200).send({ foundSongs });
  }
);

/** PUT Requests */
app.put("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "PUT", endpoint: "events" })
  );
  // must provide genre, song_name, artist_name
  // mp3File, positivity, energy, rhythm, liveliness
  const event = req.body;
  const query = await songDb.connect();
  let type = event.type;
  let data = event.data;

  let isEventValid = checkEvent(event, type, data, res);

  if (!isEventValid) {
    logger.http(
      JSON.stringify({
        message: "response",
        method: "PUT",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    return;
  }

  if (type === "SongUpdated") {
    let {
      genre,
      songName,
      artistName,
      mp3File,
      imageArt,
      positivity,
      energy,
      rhythm,
      liveliness,
    } = event.data;
    let foundSong = await query.updateSong(
      genre,
      songName,
      artistName,
      mp3File,
      imageArt,
      positivity,
      energy,
      rhythm,
      liveliness
    );

    if (foundSong.length === 0) {
      res.status(404).send({ msg: "The song was not found in the database" });
      logger.error(
        JSON.stringify({ msg: "The song was not found in the database" })
      );
      logger.http(
        JSON.stringify({
          message: "response",
          method: "PUT",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      return;
    }

    let newGenre = foundSong[0]["genre"];
    let newSongName = foundSong[0]["song_name"];
    let newArtistName = foundSong[0]["artist_name"];
    let newMp3File = foundSong[0]["mp3_file"];
    let newImageArt = foundSong[0]["image_art"];
    let newPositivity = Number(foundSong[0]["positivity"]);
    let newEnergy = Number(foundSong[0]["energy"]);
    let newRhythm = Number(foundSong[0]["rhythm"]);
    let newLiveliness = Number(foundSong[0]["liveliness"]);

    // Check if the returned record has the updated data
    if (
      newGenre === genre &&
      newSongName === songName &&
      newArtistName === artistName &&
      newMp3File === mp3File &&
      newPositivity === positivity &&
      newEnergy === energy &&
      newRhythm === rhythm &&
      newLiveliness === liveliness
    ) {
      let updatedSong = {
        genre: newGenre,
        songName: newSongName,
        artistName: newArtistName,
        mp3File: newMp3File,
        imageArt: newImageArt,
        positivity: newPositivity,
        energy: newEnergy,
        rhythm: newRhythm,
        liveliness: newLiveliness,
      };

      res.status(201).send({ updatedSong });
      logger.http(
        JSON.stringify({
          message: "response",
          method: "PUT",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      logger.info(
        JSON.stringify({
          msg: `The song ${songName} by ${artistName} was added to the database`,
        })
      );
      return;
    }

    res.status(500).send(
      JSON.stringify({
        msg: "The song could not be updated in the songs database",
      })
    );
    logger.http(
      JSON.stringify({
        message: "response",
        method: "PUT",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    return;
  }
});

/** DELETE requests */
app.delete("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "DELETE", endpoint: "events" })
  );
  const event = req.body;

  let isEventValid = checkEvent(event, event.type, event.data, res);

  if (!isEventValid) {
    logger.http(
      JSON.stringify({
        message: "response",
        method: "DELETE",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    return;
  }

  const query = await songDb.connect();
  let type = event.type;
  let data = event.data;

  if (type === "SongDeleted") {
    let { songName, artistName } = data;

    let foundSong = await query.deleteSong(songName, artistName);

    if (foundSong === undefined) {
      res
        .status(500)
        .send({ msg: "ISE: The song could not be deleted in the database" });
      logger.error(
        JSON.stringify({
          msg: "ISE: The song could not be deleted in the database",
        })
      );
      logger.http(
        JSON.stringify({
          message: "response",
          method: "DELETE",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      return;
    }

    if (foundSong.length === 0) {
      res.status(404).send({ msg: "Song could not be found in the database" });
      logger.error(
        JSON.stringify({ msg: "ISE: Song could not be found in the database" })
      );
      logger.http(
        JSON.stringify({
          message: "response",
          method: "DELETE",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
      return;
    }

    let deletedSong = {
      id: foundSong[0]["id"],
      genre: foundSong[0]["genre"],
      songName: foundSong[0]["song_name"],
      artistName: foundSong[0]["artist_name"],
      mp3File: foundSong[0]["mp3_file"],
      positivity: foundSong[0]["positivity"],
      energy: foundSong[0]["energy"],
      rhythm: foundSong[0]["rhythm"],
      liveliness: foundSong[0]["liveliness"],
    };

    // If the returned song name and artist name in the song object is the same as the arguments
    // that were passed in, then the song was successfully deleted from the database.
    if (
      songName === deletedSong["songName"] &&
      artistName === deletedSong["artistName"]
    ) {
      res.status(201).send({ deletedSong });
      logger.info(
        JSON.stringify({
          msg: `Successfully deleted song ${foundSong[0]["song_name"]} with artist name ${foundSong[0]["artistName"]}`,
        })
      );
      logger.http(
        JSON.stringify({
          message: "response",
          method: "DELETE",
          endpoint: "events",
          statusCode: res.statusCode,
        })
      );
    }
  }
});

// 1. To run server in development mode, run "npm run dev"
// in the root directory
// 2. To run the server in production mode with PM2, run
// "npm run start" in the root directory
app.listen(port, async () => {
  // Connect to the song database
  const query = await songDb.connect();

  // On starting the server, create tables for the songs database.
  await query.init();

  // close connection to the database after creating the
  // tables to let other users make queries
  await query.close();

  logger.info(`(${process.pid}) Query Service: Listening on port ${port}`);
  console.log(`(${process.pid}) Query Service: Listening on port ${port}`);
});
