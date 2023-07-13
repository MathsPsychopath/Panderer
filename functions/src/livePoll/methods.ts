import { TRequestResult, db } from "../index";

interface ILivePoll {
  pollID: string;
}

export type TLivePoll = {
  creator: string;
  profile_url: string;
  started: Date;
  title: string;
};

/**
 *
 * @param {ILivePoll} obj - The initialisation object
 * @param {string} obj.pollID - The id of the live poll
 * @param {Firestore} obj.db - The firestore database to search in
 * @return {Promise<TRequestResult<TLivePoll>>} - Fetch result
 */
export async function get({
  pollID,
}: ILivePoll): Promise<TRequestResult<TLivePoll>> {
  try {
    const document = await db.doc("/live-polls/" + pollID).get();
    if (!document.exists) throw new Error("Poll ID does not exist");
    const data = document.data() as TLivePoll;
    return { isSuccessful: true, body: data, status: 200 };
  } catch (error) {
    return { isSuccessful: false, status: 404, message: error as string };
  }
}

export async function del({
  pollID,
}: ILivePoll): Promise<TRequestResult<TLivePoll>> {
  try {
    const documentRef = db.doc("/live-polls/" + pollID);
    const document = await documentRef.get();
    if (!document.exists) throw new Error("Poll ID does not exist");
    const data = document.data() as TLivePoll;
    await documentRef.delete();
    return { isSuccessful: true, body: data, status: 200 };
  } catch (error) {
    return { isSuccessful: false, status: 404, message: error as string };
  }
}
