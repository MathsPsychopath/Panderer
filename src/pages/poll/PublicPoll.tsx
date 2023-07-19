import { Box, CircularProgress } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../misc/NotFound";
import { app, firestore, rtDB } from "../../firebase";
import { SnackbarContext } from "../../components/context/SnackbarContext";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PollWrapper from "./PollLayoutWrapper";
import RealTimeGraph from "../../components/common/RTGraph/RealTimeGraph";
import { onValue, ref } from "firebase/database";
import {
  TLiveDataResult,
  TUsableData,
} from "../account/Graph/ManagePoll/ManagePoll";
import { UTCTimestamp } from "lightweight-charts";
import {
  initializeAppCheck,
  onTokenChanged,
  ReCaptchaV3Provider,
  Unsubscribe,
} from "firebase/app-check";
import usePoll from "./reducer";

export type TPollMetadata = {
  creator: string;
  profile_url: string;
  started: Timestamp;
  title: string;
  pollID: string;
};

export default function PublicPoll() {
  const { pollId } = useParams();
  const { dispatch } = useContext(SnackbarContext);
  const [state, pollDispatch] = usePoll();

  const tryApplyMetadata = useCallback(async () => {
    try {
      // check in database for pollID
      const docRef = query(
        collection(firestore, "live-polls"),
        where("pollID", "==", pollId)
      );
      const docSnaps = await getDocs(docRef);
      if (docSnaps.empty) {
        pollDispatch({ type: "SET_INVALID" });
        throw new Error("Could not find poll");
      }
      // if exists, then get user ID and get meta data
      const metadata = docSnaps.docs[0].data() as TPollMetadata;
      const userID = docSnaps.docs[0].id;
      pollDispatch({
        type: "SET_VALID",
        data: {
          userID,
          ...metadata,
        },
      });
      // connect with poll/userid and handle value stream
      const pollRef = ref(rtDB, `polls/${pollId}`);
      onValue(pollRef, async (snapshot) => {
        const pollData = snapshot.val();
        if (!pollData) return;
        const usableData: TUsableData = {
          ...(pollData as TLiveDataResult),
          time: pollData.timestamp.seconds as UTCTimestamp,
        };
        pollDispatch({ type: "SET_LATEST_DATA", data: usableData });
      });
    } catch (error) {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not get poll data. Is this link valid?",
      });
    }
  }, []);

  const handleVoterClose = useCallback(() => {
    localStorage.removeItem("active");
  }, []);

  // hydrate page
  useEffect(() => {
    /**
     * if the user hasn't got public poll session, then
     * apply metadata, then set public poll.
     * Otherwise, block them
     */
    const session = localStorage.getItem("active");
    if (session) {
      // block
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Multi-voting is not allowed!",
      });
      pollDispatch({ type: "SET_INVALID" });
      return;
    }
    addEventListener("beforeunload", handleVoterClose);
    localStorage.setItem("active", "true");
    tryApplyMetadata();
    return () => {
      handleVoterClose();
      removeEventListener("beforeunload", handleVoterClose);
    };
  }, []);

  // recaptcha
  useEffect(() => {
    const appCheck = initializeAppCheck(app, {
      // site key (public)
      provider: new ReCaptchaV3Provider(
        "6LffnzcnAAAAAB6mOavvt03-sxsvXBwZFolvaHm0"
      ),
      isTokenAutoRefreshEnabled: true,
    });
    const unsubscribe = onTokenChanged(
      appCheck,
      () => {},
      (error) => {
        console.error(error);
        dispatch({
          type: "SET_ALERT",
          severity: "error",
          msg: "RECAPTCHA says you're a robot. So we couldn't ",
        });
      }
    );
    return () => unsubscribe();
  }, []);
  return state.isLoading ? (
    <Box className="flex h-screen w-full items-center justify-center">
      <CircularProgress />
    </Box>
  ) : state.isValid ? (
    <PollWrapper
      creator={state.metadata.creator}
      profile_url={state.metadata.profile_url}
      started={state.metadata.started}
      title={state.metadata.title}
      pollID={pollId!}
      invalidatePoll={() => pollDispatch({ type: "SET_INVALID" })}
    >
      <Box className="h-80 w-full">
        <RealTimeGraph net={state.net} timestamp={state.pollData?.time} />
      </Box>
    </PollWrapper>
  ) : (
    <NotFound />
  );
}
