import { Box, Paper, Typography } from "@mui/material";
import { useCallback, useContext } from "react";
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
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../../firebase";
import RealTimeGraph from "./RealTimeGraph";
import Statistics from "./Statistics";

export type TFunctionsResult<T> =
  | {
      isSuccessful: true;
      body: T;
      status: 200;
    }
  | { isSuccessful: false; status: number; message: string };

export type TLivePollsParams = { method: "DELETE"; pollID: string };

export default function ManagePoll() {
  // need to make responsive and desktop composition
  // NON MVP - add multiple time frames, different graph types,
  // option to set more information and change
  const { state, dispatch } = useContext(GraphContext);
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  const navigate = useNavigate();

  // need to cast type for parameter usage
  const dispatchAsParam = (action: Action) => snackbarDispatch(action);

  // close all polls associated with user
  const closePolls = useCallback(async () => {
    try {
      const closePolls = httpsCallable<TLivePollsParams, TFunctionsResult<{}>>(
        functions,
        "livePolls"
      );
      const { data } = await closePolls({
        pollID: state.pollID,
        method: "DELETE",
      });
      if (!data.isSuccessful) throw new Error(data.message);
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

  return (
    <Box className="relative flex flex-col gap-2 pb-36">
      <Paper className="flex flex-col items-center gap-8 p-8">
        <Box className="flex w-full items-center justify-between">
          <Typography variant="h5" className="place-self-start text-2xl">
            Manage "{state.title}"
          </Typography>
          <Typography variant="caption">
            Started: {ago(state.started)}
          </Typography>
        </Box>
        <Box className="flex h-80 w-full flex-grow border border-solid border-black">
          <RealTimeGraph />
        </Box>
      </Paper>
      <Box className="flex w-full gap-8">
        <Statistics />
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
