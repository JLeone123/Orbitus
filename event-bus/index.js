import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

// multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "genre", maxCount: 1 },
  { name: "songName", maxCount: 1 },
  { name: "artistName", maxCount: 1 },
  { name: "positivity", maxCount: 1 },
  { name: "energy", maxCount: 1 },
  { name: "rhythm", maxCount: 1 },
  { name: "liveliness", maxCount: 1 },
  { name: "mp3Audio", maxCount: 1 },
  { name: "songCover", maxCount: 1 },
]);

// import helper modules
import { checkEvent } from "./modules/checkEvent.js";
import { logger } from "./modules/logger.js";

const app = express();
const port = process.env.PORT || 4005;

// Utilize middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

// change back to 4002 and 4003
const servicePorts = [4002];

/** Ports
 * 4002 is the query service
 */

const modePort = 4003;

app.post("/events/mode", async (req, res) => {
  let modeName = req.body.data.modeName;
  let positivity = Number(req.body.data.positivity);
  let energy = Number(req.body.data.energy);
  let rhythm = Number(req.body.data.rhythm);
  let liveliness = Number(req.body.data.liveliness);
  let positivitySign = req.body.data.positivitySign;
  let energySign = req.body.data.energySign;
  let rhythmSign = req.body.data.rhythmSign;
  let livelinessSign = req.body.data.livelinessSign;
  let eventType = req.body.data.eventType;

  // validate the data

  // can maybe remove
  let modeData = {
    positivity,
    energy,
    rhythm,
    liveliness,
    positivitySign,
    energySign,
    rhythmSign,
    livelinessSign,
  };

  let newModeName = modeName.replace(/\s+/g, "-").toLowerCase();
  console.log(newModeName);
  let songs = [];
  if (eventType === "ModeGenerated") {
    try {
      // let generatedModeEvent = await fetch("http://query:4002/api/song/mode", {
      let generatedModeEvent = await fetch(
        "http://localhost:4002/api/song/mode",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(modeData),
        }
      );

      songs = await generatedModeEvent.json();
      console.log(songs);
    } catch (error) {
      res.send({ msg: error });
      return;
    }

    res.send(songs);
  }
});

