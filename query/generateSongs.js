import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import dotenv from "dotenv";

// Importing song data to generate the original songs in Prisma.
import { songData } from "./music_songs.js";

dotenv.config();

const apiKey = process.env.SONG_PULSE_API_KEY ?? "";

if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

const prisma = new PrismaClient()
  .$extends(withPulse({ apiKey: apiKey }))
  .$extends(withAccelerate());

// const prisma = new PrismaClient();

async function main() {
  /*** create songs in prisma ******/
  for (let song of songData) {
    let newSong = await prisma.song.create({
      data: {
        genre: song["genre"],
        artist_id: song["artist_id"],
        title: song["title"],
        song_id: song["song_id"],
        artist_name: song["artist_name"],
        audio: song["audio"],
        image_art: song["image_art"],
        positivity: song["positivity"],
        energy: song["energy"],
        rhythm: song["rhythm"],
        liveliness: song["liveliness"],
      },
    });
  }

  // GET all songs from prisma and aws cloudfront.
  const songs = await prisma.song.findMany({});
  console.log(songs);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
