/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import {
  onCall,
  onRequest,
  CallableRequest,
  HttpsError,
} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { TLivePoll, del, get } from "./livePoll/methods";

admin.initializeApp();
export const db = admin.firestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export type TRequestResult<T> =
  | {
      isSuccessful: true;
      body: T;
      status: 200;
    }
  | { isSuccessful: false; status: number; message: string };

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

interface ILivePollData {
  pollID: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
}
export const livePoll = onCall(
  { cors: ["panderer-fef7a.web.app", "localhost:5173"] },
  async ({
    data,
    auth,
  }: CallableRequest<ILivePollData>): Promise<
    TRequestResult<TLivePoll | { message: string }>
  > => {
    if (!auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function can only be called whilst authenticated"
      );
    }
    const { method, pollID } = data;

    let promise: Promise<TRequestResult<TLivePoll>>;
    switch (method) {
      case "GET":
        promise = get({ pollID });
        break;
      case "DELETE":
        promise = del({ pollID });
        break;
      default:
        throw new HttpsError("invalid-argument", "Method not implemented");
    }
    const result_2 = await promise;
    return result_2;
  }
);

