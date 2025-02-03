import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withPulse } from "@prisma/extension-pulse";
import { request } from "http";

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
  res.send(modes);
});

app.get("/api/mode/:modeName", async (req, res) => {});

app.post("/api/mode", async (req, res) => {
  console.log("POST /api/mode");
  const {
    newModeName,
    positivityScore,
    energyScore,
    rhythmScore,
    livelinessScore,
    positivitySign,
    energySign,
    rhythmSign,
    livelinessSign,
  } = req.body;

  const mode = await prisma.mode.create({
    data: {
      name: newModeName,
      positivity: positivityScore,
      energy: energyScore,
      rhythm: rhythmScore,
      liveliness: livelinessScore,
      positivitySign,
      energySign,
      rhythmSign,
      livelinessSign,
    },
  });

  res.send(mode);
});

app.delete("/api/mode", async (req, res) => {
  console.log("DELETE /api/mode");
  const { id } = req.body;

  const mode = await prisma.mode.delete({ where: { id } });

  res.send(mode);
});

app.listen(4003, () => {
  console.log("Server listening on port 4003");
});
