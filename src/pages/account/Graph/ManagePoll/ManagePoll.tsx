import { Box, Paper, Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { GraphContext } from "../context/GraphContext";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../../components/common/Buttons";
import {
  Action,
  SnackbarContext,
} from "../../../../components/context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { ago, copyClipboard } from "./util";
import { functions, rtDB } from "../../../../firebase";
import RealTimeGraph from "../../../../components/common/RTGraph/RealTimeGraph";
import Statistics from "./Statistics";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { UTCTimestamp } from "lightweight-charts";
import { httpsCallable } from "firebase/functions";

export type TLiveDataResult = {
  userID: string;
  timestamp: Timestamp;
  approvers: number;
  abstained: number;
  disapprovers: number;
  maxApprovers: number;
  maxParticipants: number;
  maxDisapprovers: number;
  timeStarted: Timestamp;
};

export type TUsableData = Omit<TLiveDataResult, "timestamp"> & {
  time: UTCTimestamp;
};

export default function ManagePoll({
  setExpiryDialog,
}: {
  setExpiryDialog: Dispatch<SetStateAction<boolean>>;
}) {
  // NON-MVP option to set more information and change
  const { state, dispatch } = useContext(GraphContext);
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  const [latestData, setLatestData] = useState<TUsableData | null>(null);
  const [net, setNet] = useState(0);
  const navigate = useNavigate();
  const { user } = useUser();

  // need to cast type for parameter usage
  const dispatchAsParam = useCallback(
    (action: Action) => snackbarDispatch(action),
    []
  );

  /**
   * close all polls associated with user.
   * Set auto if automatically closed by expiry
   * */
  const closePolls = useCallback(
    async (auto: boolean = false) => {
      try {
        if (!user?.id) {
          throw new Error("User ID could not be found. Try re-logging");
        }
        const deleteRequest = httpsCallable(functions, "removePoll");
        await deleteRequest({ pollID: state.pollID, userID: user.id });
        dispatch({ type: "CLOSE_POLL" });
        auto ||
          snackbarDispatch({
            type: "SET_ALERT",
            severity: "success",
            msg: "Successfully closed poll",
          });
      } catch (error) {
        console.error(error);
        snackbarDispatch({
          type: "SET_ALERT",
          severity: "error",
          msg: error as string,
        });
      }
    },
    [state.pollID]
  );

  // update latest data and check if session expired
  const handleLiveData = useCallback(async (snapshot: DataSnapshot) => {
    const pollData = snapshot.val();
    if (!pollData) {
      dispatch({ type: "CLOSE_POLL" });
      setExpiryDialog(true);
      return;
    }
    const usableData: TUsableData = {
      ...(pollData as TLiveDataResult),
      time: pollData.timestamp.seconds as UTCTimestamp,
    };
    setLatestData(usableData);
    const net = pollData.approvers - pollData.disapprovers;
    setNet(net);
    // expire poll after 15 minutes when signed in open
    if (Date.now() / 1000 - usableData.timeStarted.seconds > 900) {
      setExpiryDialog(true);
      await closePolls(true);
    }
  }, []);

  // add listeners on mount
  useEffect(() => {
    const pollRef = ref(rtDB, `/polls/${state.pollID}`);
    const unsub = onValue(pollRef, handleLiveData);
    return () => {
      unsub();
    };
  }, [state.pollID]);

  return (
    <Box className="relative m-2 flex flex-col gap-2 pb-36">
      <Paper className="mt-2 flex flex-col items-center p-4">
        <Box className="flex w-full items-center justify-evenly p-4">
          <Typography variant="caption">Manage "{state.title}"</Typography>
          <Typography variant="caption">
            Started:{" "}
            {ago(
              latestData
                ? new Date(latestData.timeStarted.seconds * 1000)
                : new Date()
            )}
          </Typography>
        </Box>
        <Typography variant="h5">{net} Approval</Typography>
        <Box className="h-80 w-full">
          <RealTimeGraph net={net} timestamp={latestData?.time} />
        </Box>
      </Paper>
      <Box className="flex w-full gap-8">
        <Statistics
          approvers={latestData?.approvers}
          disapprovers={latestData?.disapprovers}
          abstained={latestData?.abstained}
        />
        <Box className="fixed bottom-0 left-0 right-0 m-4 flex flex-col gap-2 sm:static">
          <PrimaryButton
            className="mx-auto w-[90%]"
            onClick={copyClipboard(state.pollID, navigate, dispatchAsParam)}
          >
            Share Link
          </PrimaryButton>
          <SecondaryButton
            className="mx-auto w-[90%]"
            onClick={() => closePolls()}
          >
            Close Poll
          </SecondaryButton>
        </Box>
      </Box>
    </Box>
  );
}
