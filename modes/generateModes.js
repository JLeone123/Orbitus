import { modeList } from "./modules/initialModes.js";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MODE_PULSE_API_KEY ?? "";
console.log(apiKey);

if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

const prisma = new PrismaClient()
  .$extends(withPulse({ apiKey: apiKey }))
  .$extends(withAccelerate());

async function main() {
  /*** create mode in prisma ******/

  for (let currentMode of modeList) {
    const mode = await prisma.mode.create({
      data: {
        name: currentMode["name"],
        positivity: currentMode["positivity"]["score"],
        energy: currentMode["energy"]["score"], // song name cannot be null
        rhythm: currentMode["rhythm"]["score"],
        liveliness: currentMode["liveliness"]["score"], // artist_name cannot be null
        positivitySign: currentMode["positivity"]["sign"], // mp3 file path cannot be null
        energySign: currentMode["energy"]["sign"], // if image_art is null, use artist image
        rhythmSign: currentMode["energy"]["sign"],
        livelinessSign: currentMode["energy"]["sign"],
      },
    });
  }

  // GET all songs from prisma and aws cloudfront.
  const modes = await prisma.mode.findMany();

  console.log(modes);
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
