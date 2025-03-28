/**** Environment variable library import ****/
import dotenv from "dotenv";

/**** Prisma imports ****/
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";

// Install middleware and libraries
dotenv.config({ path: "../.env" });

// Declare and initialize the Prisma
// API Key environment variable
const apiKey = process.env.SONG_PULSE_API_KEY ?? "";

// Check if the Prisma Songs
// Database API Key is defined.
if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

const SongsDB = () => {
  return {
    connectDev: () => {
      let prisma = new PrismaClient();
      return SongsQuery(prisma);
    },
    connect: () => {
      let prisma = new PrismaClient()
        .$extends(withPulse({ apiKey: apiKey }))
        .$extends(withAccelerate());
      return SongsQuery(prisma);
    },
  };
};

const SongsQuery = (prismaClient) => {
  return {
    /** Create operations **/
    createSong: async (fields) =>
      await prismaClient.song.create({
        data: fields,
      }),
    /** Read operations **/
    getSongs: async () =>
      await prismaClient.song.findMany({
        take: 50,
      }),
    getSong: async (conditions) =>
      await prismaClient.song.findUnique({
        where: conditions,
      }),
    filterSongs: async (conditions) =>
      await prismaClient.song.findMany({
        where: conditions,
      }),
    /** Update operations **/
    updateSong: async (id, fields) =>
      await prismaClient.song.update({
        where: { id },
        data: fields,
      }),
    /** Delete operations **/
    deleteSong: async (id) =>
      await prismaClient.song.delete({
        where: { id },
      }),
  };
};

export { SongsDB };
