import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../misc/NotFound";
import { auth, firestore, rtDB } from "../../firebase";
import { signInAnonymously } from "firebase/auth";
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

export type TPollMetadata = {
  creator: string;
  profile_url: string;
  started: Timestamp;
  title: string;
  pollID: string;
};

type Poll =
  | {
      isValid: false;
    }
  | ({ isValid: true } & Omit<TPollMetadata, "pollID">);

export default function PublicPoll() {
  const { pollId } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [poll, setPoll] = useState<Poll>({ isValid: false });
  const { dispatch } = useContext(SnackbarContext);
  const checkValidPoll = useCallback(async () => {
    try {
      // do anonymous sign in for user (temporary) if not already signed in
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      // check in database for pollID
      const docRef = query(
        collection(firestore, "live-polls"),
        where("pollID", "==", pollId)
      );
      const docSnaps = await getDocs(docRef);
      if (docSnaps.empty) {
        setPoll({ isValid: false });
        return;
      }
      // if exists, then get user ID and get meta data
      const { creator, profile_url, started, title } =
        docSnaps.docs[0].data() as TPollMetadata;
      setPoll({ isValid: true, creator, profile_url, started, title });
    } catch (error) {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not anonymous sign-in. Please try again later.",
      });
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    checkValidPoll();
  }, []);

  return isLoading ? (
    <Box className="flex h-screen w-full items-center justify-center">
      <CircularProgress />
    </Box>
  ) : poll.isValid ? (
    <PollWrapper
      creator={poll.creator}
      profile_url={poll.profile_url}
      started={poll.started}
      title={poll.title}
    >
      <RealTimeGraph />
    </PollWrapper>
  ) : (
    <NotFound />
  );
}
