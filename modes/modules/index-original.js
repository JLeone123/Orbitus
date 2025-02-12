// import pg from 'pg';
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import "dotenv/config";
import Store from "./store.js";
import { checkEvent } from "./checkEvent.js";
import { logger } from "./logger.js";

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
const modesDb = Store.ModesDatabase(dbConfig);

app.post("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "POST", endpoint: "events" })
  );
  const event = req.body;
  const query = await modesDb.connect();
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

  if (type === "ModeCreated") {
    let newModeName = data["newModeName"];
    let positivityScore = data["positivityScore"];
    let energyScore = data["energyScore"];
    let rhythmScore = data["rhythmScore"];
    let livelinessScore = data["livelinessScore"];

    let positivitySign = data["positivitySign"];
    let energySign = data["energySign"];
    let rhythmSign = data["rhythmSign"];
    let livelinessSign = data["livelinessSign"];

    let newMode = await query.createMode(
      newModeName,
      positivityScore,
      energyScore,
      rhythmScore,
      livelinessScore,
      positivitySign,
      energySign,
      rhythmSign,
      livelinessSign
    );
    query.close();

    res.status(200).send({ newMode });
    logger.http(
      JSON.stringify({
        message: "response",
        method: "POST",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    logger.info(JSON.stringify({ msg: "Successfully created new mode" }));
  }
});

app.get("/readAllModes", async (req, res) => {
  // Connect to the modes database
  const query = await modesDb.connect();

  // Read all of the modes in the song database
  let allModes = await query.readAllModes();

  if (allModes === undefined) {
    res.status(500).send({
      msg: "Sorry, the modes could not be retrieved from the modes database",
    });
    logger.error(
      JSON.stringify({
        msg: "Sorry, the modes could not be retrieved from the modes database",
      })
    );
    logger.http(
      JSON.stringify({
        message: "response",
        method: "GET",
        endpoint: "readAllModes",
        statusCode: res.statusCode,
      })
    );
    return;
  }

  // Close the connection to the modes database
  query.close();

  // Send the list of modes back to the client
  res.status(200).send({ modes: allModes });
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "allModes",
      statusCode: res.statusCode,
    })
  );
  logger.info(JSON.stringify({ msg: "Successfully retrieved all modes!" }));
});

app.get("/readModeByName/:modeName", async (req, res) => {
  let { modeName } = req.params;

  if (modeName === undefined) {
    res.status(400).send({ msg: "Please provide a mode name" });
    logger.error(JSON.stringify({ msg: "Please provide a mode name" }));
    return;
  }

  if (typeof modeName !== "string") {
    res.status(400).send({ msg: "Please provide the mode name as a string" });
    logger.error(
      JSON.stringify({ msg: "Please provide the modeName as a strings" })
    );
    return;
  }

  if (modeName.trim().length === 0) {
    res.status(400).send({ msg: "Please provide a non-empty modeName" });
    logger.error(
      JSON.stringify({ msg: "Please provide a non-empty modeName" })
    );
    return;
  }

  const query = await modesDb.connect();

  let foundMode = await query.readMode(modeName);

  if (foundMode.length === 0) {
    res
      .status(404)
      .send({ msg: "The mode could not be found in the modes database" });
    logger.error(
      JSON.stringify({ msg: "The mode could not be found in the database" })
    );
    return;
  }

  if (foundMode === undefined) {
    res
      .status(500)
      .send({ msg: "The mode could not be retrieved in the modes database" });
    logger.error(
      JSON.stringify({ msg: "The mode could not be retrieved in the database" })
    );
    return;
  }

  res.status(200).send({ foundMode });
  logger.info(JSON.stringify({ msg: `Successfully retrieved mode` }));
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "/readModeByName/:modeName",
      statusCode: res.statusCode,
    })
  );
});

// 1. To run server in development mode, run "npm run dev"
// in the root directory
// 2. To run the server in production mode with PM2, run
// "npm run start" in the root directory
app.listen(port, async () => {
  // Connect to the song database
  const modes = await modesDb.connect();

  // On starting the server, create tables for the songs database.
  await modes.init();

  // close connection to the database after creating the
  // tables to let other users make queries
  await modes.close();

  logger.info(`(${process.pid}) Modes Service: Listening on port ${port}`);
  console.log(`(${process.pid}) Modes Service: Listening on port ${port}`);
});
