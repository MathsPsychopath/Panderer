import * as admin from "firebase-admin";

interface ILivePoll {
  pollID: string;
  db: admin.firestore.Firestore;
}

type TLivePoll = {
  creator: string;
  profile_url: string;
  started: Date;
  title: string;
};

type TRequestResult<T> =
  | {
      isSuccessful: true;
      body: T;
      status: 200;
    }
  | { isSuccessful: false; status: number; message: string };

/**
 *
 * @param {ILivePoll} obj - The initialisation object
 * @param {string} obj.pollID - The id of the live poll
 * @param {Firestore} obj.db - The firestore database to search in
 * @return {Promise<TRequestResult<TLivePoll>>} - Fetch result
 */
export default async function get({
  pollID,
  db,
}: ILivePoll): Promise<TRequestResult<TLivePoll>> {
  try {
    const document = await admin
      .firestore()
      .doc("/live-polls/" + pollID)
      .get();
    if (!document.exists) throw new Error("Poll ID does not exist");
    const data = document.data() as TLivePoll;
    return { isSuccessful: true, body: data, status: 200 };
  } catch (error) {
    return { isSuccessful: false, status: 404, message: error as string };
  }
}
