import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import { checkEvent } from "./modules/checkEvent.js";
import { logger } from "./modules/logger.js";

// Install middleware, use Morgan for logging requests.
const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

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

  // console.log(songs);
  res.send(songs);
});

app.get(
  "/api/songs/generate/:genre/:positivity/:energy/:rhythm/:liveliness",
  async (req, res) => {
    console.log("GET /api/songs/generate");
    const { genre, positivity, energy, rhythm, liveliness } = req.params;
    // console.log(positivity, energy, rhythm, liveliness);
    console.log(genre);

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

    console.log(songs);

    res.send({ foundSongs: songs });
  }
);

// change port?
app.listen(4002, () => {
  console.log("Server listening on port 4002");
});
