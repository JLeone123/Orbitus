import express from "express";
import { readFileSync } from "fs";

import cors from "cors";

const app = express();

app.use(cors());

let r = readFileSync(
  "stored_songs/country/a-few-good-hearts-tyler-edwards-main-version-04-08-13902.mp3"
);
