import crypto from "crypto";

export const generateUniqueCallerReference = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};
