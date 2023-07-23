/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import {
  CallableRequest,
  onCall,
  onRequest,
} from "firebase-functions/v2/https";
import Firestore from "./utils/firestore";
import { Metadata, RTDBData } from "./utils/types";
import Realtime from "./utils/realtime";
import Statistics from "./entities/Statistics";
admin.initializeApp();

export const accountCleanup = onRequest(async (req, res) => {
  const result = await admin.auth().listUsers();
  const inactiveAnonymous = result.users
    .filter(
      (user) => user.providerData.length === 0 && !user.uid.startsWith("user_")
    )
    .map((user) => user.uid);
  const deleted = await admin.auth().deleteUsers(inactiveAnonymous);
  logger.log("Finished cleanup of users");
  res.json({ deleted });
  return;
});

interface IRemovePoll {
  userID: string;
  pollID: string;
}

export const removePoll = onCall(
  async (context: CallableRequest<IRemovePoll>) => {
    const { userID, pollID } = context.data;
    const firestoreInstance = new Firestore();
    const realtimeInstance = new Realtime();
    try {
      const metadata = await firestoreInstance.getDocument<Metadata>(
        `/live-polls/${userID}`
      );
      if (metadata.pollID !== pollID)
        throw new Error("Invalid pollID does not match user's poll");

      await firestoreInstance.deleteDocument();

      const poll = await realtimeInstance.getObject<RTDBData>(
        `/polls/${pollID}`
      );
      const { maxApprovers, maxDisapprovers, maxParticipants, timeStarted } =
        poll;

      const timePolled = Math.ceil(
        (Date.now() / 1000 - timeStarted.seconds) / 60
      );

      await realtimeInstance.deleteObject();

      const statisticsInstance = new Statistics(firestoreInstance);
      await statisticsInstance.updateStatistics(
        userID,
        maxApprovers,
        maxDisapprovers,
        maxParticipants,
        timePolled
      );

      return {
        message: "Successfully deleted poll",
        status: 200,
      };
    } catch (error: any) {
      logger.error(error);
      return {
        status: 500,
        message: error.message || "An error occurred trying to execute",
      };
    }
  }
);

