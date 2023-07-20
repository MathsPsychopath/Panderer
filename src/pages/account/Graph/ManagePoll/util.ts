import { NavigateFunction } from "react-router-dom";
import { Action } from "../../../../components/context/SnackbarContext";
import { State } from "./useDataAggregate";
import { Timestamp, doc, runTransaction } from "firebase/firestore";
import { firestore } from "../../../../firebase";

// type TDeleteObject = {
//   [s: string]: null;
// };

// export async function closePoll(userId?: string) {}

export function ago(since: Date) {
  const seconds = Math.floor((Date.now() - since.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return `${minutes} m ${remainingSeconds} s ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} m ago`;
}

export function copyClipboard(
  pollID: string,
  navigate: NavigateFunction,
  dispatch: (a: Action) => void
) {
  return async function () {
    try {
      await navigator.clipboard.writeText(
        "https://panderer-fef7a.web.app/poll/" + pollID
      );
      dispatch({
        type: "SET_ALERT",
        severity: "success",
        msg: "Link copied to clipboard!",
      });
    } catch {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not copy link. Navigating to public page...",
      });
      setTimeout(() => {
        navigate("/poll/" + pollID);
      }, 3000);
    }
  };
}

type DataPoint = {
  average: number;
  maxApproval: number;
  maxDisapproval: number;
  maxParticipants: number;
  timestamp: Timestamp;
};

export type UserData = {
  history: DataPoint[];
  timePolled: number;
};

export async function updateStats(
  userID: string,
  stats: State,
  timeStarted: Timestamp
) {
  const statRef = doc(firestore, "user-data", userID);
  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(statRef);
    const newStats: UserData = { history: [], timePolled: 0 };
    const oldStats = snapshot.data() as UserData;
    // add time
    newStats.timePolled =
      oldStats.timePolled +
      Math.ceil((Date.now() / 1000 - timeStarted.seconds) / 60);
    // roll the 14 poll history
    const { point, ...formatted } = stats as {
      point: number;
    } & Partial<DataPoint>;
    if (oldStats.history.length > 10) {
      oldStats.history.shift();
    }
    formatted.timestamp = Timestamp.now();
    newStats.history.push(...oldStats.history, formatted as DataPoint);
    transaction.set(statRef, newStats);
  });
}
