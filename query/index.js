import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import { checkEvent } from "./modules/checkEvent.js";
import { logger } from "./modules/logger.js";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

// Install middleware, use Morgan for logging requests.
const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

// multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const cloudFrontDistId = process.env.CLOUD_FRONT_DIST_ID;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: process.env.BUCKET_REGION,
});

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

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const generateUniqueCallerReference = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

let genres = ["indie", "folk", "country", "classical"];

const apiKey = process.env.SONG_PULSE_API_KEY ?? "";

if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

// const prisma = new PrismaClient()
//   .$extends(withPulse({ apiKey: apiKey }))
//   .$extends(withAccelerate());

const prisma = new PrismaClient();

app.get("/api/songs", async (req, res) => {
  console.log("GET /api/songs");
  const songs = await prisma.song.findMany({});
  // Can use the posts to generate signedUrls for each image
  for (const song of songs) {
    song.audioUrl = getSignedUrl({
      url: "https://d2e5xe0z1ccepx.cloudfront.net/" + song.audio,
      // the signed url will expire after one day
      // it is generated.
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });

    song.imageUrl = getSignedUrl({
      url: "https://d2e5xe0z1ccepx.cloudfront.net/" + song.image_art,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
  }

  res.send(songs);
});

app.get(
  "/api/songs/generate/:genre/:positivity/:energy/:rhythm/:liveliness",
  async (req, res) => {
    console.log("GET /api/songs/generate");
    const { genre, positivity, energy, rhythm, liveliness } = req.params;

    if (
      genre === undefined ||
      typeof genre !== "string" ||
      genre.length === 0
    ) {
      res.send({ msg: "genre is not valid" });
      return;
    }

    let conditions = {
      positivity: {
        gte: Number(positivity),
      },
      energy: {
        gte: Number(energy),
      },
      rhythm: {
        gte: Number(rhythm),
      },
      liveliness: {
        gte: Number(liveliness),
      },
    };

    if (genres.includes(genre)) {
      conditions["genre"] = genre;
    }

    let songs = await prisma.song.findMany({
      where: conditions,
    });

    for (const song of songs) {
      song.audioUrl = getSignedUrl({
        url: "https://d2e5xe0z1ccepx.cloudfront.net/" + song.audio,
        // the signed url will expire after one day
        // it is generated.
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      });

      song.imageUrl = getSignedUrl({
        url: "https://d2e5xe0z1ccepx.cloudfront.net/" + song.image_art,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      });
    }

    res.send({ foundSongs: songs });
  }
);

app.post("/api/song", cpUpload, async (req, res) => {
  let { genre, songName, artistName, positivity, energy, rhythm, liveliness } =
    req.body;
  let mp3Audio = req.files.mp3Audio[0];
  let songCover = req.files.songCover[0];

  const imageName = randomImageName();
  const audioName = randomImageName();

  const imageParams = {
    Bucket: bucketName,
    Key: `images/${songCover.originalname}`,
    Body: songCover.buffer,
    ContentType: req.files.songCover[0].mimetype,
  };

  const songParams = {
    Bucket: bucketName,
    Key: `audio/${mp3Audio.originalname}`,
    Body: mp3Audio.buffer,
    ContentType: req.files.mp3Audio[0].mimetype,
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
  const newSong = await prisma.song.create({
    data: {
      genre,
      artist_id: `${songCover.originalname}`, // can change once this is functioning.
      title: songName,
      song_id: `${mp3Audio.originalname}`,
      artist_name: artistName,
      audio: `audio/${mp3Audio.originalname}`,
      image_art: `images/${songCover.originalname}`,
      positivity: Number(positivity),
      energy: Number(energy),
      rhythm: Number(rhythm),
      liveliness: Number(liveliness),
    },
  });

  res.send(newSong);
});

app.put("/api/song", cpUpload, async (req, res) => {
  let { genre, songName, artistName, positivity, energy, rhythm, liveliness } =
    req.body;
  let mp3Audio = req.files.mp3Audio[0];
  let songCover = req.files.songCover[0];

  // Get matching songs from db
  // can update to work with song ids
  // at some point!
  const songs = await prisma.song.findMany({
    where: {
      title: songName,
      artist_name: artistName,
    },
  });

  if (songs.length === 0) {
    res.status(404).send({
      msg: "No songs were found with the given song and artist name!",
    });
    return;
  }

  // Updating the songs in the db
  for (let song of songs) {
    await prisma.song.update({
      where: {
        id: song["id"],
      },
      data: {
        genre,
        artist_id: `${songCover.originalname}`, // can change once this is functioning.
        title: songName,
        song_id: `${mp3Audio.originalname}`,
        artist_name: artistName,
        audio: `audio/${mp3Audio.originalname}`,
        image_art: `images/${songCover.originalname}`,
        positivity: Number(positivity),
        energy: Number(energy),
        rhythm: Number(rhythm),
        liveliness: Number(liveliness),
      },
    });
  }

  let originalSongCoverName = songs[0]["image_art"];
  let originalMp3AudioName = songs[0]["audio"];

  // Adding the new song data to s3 bucket
  const imageParams = {
    Bucket: bucketName,
    Key: `images/${songCover.originalname}`,
    Body: songCover.buffer,
    ContentType: req.files.songCover[0].mimetype,
  };

  const songParams = {
    Bucket: bucketName,
    Key: `audio/${mp3Audio.originalname}`,
    Body: mp3Audio.buffer,
    ContentType: req.files.mp3Audio[0].mimetype,
  };

  const createImageCommand = new PutObjectCommand(imageParams);
  await s3.send(createImageCommand);

  const createSongCommand = new PutObjectCommand(songParams);
  await s3.send(createSongCommand);

  // Deleting the old song data from the s3 bucket
  let originalImageParams = {
    Bucket: bucketName,
    Key: `${originalSongCoverName}`,
  };

  let originalSongParams = {
    Bucket: bucketName,
    Key: `${originalMp3AudioName}`,
  };

  const deleteImageCommand = new DeleteObjectCommand(originalImageParams);
  await s3.send(deleteImageCommand);

  const deleteSongCommand = new DeleteObjectCommand(originalSongParams);
  await s3.send(deleteSongCommand);

  // Invalidate the data in the CloudFront cache
  const cloudFrontParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 2,
      },
    },
  };
  cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
    "/" + `${originalMp3AudioName}`,
    "/" + `${originalSongCoverName}`,
  ];

  const cloudFrontSongCommand = new CreateInvalidationCommand(cloudFrontParams);
  await cloudFront.send(cloudFrontSongCommand);

  // Send success message
  res.send({
    msg: "The song was successfully updated in the database and in the cloud!",
  });
});

