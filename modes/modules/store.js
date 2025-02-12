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
const apiKey = process.env.MODE_PULSE_API_KEY ?? "";

// Check if the Prisma Songs
// Database API Key is defined.
if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

const ModesDB = () => {
  return {
    connectDev: () => {
      let prisma = new PrismaClient();
      return ModesQuery(prisma);
    },
    connect: () => {
      let prisma = new PrismaClient()
        .$extends(withPulse({ apiKey: apiKey }))
        .$extends(withAccelerate());
      return ModesQuery(prisma);
    },
  };
};

const ModesQuery = (prismaClient) => {
  return {
    /** Create operations **/
    createMode: async (fields) =>
      await prismaClient.mode.create({
        data: fields,
      }),
    /** Read operations **/
    getModes: async () => {
      let res = await prismaClient.mode.findMany({});
      if (res.length === 0) {
        return [];
      }

      return res;
    },
    deleteMode: async (id) =>
      await prismaClient.mode.delete({
        where: { id },
      }),
  };
};

export { ModesDB };
