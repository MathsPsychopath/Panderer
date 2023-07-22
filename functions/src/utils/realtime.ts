import * as admin from "firebase-admin";
import { Reference } from "firebase-admin/database";

export default class Realtime {
  objectReference: Reference | undefined;

  public async getObject<T>(objectID: string): Promise<T> {
    this.objectReference = admin.database().ref(objectID);
    const realtimeSnapshot = await this.objectReference.once("value");
    if (!realtimeSnapshot.exists)
      throw new Error(
        `Real time object ${objectID} does not exist. Could not fetch`
      );
    return realtimeSnapshot.val() as T;
  }

  public async deleteObject(): Promise<void> {
    if (!this.objectReference)
      throw new Error(`Object must be GET before DELETE`);
    await this.objectReference.remove();
  }
}
