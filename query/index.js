/**** Express app, middleware, and library imports ****/
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
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
  // Retrieve all songs from the Prisma songs db
  const songs = await SongsQuery.getSongs();
  // Utilize the songs from Prisma to generate signedUrls for each image
  let newSongs = songs.map((s) =>
    generateSignedUrls(
      s,
      cloudFrontUrl,
      1,
      cloudFrontPrivateKey,
      cloudFrontKeyPairId
    )
  );

  res.send(newSongs);
});

app.get(
  "/api/songs/generate/:genre/:positivity/:energy/:rhythm/:liveliness",
  async (req, res) => {
    // Validating fields
    const characteristics = req.params;
    const newCharacteristics = validateScores(characteristics);

    if (newCharacteristics === null) {
      // can make this error message more specific later.
      res.send({ msg: "Error validating data" });
      return;
    }

    // Get songs by genre and/or characteristics
    const data = generatePrismaData(newCharacteristics);
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

    res.send({ foundSongs: newSongs });
  }
);

app.post("/api/song", cpUpload, async (req, res) => {
  let mp3Audio = req.files.mp3Audio;
  let songCover = req.files.songCover;

  let newCharacteristics = validateCharacteristics(
    req.body,
    mp3Audio,
    songCover
  );

  let { newData, newMp3Audio, newSongCover } = newCharacteristics;

  let data = generatePrismaCreateData(newData);

  const imageParams = {
    Bucket: bucketName,
    Key: `${data["image_art"]}`,
    Body: newSongCover.buffer,
    ContentType: newSongCover.mimetype,
  };

  const songParams = {
    Bucket: bucketName,
    Key: `${data["audio"]}`,
    Body: newMp3Audio.buffer,
    ContentType: newMp3Audio.mimetype,
  };

  const createImageCommand = new PutObjectCommand(imageParams);
  await s3.send(createImageCommand);

  const createSongCommand = new PutObjectCommand(songParams);
  await s3.send(createSongCommand);

  // need to add conditions:
  // a) what if the song exists in the db?
  // b) what if the artist already has an id?
  //    1. Can use a prisma query - if length is zero,
  //       then create a new artist id.

  // Create a new song
  const newSong = await SongsQuery.createSong(data);
  res.send(newSong);
});

app.post("/api/song/mode", async (req, res) => {
  // Check mode characteristics data.
  let { ...modeCharacteristics } = req.body;
  let modeCharacteristicsCheck = validateMode(modeCharacteristics);

  if (!modeCharacteristicsCheck) {
    res.send({
      msg: "The provided characteristics are invalid.  Valid scores are between 1 and 100 inclusive and valid signs include >, <, >=, and <=",
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

  // can add imageUrl and audioUrl check here.
  res.send({ foundSongs: newSongs });
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

  let newCharacteristics = validateCharacteristics(
    songCharacteristics,
    mp3Audio,
    songCover
  );

  let { newData, newMp3Audio, newSongCover } = newCharacteristics;
  let data = generatePrismaCreateData(newData);
  let queryData = {
    title: songName,
    artist_name: artistName,
  };

  // Get matching songs from db
  // can update to work with song ids
  // at some point!
  const songs = await SongsQuery.filterSongs(queryData);

  if (songs.length === 0) {
    res.status(404).send({
      msg: "No songs were found with the given song and artist name!",
    });
    return;
  }

  // Updating the songs in the db
  for (let song of songs) {
    await SongsQuery.updateSong(song["id"], data);
  }

  // Adding the new song data to s3 bucket
  const imageParams = {
    Bucket: bucketName,
    Key: `${data["image_art"]}`,
    Body: newSongCover["buffer"],
    ContentType: newSongCover["mimetype"],
  };

  const songParams = {
    Bucket: bucketName,
    Key: `${data["audio"]}`,
    Body: newMp3Audio["buffer"],
    ContentType: newMp3Audio["mimetype"],
  };

  const createImageCommand = new PutObjectCommand(imageParams);
  await s3.send(createImageCommand);

  const createSongCommand = new PutObjectCommand(songParams);
  await s3.send(createSongCommand);

  // Deleting the old song data from the s3 bucket
  let params = {
    Bucket: bucketName,
  };

  // Delete Songs from Amazon
  const cloudFrontParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 2,
      },
    },
  };

  await deleteSongsInCloud(songs, s3, cloudFront, params, cloudFrontParams);
  // Send success message
  res.send({
    msg: "The song was successfully updated in the database and in the cloud!",
  });
});

app.delete("/api/song", async (req, res) => {
  // Can later finetune this more for other cases, but
  // for now, all songs that match the songName and artistName
  // can be deleted.
  // Thinking that I can just make a modal with songs, choose the song,
  // which can consist of the song's ID, cover art, name, and artist.
  // The user can choose which song to delete, which will send a fetch request
  // to this endpoint. will be able to delete this query here.
  const { songName, artistName } = req.body;
  let queryData = {
    title: songName,
    artist_name: artistName,
  };

  const songs = await SongsQuery.filterSongs(queryData);

  let params = {
    Bucket: bucketName,
  };

  const cloudFrontParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 2,
      },
    },
  };

  // Delete found songs in the S3 bucket
  // and invalidate the CloudFront cache
  await deleteSongsInCloud(songs, s3, cloudFront, params, cloudFrontParams);

  // Deleting the songs from the database
  for (let song of songs) {
    await SongsQuery.deleteSong(song["id"]);
  }

  res.send({ msg: `The song was successfully deleted from the database!` });
});

// change port?
app.listen(4002, () => {
  console.log("Server listening on port 4002");
});
