/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import get from "./livePoll/methods";

admin.initializeApp();
const db = admin.firestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const livePoll = onRequest((req, res) => {
  const pollID = req.query.pollID as string;
  const method = req.method as "GET" | "PUT" | "POST" | "DELETE";
  if (!pollID) {
    res.status(400).json({ message: "Poll ID not specified" });
    return;
  }
  switch (method) {
    case "GET":
      const promise = get({ pollID, db });
      // return res.status(result.status).json(result);
      return promise.then((result) => {
        res.status(result.status).json(result);
      });
  }
  res.status(400).json({ message: "Could not find implementation" });
  return;
});

