import { Timestamp } from "firebase-admin/firestore";
import Firestore from "../utils/firestore";
import { UserData } from "../utils/types";

export default class Statistics {
  firestoreInstance: Firestore;
  constructor(firestoreInstance: Firestore) {
    this.firestoreInstance = firestoreInstance;
  }
  public async updateStatistics(
    userID: string,
    maxApproval: number,
    maxDisapproval: number,
    maxParticipants: number,
    minutesPolled: number
  ) {
    return this.firestoreInstance.run(async (transaction) => {
      const statistics = await this.firestoreInstance.getDocument<UserData>(
        `/user-data/${userID}`,
        transaction
      );
      statistics.history.push({
        maxApproval,
        maxDisapproval,
        maxParticipants,
        timestamp: Timestamp.now(),
      });
      statistics.timePolled = statistics.timePolled + minutesPolled;
      transaction.set(this.firestoreInstance.documentReference!, statistics);
    });
  }
}
