/**** Express app, middleware, and library imports ****/
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express, { json } from "express";
import multer from "multer";

/**** Helper module imports ****/
import { generateCondition } from "./modules/generateCondition.js";
import { generateUniqueCallerReference } from "./modules/generateUniqueCallerReference.js";
import { generateSignedUrls } from "./modules/generateSignedUrls.js";

/**** Winston logger import ****/
import { logger } from "./modules/logger.js";

/**** Amazon S3 Client imports ****/
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**** Prisma imports ****/
import { SongsDB } from "./modules/store.js";

/**** Amazon CloudFront imports ****/
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { validateScores } from "./modules/validateScores.js";
import { generatePrismaData } from "./modules/generatePrismaData.js";
import { validateCharacteristics } from "./modules/validateCharacteristics.js";
import { generatePrismaCreateData } from "./modules/generatePrismaCreateData.js";
import { validateMode } from "./modules/validateMode.js";
import { deleteSongsInCloud } from "./modules/deleteSongsInCloud.js";
import { deleteArtworkInCloud } from "./modules/deleteArtworkInCloud.js";

// Install middleware, use Morgan for logging requests.
const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

// Setup storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Declare and initialize Amazon S3,
// Amazon CloudFront, and Prisma
// environment variables
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
const cloudFrontUrl = process.env.CLOUD_FRONT_URL;
const cloudFrontDistId = process.env.CLOUD_FRONT_DIST_ID;
const cloudFrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;

// Create a new Amazon S3 Client object
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

// Create an Amazon CloudFront object
const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: process.env.BUCKET_REGION,
});

// Upload middleware for Multer
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

// Create a new Prisma Client
const SongsQuery = SongsDB().connect();

app.get("/api/songs", async (req, res) => {
  // Retrieving all songs from the Prisma songs db
  const songs = await SongsQuery.getSongs();

  if (songs.length === 0) {
    res.status(404).send({ msg: "No songs were found in the database" });
    logger.error(
      JSON.stringify({ msg: "404 - No songs were found in the database" })
    );
    return;
  }

  // Utilizing the songs from Prisma to generate signedUrls for each image
  logger.info(
    JSON.stringify({ msg: "Generating signed urls for each retrieved song" })
  );
  let newSongs = songs.map((s) =>
    generateSignedUrls(
      s,
      cloudFrontUrl,
      1,
      cloudFrontPrivateKey,
      cloudFrontKeyPairId
    )
  );

  res.status(200).send(newSongs);

  // Logging success message and HTTP request information.
  logger.info(
    JSON.stringify({ msg: "Successfully retrieved songs from the database!" })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "/api/songs",
      statusCode: res.statusCode,
    })
  );
});

app.get(
  "/api/songs/generate/:genre/:positivity/:energy/:rhythm/:liveliness",
  async (req, res) => {
    // Validating fields
    const characteristics = req.params;
    const newCharacteristics = validateScores(characteristics);

    if (newCharacteristics === null) {
      // can make this error message more specific later.
      res.status(400).send({ msg: "Error validating data" });
      logger.error({ msg: "Error validating data" });
      return;
    }

    // Get songs by genre and/or characteristics
    const data = generatePrismaData(newCharacteristics);

    // Letting potential query have zero songs.
    // This would be the playlist of songs that match those
    // characteristics.
    let songs = await SongsQuery.filterSongs(data);

    // use helper function
    let newSongs = songs.map((s) =>
      generateSignedUrls(
        s,
        cloudFrontUrl,
        1,
        cloudFrontPrivateKey,
        cloudFrontKeyPairId
      )
    );

    res.status(200).send({ foundSongs: newSongs });

    // Logging success message and HTTP request information.
    logger.info(
      JSON.stringify({ msg: "Successfully retrieved songs from the database!" })
    );
    logger.http(
      JSON.stringify({
        message: "response",
        method: "GET",
        endpoint:
          "/api/songs/generate/:genre/:positivity/:energy/:rhythm/:liveliness",
        statusCode: res.statusCode,
      })
    );
  }
);