app.delete("/api/song", async (req, res) => {
  // Can later finetune this more for other cases, but
  // for now, all songs that match the songName and artistName
  // can be deleted.
  const { songName, artistName } = req.body;
  const songs = await prisma.song.findMany({
    where: {
      title: songName,
      artist_name: artistName,
    },
  });

  let params = {
    Bucket: bucketName,
  };

  const cloudFrontParams = {
    DistributionId: cloudFrontDistId,
    InvalidationBatch: {
      CallerReference: generateUniqueCallerReference(),
      Paths: {
        Quantity: 2,
        // Items: ["/" + post.imageName],
      },
    },
  };

  // Deleting the s3 object from the s3 bucket
  for (let song of songs) {
    params["Key"] = `${song["audio"]}`;
    const musicCommand = new DeleteObjectCommand(params);
    await s3.send(musicCommand);

    params["Key"] = `${song["image_art"]}`;
    const imageCommand = new DeleteObjectCommand(params);
    await s3.send(imageCommand);

    // Invalidating the music data in the
    // CloudFront cache
    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${song["audio"]}`,
      "/" + `${song["image_art"]}`,
    ];

    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );
    await cloudFront.send(cloudFrontSongCommand);
  }

  // Deleting the songs from the database
  for (let song of songs) {
    await prisma.song.delete({
      where: {
        id: song["id"],
      },
    });
  }

  res.send({ msg: `The song was successfully deleted from the database!` });
});

// change port?
app.listen(4002, () => {
  console.log("Server listening on port 4002");
});
