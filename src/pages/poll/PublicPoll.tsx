import { Box, CircularProgress } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../misc/NotFound";
import { firestore, rtDB } from "../../firebase";
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

export type TPollMetadata = {
  creator: string;
  profile_url: string;
  started: Timestamp;
  title: string;
  pollID: string;
};

type PollWithUser = TPollMetadata & { userID: string };

export type TStrictMetadata = Omit<TPollMetadata, "pollID">;

type Poll =
  | {
      isValid: false;
    }
  | ({ isValid: true } & Omit<PollWithUser, "pollID">);

export default function PublicPoll() {
  const { pollId } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [poll, setPoll] = useState<Poll>({ isValid: false });
  const { dispatch } = useContext(SnackbarContext);
  const [latestData, setLatestData] = useState<TUsableData | null>(null);
  const [net, setNet] = useState(0);

  const tryApplyMetadata = useCallback(async () => {
    try {
      // check in database for pollID
      const docRef = query(
        collection(firestore, "live-polls"),
        where("pollID", "==", pollId)
      );
      const docSnaps = await getDocs(docRef);
      if (docSnaps.empty) {
        setPoll({ isValid: false });
        throw new Error("Could not find poll");
      }
      // if exists, then get user ID and get meta data
      const metadata = docSnaps.docs[0].data() as TPollMetadata;
      const userID = docSnaps.docs[0].id;
      setPoll({ isValid: true, userID, ...metadata });
      // connect with poll/userid and handle value stream
      const pollRef = ref(rtDB, `polls/${pollId}`);
      onValue(pollRef, async (snapshot) => {
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
    } catch (error) {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not get poll data. Is this link valid?",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    tryApplyMetadata();
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
      <Box className="h-80 w-full">
        <RealTimeGraph net={net} timestamp={latestData?.time} />
      </Box>
    </PollWrapper>
  ) : (
    <NotFound />
  );
}