app.post("/api/song", cpUpload, async (req, res) => {
  let mp3Audio = req.files.mp3Audio;
  let songCover = req.files.songCover;

  // Validate new song's characteristics
  let newCharacteristics = validateCharacteristics(
    req.body,
    mp3Audio,
    songCover
  );

  // Sending appropriate message in the response in the case
  // the song could not be created.
  if (!newCharacteristics) {
    res
      .status(400)
      .send({ msg: "Error - Could not validate new song characteristics" });
    logger.error(
      JSON.stringify({
        msg: "Error - Could not validate new song characteristics",
      })
    );
    return;
  }

  let { newData, newMp3Audio, newSongCover } = newCharacteristics;

  // Get song and image art extensions
  let originalSongName = newMp3Audio["originalname"];
  let originalArtName = newSongCover["originalname"];
  let songExtension = originalSongName.slice(
    originalSongName.lastIndexOf(".") + 1
  );
  let coverArtExtension = originalArtName.slice(
    originalArtName.lastIndexOf(".") + 1
  );

  // Check if the song is in the database
  // with the validated song and artist names.
  const songCheck = await SongsQuery.filterSongs({
    title: newData["songName"],
    artist_name: newData["artistName"],
  });

  const artistCheck = await SongsQuery.filterSongs({
    artist_name: newData["artistName"],
  });

  // Checking to see if the artist ID and song ID is in the database,
  // can better implement this at some point.
  let songId = "";
  let artistId = "";

  if (songCheck.length > 0) {
    songId = songCheck[0]["title"] || "";
  }

  if (artistCheck.length > 0) {
    artistId = artistCheck[0]["artist_id"] || "";
  }

  newData["songExtension"] = songExtension;
  newData["coverArtExtension"] = coverArtExtension;
  newData["songId"] = songId;
  newData["artistId"] = artistId;

  let data = generatePrismaCreateData(newData);

  const imageParams = {
    Bucket: bucketName,
    Key: `${data["image_art"]}`,
    Body: newSongCover.buffer,
    ContentType: `image/${coverArtExtension}`,
  };

  const songParams = {
    Bucket: bucketName,
    Key: `${data["audio"]}`,
    Body: newMp3Audio.buffer,
    ContentType: `audio/${songExtension}`,
  };

  const createImageCommand = new PutObjectCommand(imageParams);
  await s3.send(createImageCommand);

  const createSongCommand = new PutObjectCommand(songParams);
  await s3.send(createSongCommand);

  // Create a new song
  const newSong = await SongsQuery.createSong(data);
  res.status(201).send(newSong);

  logger.info(
    JSON.stringify({ msg: `Successfully created new song ${newSong["title"]}` })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "POST",
      endpoint: "/api/song",
      statusCode: res.statusCode,
    })
  );
});

app.post("/api/song/mode", async (req, res) => {
  // Check mode characteristics data.
  let { ...modeCharacteristics } = req.body.event.data;
  let modeCharacteristicsCheck = validateMode(modeCharacteristics);

  if (!modeCharacteristicsCheck) {
    res.status(400).send({
      msg: "The provided characteristics are invalid.  Valid scores are between 1 and 100 inclusive and valid signs include >, <, >=, and <=",
    });
    logger.error({
      msg: "Error - The provided characteristics are invalid.  Valid scores are between 1 and 100 inclusive and valid signs include >, <, >=, and <=",
    });
    return;
  }

  let { positivitySign, energySign, rhythmSign, livelinessSign } =
    modeCharacteristics;
  let { positivity, energy, rhythm, liveliness } = modeCharacteristics;
  let newData = {
    positivity: generateCondition(positivitySign, Number(positivity)),
    energy: generateCondition(energySign, Number(energy)),
    rhythm: generateCondition(rhythmSign, Number(rhythm)),
    liveliness: generateCondition(livelinessSign, Number(liveliness)),
  };

  // Filter songs by characteristics and genre.
  let songs = await SongsQuery.filterSongs(newData);

  // Generate signed urls for each song.
  let newSongs = songs.map((s) =>
    generateSignedUrls(
      s,
      cloudFrontUrl,
      1,
      cloudFrontPrivateKey,
      cloudFrontKeyPairId
    )
  );

  res.status(201).send({ foundSongs: newSongs });

  logger.info(
    JSON.stringify({ msg: "Successfully generated new playlist mode" })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "POST",
      endpoint: "/api/song/mode",
      statusCode: res.statusCode,
    })
  );
});

