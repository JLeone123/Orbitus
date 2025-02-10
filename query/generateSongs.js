import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import dotenv from "dotenv";

// Importing song data to generate the original songs in Prisma.
import { songData } from "./music_songs.js";

// console.log(songData);

dotenv.config();

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

async function main() {
  /*** create songs in prisma ******/
  // for (let song of songData) {
  //   // console.log(song);
  //   let newSong = await prisma.song.create({
  //     data: {
  //       genre: song["genre"],
  //       artist_id: song["artist_id"],
  //       title: song["title"],
  //       song_id: song["song_id"],
  //       artist_name: song["artist_name"],
  //       audio: song["audio"],
  //       image_art: song["image_art"],
  //       positivity: song["positivity"],
  //       energy: song["energy"],
  //       rhythm: song["rhythm"],
  //       liveliness: song["liveliness"],
  //     },
  //   });
  // }
  // const songs = await prisma.song.findMany();
  // console.log(songs);
  // const deletedSongs = await prisma.song.deleteMany({});
  // const song = await prisma.song.create({
  //   data: {
  //     genre: "folk",
  //     artist_id: "justin-lee-avatarea4adbb8",
  //     song_name: "Daybreak", // song name cannot be null
  //     song_id: "daybreak-justin-lee-6c1f2b89",
  //     artist_name: "Justin Lee", // artist_name cannot be null
  //     mp3_file: "audio/daybreak-justin-lee-6c1f2b89.mp3", // mp3 file path cannot be null
  //     image_art: "images/justin-lee-avatarea4adbb8.avif", // if image_art is null, use artist image
  //     positivity: 8,
  //     energy: 5,
  //     rhythm: 4,
  //     liveliness: 6,
  //   },
  // });
  // await prisma.song.delete({
  //   where: {
  //     id: 423,
  //   },
  // });
  //   console.log(song);
  // GET all songs from prisma and aws cloudfront.
  const songs = await prisma.song.findMany({});
  // console.log(deletedSongs);
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
