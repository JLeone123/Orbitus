import cors from "cors";
import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

/**** Prisma imports ****/
import { ModesDB } from "./modules/store.js";

/**** Helper module imports ****/
import { checkMode } from "./modules/checkMode.js";
import { generateModeData } from "./modules/generateModeData.js";

// Create a new Prisma Client
const ModesQuery = ModesDB().connect();

app.get("/api/modes", async (req, res) => {
  console.log("GET /api/modes");
  const modes = await ModesQuery.getModes();
  res.send(modes);
});

app.post("/api/mode", async (req, res) => {
  console.log("POST /api/mode");
  const body = req.body;
  const modeCheck = checkMode(body);
  if (!modeCheck) {
    res
      .status(400)
      .send({ msg: "The provided mode characteristics are invalid" });
  }
  const { ...data } = req.body;
  const mode = generateModeData(data);

  const newMode = await ModesQuery.createMode(mode);
  res.send(newMode);
});

app.delete("/api/mode", async (req, res) => {
  console.log("DELETE /api/mode");
  const { id } = req.body;

  // Check if the ID is valid
  if (id === undefined || typeof id !== "number" || isNaN(id) || id % 1 !== 0) {
    let msg =
      "The ID of the mode to delete is invalid.  A valid ID is a positive integer";
    res.status(400).send({ msg });
    return;
  }

  const deletedMode = await ModesQuery.deleteMode(id);

  res
    .status(200)
    .send({ msg: "The mode was successfully deleted from the database!" });
});

app.listen(4003, () => {
  console.log("Server listening on port 4003");
});
