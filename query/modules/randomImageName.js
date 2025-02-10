/**** Middleware, library, and module imports ****/

// Importing the crypto module from the
// node:module library to generate
// a thirty-two byte imageName
import crypto from "crypto";

export const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
