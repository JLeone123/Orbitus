import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

/**** Prisma imports ****/
import { ModesDB } from "./modules/store.js";

/**** Helper module imports ****/
import { checkMode } from "./modules/checkMode.js";
import { generateModeData } from "./modules/generateModeData.js";

/**** Winston logger import ****/
import { logger } from "./modules/logger.js";

// Create a new Prisma Client
const ModesQuery = ModesDB().connect();

app.get("/api/modes", async (req, res) => {
  const modes = await ModesQuery.getModes();

  res.status(200).send(modes);
  logger.info(JSON.stringify({ msg: "Successfully retrieved player modes!" }));
  logger.http(
    JSON.stringify({
      message: "response",
      method: "GET",
      endpoint: "/api/modes",
      statusCode: res.statusCode,
    })
  );
});

app.post("/api/mode", async (req, res) => {
  const { event } = req.body;
  const modeCheck = checkMode(event.data);

  if (!modeCheck) {
    res
      .status(400)
      .send({ msg: "The provided mode characteristics are invalid" });
    logger.error(
      JSON.stringify({ msg: "The provided mode characteristics are invalid" })
    );
    return;
  }

  const mode = generateModeData(event.data);
  const newMode = await ModesQuery.createMode(mode);

  res.status(201).send(newMode);
  logger.info(
    JSON.stringify({ msg: `Successfully created mode ${newMode["name"]}` })
  );
  logger.http(
    JSON.stringify({
      message: "response",
      method: "POST",
      endpoint: "/api/mode",
      statusCode: res.statusCode,
    })
  );
});

app.delete("/api/mode", async (req, res) => {
  const { event } = req.body;
  const { id } = event.data;
  // Check if the ID is valid
  if (id === undefined || typeof id !== "number" || isNaN(id) || id % 1 !== 0) {
    let msg =
      "The ID of the mode to delete is invalid.  A valid ID is a positive integer";
    res.status(400).send({ msg });

    logger.error(JSON.stringify({ msg }));
    return;
  }

  const deletedMode = await ModesQuery.deleteMode(id);

  if (
    !deletedMode ||
    typeof deletedMode !== "object" ||
    !deletedMode["id"] ||
    typeof deletedMode["id"] !== "number" ||
    deletedMode["id"] !== id
  ) {
    res
      .status(500)
      .send({ msg: "The mode could not be deleted from the database" });
    logger.error(
      JSON.stringify({ msg: "The mode could not be deleted from the database" })
    );
    return;
  }
  res
    .status(200)
    .send({ msg: "The mode was successfully deleted from the database!" });
  logger.info({
    msg: "The mode was successfully deleted from the database!",
  });
  logger.http(
    JSON.stringify({
      message: "response",
      method: "DELETE",
      endpoint: "/api/mode",
      statusCode: res.statusCode,
    })
  );
});

app.listen(4003, () => {
  console.log("Server listening on port 4003");
});