app.post("/events", cpUpload, async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "POST", endpoint: "events" })
  );

  let {
    newModeName,
    positivityScore,
    energyScore,
    rhythmScore,
    livelinessScore,
    positivitySign,
    energySign,
    rhythmSign,
    livelinessSign,
    eventType,
  } = req.body.data;

  let event = {
    newModeName,
    positivityScore,
    energyScore,
    rhythmScore,
    livelinessScore,
    positivitySign,
    energySign,
    rhythmSign,
    livelinessSign,
  };

  if (eventType === "SongCreated") {
    for (const port of servicePorts) {
      try {
        console.log(
          `(${process.pid}) Event Bus (Sending Event to ${port}) ${eventType}`
        );

        // create a new FormData object
        let mp3Audio = req.files["mp3Audio"][0].buffer;
        let songCover = req.files["songCover"][0].buffer;

        let songParams = {
          genre: req.body.genre,
          songName: req.body.songName,
          artistName: req.body.artistName,
          positivity: req.body.positivity,
          energy: req.body.energy,
          rhythm: req.body.rhythm,
          liveliness: req.body.liveliness,
          mp3Audio: mp3Audio,
        };

        // let sentEvent = await fetch("http://query:4002/api/song", {
        let sentEvent = await fetch("http://localhost:4002/api/song", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(songParams),
          // headers: {
          //   "Content-Type": "application/json",
          //   Accept: "application/json",
          // },
        });

        let sentEventJson = await sentEvent.json();
        res.send({ sentEventJson });
        return;
      } catch (error) {
        res.send({ msg: error });
        return;
      }
    }
    // Sending ModeCreated event
  } else if (eventType === "ModeCreated") {
    try {
      console.log(
        `(${process.pid}) Event Bus (Sending Event to ${modePort}) ${eventType}`
      );

      // Send the SongCreated event to the query service
      // in POST requests with the event object
      // let sentEvent = await fetch(`http://modes:${modePort}/api/mode`, {
      let sentEvent = await fetch(`http://localhost:${modePort}/api/mode`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Check if the sentEvent request successfully completed
      let sentEventJson = await sentEvent.json();

      if (sentEventJson === undefined) {
        console.log("The modes service could not handle the request right now");
        res.status(500).send({
          msg: "The modes service could not handle the request right now",
        });
        return;
      }

      console.log(sentEventJson);

      res.status(200).send(sentEventJson);
      return;
    } catch (err) {
      console.log(err);
      res.status(400).send({ msg: err });
      logger.error(JSON.stringify({ msg: err }));
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
  }

  // Since only events should be sent to the event bus,
  // we check if an event was passed to the event-bus
  if (event === undefined || typeof event !== "object") {
    res.status(400).send({
      msg: "The event be an object, have an event-type, and have event data",
    });
    logger.http(
      JSON.stringify({
        message: "response",
        method: "POST",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    logger.error(
      "EventType Error: Events must be an object with a type and data object"
    );
    return;
  }

  // Check if the event object is valid and
  // contains valid data
  let isEventValid = checkEvent(event, event.type, event.data, res);

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

  const type = event.type;

  console.log(`${process.pid} Event Bus (Received Event) ${type}`);

  if (type === "SongCreated") {
    for (const port of servicePorts) {
      try {
        console.log(
          `(${process.pid}) Event Bus (Sending Event to ${port}) ${type}`
        );

        // Send the SongCreated event to the query service
        // in POST requests with the event object
        let sentEvent = await fetch(`http://localhost:${port}/events`, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(event),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Check if the sentEvent request successfully completed
        let sentEventJson = await sentEvent.json();

        const msgOne =
          "A record with the same songName and artistName is already in the database";
        if (
          sentEventJson.hasOwnProperty("msg") &&
          sentEventJson["msg"] === msgOne
        ) {
          res.status(400).send({ msg: msgOne });
          logger.error(JSON.stringify({ msg: msgOne }));
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

        // This error is for when the database cannot be accessed
        const msgTwo = "ISE: the new song could not be added to the database";
        if (
          sentEventJson.hasOwnProperty("msg") &&
          sentEventJson["msg"] === msgTwo
        ) {
          res.status(500).send({ msg: msgTwo });
          logger.error(JSON.stringify({ msg: msgTwo }));
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

        if (sentEventJson === undefined) {
          res.status(500).send({
            msg: `The Event Bus did not receive a response from port ${port}`,
          });
          logger.error(
            JSON.stringify({
              msg: `The Event Bus did not receive a response from port ${port}`,
            })
          );
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
      } catch (err) {
        console.log(err);
        res.status(400).send({ msg: err });
        logger.error(JSON.stringify({ msg: err }));
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
    }
  }

  // After the error handling is complete,
  // send a response object with an 'OK' status
  res.status(201).send({ type, msg: "OK" });
  logger.info(JSON.stringify({ type, msg: "OK" }));
  logger.http(
    JSON.stringify({
      message: "response",
      method: "POST",
      endpoint: "events",
      statusCode: res.statusCode,
    })
  );
});

app.put("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "PUT", endpoint: "events" })
  );

  // Get event object from the request body.
  let { event } = req.body;

  // Since only events should be sent to the event bus,
  // we check if an event was passed to the event-bus
  if (event === undefined || typeof event !== "object") {
    res.status(400).send({
      msg: "The event be an object, have an event-type, and have event data",
    });
    logger.http(
      JSON.stringify({
        message: "response",
        method: "PUT",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    logger.error(
      "EventType Error: Events must be an object with a type and data object"
    );
    return;
  }

  // Check if the event object is valid and
  // contains valid data
  let isEventValid = checkEvent(event, event.type, event.data, res);

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

  const type = event.type;

  console.log(`${process.pid} Event Bus (Received Event) ${type}`);

  if (type === "SongUpdated") {
    for (const port of servicePorts) {
      try {
        console.log(
          `(${process.pid}) Event Bus (Sending Event to ${port}) ${type}`
        );

        // Send the SongCreated event to the query service
        // in POST requests with the event object
        let sentEvent = await fetch(`http://localhost:${port}/events`, {
          method: "PUT",
          mode: "cors",
          body: JSON.stringify(event),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Check if the sentEvent request successfully completed
        let sentEventJson = await sentEvent.json();

        // If the HTTP request an object with msg 'Song could not be found
        // in the database, then the database did not have the song.
        const msgOne = "The song was not found in the database";
        if (
          sentEventJson.hasOwnProperty("msg") &&
          sentEventJson["msg"] === msgOne
        ) {
          res.status(404).send({
            msg: `The song with ID ${event.data["id"]} was not found in the database`,
          });
          logger.error(JSON.stringify({ msg: msgOne }));
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

        if (sentEventJson === undefined) {
          res.status(500).send({
            msg: `The Event Bus did not receive a response from port ${port}`,
          });
          logger.error(
            JSON.stringify({
              msg: `The Event Bus did not receive a response from port ${port}`,
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

        // After the error handling is complete,
        // send a response object with an 'OK' status

        // Set the default imageArt for the response image - this will be set
        // if the picture is not on the file system or if justin-lee is the artist
        // of the song that has and will be updated in the songs database and
        // on the Svelte client server.

        let imageArt = sentEventJson["updatedSong"]["imageArt"];

        const msgTwo = {
          updatedSong: {
            genre: event.data["genre"],
            songName: event.data["songName"],
            artistName: event.data["artistName"],
            mp3File: event.data["mp3File"],
            imageArt: imageArt,
            positivity: event.data["positivity"],
            energy: event.data["energy"],
            rhythm: event.data["rhythm"],
            liveliness: event.data["liveliness"],
          },
        };

        const sentSong = msgTwo["updatedSong"];
        let updatedSong = sentEventJson["updatedSong"];

        if (
          sentEventJson.hasOwnProperty("updatedSong") &&
          sentEventJson["updatedSong"]["songName"] ===
            msgTwo["updatedSong"]["songName"] &&
          sentEventJson["updatedSong"]["artistName"] ===
            msgTwo["updatedSong"]["artistName"]
        ) {
          res.status(201).send({ updatedSong });
          logger.info(
            JSON.stringify({
              msg: `Successfully updated song ${sentSong["songName"]} by ${sentSong["artistName"]}`,
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
      } catch (err) {
        console.log(err);
        res.status(400).send({ msg: err });
        logger.error(JSON.stringify({ msg: err }));
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
    }
  }
});

app.delete("/events", async (req, res) => {
  logger.http(
    JSON.stringify({ message: "request", method: "DELETE", endpoint: "events" })
  );
  // Get event object from the request body.
  let { event } = req.body;

  // Since only events should be sent to the event bus,
  // we check if an event was passed to the event-bus
  if (event === undefined || typeof event !== "object") {
    res.status(400).send({
      msg: "The event be an object, have an event-type, and have event data",
    });
    logger.http(
      JSON.stringify({
        message: "response",
        method: "DELETE",
        endpoint: "events",
        statusCode: res.statusCode,
      })
    );
    logger.error(
      "EventType Error: Events must be an object with a type and data object"
    );
    return;
  }

  let type = event.type;

  console.log(`${process.pid} Event Bus (Received Event) ${type}`);

  if (type === "SongDeleted") {
    for (const port of servicePorts) {
      try {
        console.log(
          `(${process.pid}) Event Bus (Sending Event to ${port}) ${type}`
        );

        // Send the SongCreated event to the query service
        // in POST requests with the event object
        // let sentEvent = await fetch(`http://query:${port}/events`, {
        let sentEvent = await fetch(`http://localhost:${port}/events`, {
          method: "DELETE",
          mode: "cors",
          body: JSON.stringify(event),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Check if the sentEvent request successfully completed
        let sentEventJson = await sentEvent.json();

        const msgOne = "ISE: The song could not be deleted in the database";
        if (
          sentEventJson.hasOwnProperty["msg"] &&
          sentEventJson["msg"] === msgOne
        ) {
          res.status(500).send({ msg: msgOne });
          logger.http(
            JSON.stringify({
              message: "response",
              method: "DELETE",
              endpoint: "events",
              statusCode: res.statusCode,
            })
          );
          logger.error(JSON.stringify({ msg: msgOne }));
          return;
        }

        // If the HTTP request an object with msg 'Song could not be found
        // in the database, then the database did not have the song.
        const msgTwo = "Song could not be found in the database";
        if (
          sentEventJson.hasOwnProperty("msg") &&
          sentEventJson["msg"] === msgTwo
        ) {
          res.status(404).send({
            msg: `The song with ID ${event.data["id"]} was not found in the database`,
          });
          logger.http(
            JSON.stringify({
              message: "response",
              method: "DELETE",
              endpoint: "events",
              statusCode: res.statusCode,
            })
          );
          logger.error(
            JSON.stringify({
              msg: `The song with ID ${event.data["id"]} was not found in the database`,
            })
          );
          return;
        }

        if (sentEventJson === undefined) {
          res.status(500).send({
            msg: `The Event Bus did not receive a response from port ${port}`,
          });
          logger.http(
            JSON.stringify({
              message: "response",
              method: "DELETE",
              endpoint: "events",
              statusCode: res.statusCode,
            })
          );
          logger.error(
            JSON.stringify({
              msg: `The Event Bus did not receive a response from port ${port}`,
            })
          );
          return;
        }

        let deletedSong = {
          id: sentEventJson["deletedSong"]["id"],
          genre: sentEventJson["deletedSong"]["genre"],
          songName: sentEventJson["deletedSong"]["songName"],
          artistName: sentEventJson["deletedSong"]["artistName"],
          mp3File: sentEventJson["deletedSong"]["mp3File"],
          positivity: Number(sentEventJson["deletedSong"]["positivity"]),
          energy: Number(sentEventJson["deletedSong"]["energy"]),
          rhythm: Number(sentEventJson["deletedSong"]["rhythm"]),
          liveliness: Number(sentEventJson["deletedSong"]["liveliness"]),
        };

        if (
          sentEventJson.hasOwnProperty("deletedSong") &&
          sentEventJson["deletedSong"]["songName"] === event.data["songName"] &&
          sentEventJson["deletedSong"]["artistName"] ===
            event.data["artistName"]
        ) {
          res.status(201).send({ deletedSong });
          logger.http(
            JSON.stringify({
              message: "response",
              method: "DELETE",
              endpoint: "events",
              statusCode: res.statusCode,
            })
          );
          logger.error(
            JSON.stringify({
              msg: `The song ${deletedSong["songName"]} by artist ${deletedSong["artistName"]} was successfully deleted`,
            })
          );
          return;
        }
      } catch (err) {
        console.log(err);
        res.status(400).send({ msg: err });
        logger.http(
          JSON.stringify({
            message: "response",
            method: "DELETE",
            endpoint: "events",
            statusCode: res.statusCode,
          })
        );
        logger.error(JSON.stringify({ msg: err }));
        return;
      }
    }
  }

  if (type === "ModeDeleted") {
    let id = Number(event.id);
    // let sentEvent = await fetch(`http://modes:4003/api/mode`, {
    let sentEvent = await fetch(`http://localhost:4003/api/mode`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    let sentEventJson = await sentEvent.json();
    res.send({ msg: "The mode was successfully deleted from the database!" });
    return;
  }
});

app.listen(port, () => {
  console.log(`(${process.pid}) Event Bus listening on port ${port}`);
});
