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
import { onRequest } from "firebase-functions/v2/https";
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

