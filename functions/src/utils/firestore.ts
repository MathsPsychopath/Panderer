import { DocumentReference, Transaction } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

export default class Firestore {
  documentReference: DocumentReference | undefined;

  public async getDocument<T>(
    documentID: string,
    transaction?: Transaction
  ): Promise<T> {
    this.documentReference = admin.firestore().doc(documentID);
    const document = transaction
      ? await transaction.get(this.documentReference)
      : await this.documentReference.get();
    if (!document.exists)
      throw new Error(`Document ${documentID} does not exist. Could not fetch`);
    return document.data() as T;
  }

  public async deleteDocument(): Promise<void> {
    if (!this.documentReference)
      throw new Error("Document must be GET before DELETE");
    await this.documentReference.delete();
  }

  public async run(
    transactionFunction: (transaction: Transaction) => Promise<void>
  ) {
    await admin.firestore().runTransaction(transactionFunction);
  }
}
