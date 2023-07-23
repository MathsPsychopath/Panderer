import { Box, CircularProgress } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../misc/NotFound";
import { app, firestore, functions, rtDB } from "../../firebase";
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
} from "firebase/app-check";
import usePoll from "./reducer";
import { httpsCallable } from "firebase/functions";

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

  const closePollPublic = useCallback(
    async (userID: string) => {
      const deleteRequest = httpsCallable(functions, "removePoll");
      await deleteRequest({ pollID: pollId, userID });
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "This poll has expired. Contact your organiser for more info.",
      });
      pollDispatch({ type: "SET_INVALID" });
      return;
    },
    [pollId]
  );

  const tryApplyMetadata = useCallback(async () => {
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
  }, []);

  // hydrate page
  useEffect(() => {
    try {
      tryApplyMetadata();
    } catch {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not get poll data. Is this link valid?",
      });
      return;
    }
    // connect with poll/userid and handle value stream
    const pollRef = ref(rtDB, `polls/${pollId}`);
    const unsub = onValue(pollRef, async (snapshot) => {
      const pollData = snapshot.val();
      if (!pollData) {
        pollDispatch({ type: "SET_INVALID" });
        dispatch({
          type: "SET_ALERT",
          severity: "error",
          msg: "This poll has expired. Contact your organiser for more info.",
        });
        return;
      }
      const usableData: TUsableData = {
        ...(pollData as TLiveDataResult),
        time: pollData.timestamp.seconds as UTCTimestamp,
      };
      if (Date.now() / 1000 - usableData.timeStarted.seconds > 900) {
        // close the poll
        await closePollPublic(usableData.userID);
        return;
      }
      pollDispatch({ type: "SET_LATEST_DATA", data: usableData });
    });
    return () => {
      unsub();
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
      pollData={state.pollData!}
    >
      <Box className="h-80 w-full">
        <RealTimeGraph net={state.net} timestamp={state.pollData?.time} />
      </Box>
    </PollWrapper>
  ) : (
    <NotFound />
  );
}
