import { Box, Paper, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
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
import { firestore, rtDB } from "../../../../firebase";
import RealTimeGraph from "../../../../components/common/RTGraph/RealTimeGraph";
import Statistics from "./Statistics";
import { onValue, ref, remove } from "firebase/database";
import { Timestamp, deleteDoc, doc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { UTCTimestamp } from "lightweight-charts";

export type TLiveDataResult = {
  userId: string;
  timestamp: Timestamp;
  approvers: number;
  abstained: number;
  disapprovers: number;
};

export type TUsableData = Omit<TLiveDataResult, "timestamp"> & {
  time: UTCTimestamp;
};

export default function ManagePoll() {
  // need to make responsive and desktop composition
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

  // close all polls associated with user
  const closePolls = useCallback(async () => {
    try {
      if (!user?.id)
        throw new Error("User ID could not be found. Try re-logging");
      // get the pollID and delete the poll metadata
      const docRef = doc(firestore, "live-polls", user.id);
      // async delete the metadata
      const metaPromise = deleteDoc(docRef);
      // delete the poll
      const pollRef = ref(rtDB, `/polls/${state.pollID}`);
      const pollPromise = remove(pollRef);
      await Promise.allSettled([metaPromise, pollPromise]);
      snackbarDispatch({
        type: "SET_ALERT",
        severity: "success",
        msg: "Successfully closed poll",
      });
      dispatch({ type: "CLOSE_POLL" });
    } catch (error) {
      console.error(error);
      snackbarDispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: error as string,
      });
    }
  }, [state.pollID]);

  // connect to the poll in the real time database
  useEffect(() => {
    const pollRef = ref(rtDB, `/polls/${state.pollID}`);
    onValue(pollRef, (snapshot) => {
      const pollData = snapshot.val();
      if (!pollData) return;
      const usableData: TUsableData = {
        ...(pollData as TLiveDataResult),
        time: pollData.timestamp.seconds as UTCTimestamp,
      };
      setLatestData(usableData);
      const net = pollData.approvers - pollData.disapprovers;
      setNet(net);
    });
  }, [state.pollID]);

  return (
    <Box className="relative m-2 flex flex-col gap-2 pb-36">
      <Paper className="mt-2 flex flex-col items-center p-4">
        <Box className="flex w-full items-center justify-evenly p-4">
          <Typography variant="caption">Manage "{state.title}"</Typography>
          <Typography variant="caption">
            Started: {ago(state.started)}
          </Typography>
        </Box>
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
          <SecondaryButton className="mx-auto w-[90%]" onClick={closePolls}>
            Close Poll
          </SecondaryButton>
        </Box>
      </Box>
    </Box>
  );
}
