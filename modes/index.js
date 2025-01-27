import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const apiKey = process.env.MODE_PULSE_API_KEY ?? "";

if (!apiKey || apiKey === "") {
  console.log(
    `Please set the \`PULSE_API_KEY\` environment variable in the \`.env\` file.`
  );
  process.exit(1);
}

const prisma = new PrismaClient()
  .$extends(withPulse({ apiKey: apiKey }))
  .$extends(withAccelerate());

app.get("/api/modes", async (req, res) => {
  console.log("GET /api/modes");
  const modes = await prisma.mode.findMany({});

  // Can use the posts to generate signedUrls for each image
  console.log(modes);
  res.send(modes);
});

app.listen(4003, () => {
  console.log("Server listening on port 4003");
});