app.put("/api/song", cpUpload, async (req, res) => {
  let { genre, songName, artistName, positivity, energy, rhythm, liveliness } =
    req.body;

  let songCharacteristics = {
    genre,
    songName,
    artistName,
    positivity,
    energy,
    rhythm,
    liveliness,
  };

  let mp3Audio = req.files.mp3Audio;
  let songCover = req.files.songCover;

  // Validate song data.
  let newCharacteristics = validateCharacteristics(
    songCharacteristics,
    mp3Audio,
    songCover
  );

  if (!newCharacteristics) {
    res.status(400).send({
      msg: "The provided characteristics are invalid.  Valid scores are between 1 and 100 inclusive and valid signs include >, <, >=, and <=",
    });
    logger.error({
      msg: "Error - The provided characteristics are invalid.  Valid scores are between 1 and 100 inclusive and valid signs include >, <, >=, and <=",
    });
    return;
  }

  // Get matching songs from db. This can be updated at some point to work
  // directly with song ids
  let queryData = {
    title: newCharacteristics["newData"]["songName"],
    artist_name: newCharacteristics["newData"]["artistName"],
  };

  const songs = await SongsQuery.filterSongs(queryData);

  if (songs.length === 0) {
    res.status(404).send({
      msg: "No songs were found with the given song and artist name!",
    });
    return;
  }

  const artistQueryData = {
    artist_name: artistName,
  };

  // Delete found songs in the S3 bucket
  // and invalidate the CloudFront cache
  let params = {
    Bucket: bucketName,
  };

  const cloudFrontSongParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 1,
      },
    },
  };

  await deleteSongsInCloud(songs, s3, cloudFront, params, cloudFrontSongParams);

  // Getting the song and artist IDs
  // to properly update AWS.
  const songId = songs[0]["song_id"];
  const artistId = songs[0]["artist_id"];

  let { newData, newMp3Audio, newSongCover } = newCharacteristics;

  // Get song and image art extensions to generate image file path
  let originalSongName = newMp3Audio["originalname"];
  let originalArtistName = newSongCover["originalname"];
  let songExtension = originalSongName.slice(
    originalSongName.lastIndexOf(".") + 1
  );
  let coverArtExtension = originalArtistName.slice(
    originalArtistName.lastIndexOf(".") + 1
  );

  // Prepare argument for generatePrismaCreateData.
  // This is to ensure that the correct extension is passed
  // to the new song data.
  newData["songExtension"] = songExtension;
  newData["coverArtExtension"] = coverArtExtension;
  newData["songId"] = songId;
  newData["artistId"] = artistId;

  let data = generatePrismaCreateData(newData);

  // Add the song object back to AWS.
  const songParams = {
    Bucket: bucketName,
    Key: `${data["audio"]}`,
    Body: newMp3Audio.buffer,
    ContentType: `audio/${songExtension}`,
  };

  const createSongCommand = new PutObjectCommand(songParams);
  await s3.send(createSongCommand);

  // Get number of artist songs to ensure artwork is not deleted.
  const artistSongs = await SongsQuery.filterSongs(artistQueryData);
  const imageArtwork = songs[0]["title"];

  const cloudFrontImageParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 1,
      },
    },
  };

  await deleteArtworkInCloud(
    artistSongs,
    s3,
    cloudFront,
    params,
    cloudFrontImageParams,
    imageArtwork
  );

  const imageParams = {
    Bucket: bucketName,
    Key: `${data["image_art"]}`,
    Body: newSongCover.buffer,
    ContentType: `image/${coverArtExtension}`,
  };

  const createImageCommand = new PutObjectCommand(imageParams);
  await s3.send(createImageCommand);

  for (let song of songs) {
    await SongsQuery.updateSong(song["id"], data);
  }

  // Send success message
  res.status(200).send({
    msg: "The song was successfully updated in the database and in the cloud!",
  });

  logger.info(
    JSON.stringify({
      msg: `Successfully updated the song in the databased and in the cloud!`,
    })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "PUT",
      endpoint: "/api/song",
      statusCode: res.statusCode,
    })
  );
});

app.delete("/api/song", async (req, res) => {
  // Can later finetune this more for other cases.
  // Thinking that I can just make a modal with songs, choose the song,
  // which can consist of the song's ID, cover art, name, and artist.
  // The user can choose which song to delete, which will send a fetch request
  // to this endpoint. will be able to delete the song using this query here.
  const { event } = req.body;

  // Get song and artist name to delete from the SongDeleted event.
  const { songName, artistName } = event["data"];

  // Validate song and artistName.
  if (
    !songName ||
    !artistName ||
    typeof songName !== "string" ||
    typeof artistName !== "string" ||
    songName.length === 0 ||
    artistName.length === 0
  ) {
    res.status(400).send({
      msg: "Either the song name or artist name is invalid. A valid song name and artist name has a length between 1 and 150 characters.",
    });
    logger.error({
      msg: "Either the song name or artist name is invalid. A valid song name and artist name has a length between 1 and 150 characters.",
    });
    return;
  }

  let queryData = {
    title: songName,
    artist_name: artistName,
  };

  // Check if song is in the database.
  const songs = await SongsQuery.filterSongs(queryData);

  if (songs.length === 0) {
    res.status(404).send({ msg: `The requested song could not be found` });
    logger.error({ msg: "The requested song could not be found" });
    return;
  }

  let params = {
    Bucket: bucketName,
  };

  const cloudFrontSongParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 1,
      },
    },
  };

  // Delete found songs in the S3 bucket
  // and invalidate the CloudFront cache
  await deleteSongsInCloud(songs, s3, cloudFront, params, cloudFrontSongParams);

  const artistSongs = await SongsQuery.filterSongs({
    artist_name: songs[0]["artist_name"],
  });

  let imageArtwork = songs[0]["image_art"];

  const cloudFrontImageParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 1,
      },
    },
  };

  await deleteArtworkInCloud(
    artistSongs,
    s3,
    cloudFront,
    params,
    cloudFrontImageParams,
    imageArtwork
  );

  // Deleting the songs from the database
  for (let song of songs) {
    await SongsQuery.deleteSong(song["id"]);
  }

  res
    .status(200)
    .send({ msg: `The song was successfully deleted from the database!` });
});

app.listen(4002, () => {
  console.log("Server listening on port 4002");
});
