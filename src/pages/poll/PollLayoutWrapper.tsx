import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TPollMetadata } from "./PublicPoll";
import { ExpandMore, ExpandLess, PanTool } from "@mui/icons-material";
import { Box, LinearProgress, Typography } from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import { onDisconnect, ref, runTransaction } from "firebase/database";
import { rtDB } from "../../firebase";
import { TLiveDataResult } from "../account/Graph/ManagePoll/ManagePoll";
import { Timestamp } from "firebase/firestore";
import { SnackbarContext } from "../../components/context/SnackbarContext";
import { getLocalizedTime } from "../../components/common/RTGraph/useCandlestick";

type TPollLayoutInfo = TPollMetadata & {
  children: React.ReactNode;
};

type State = "abstained" | "approvers" | "disapprovers";

type InvalidatePoll = { invalidatePoll: () => void };
// handles layout for the public facing poll value
export default function PollWrapper({
  creator,
  profile_url,
  title,
  started,
  children,
  pollID,
  invalidatePoll,
}: TPollLayoutInfo & InvalidatePoll) {
  // fix layout
  const pollRef = useRef(ref(rtDB, `polls/${pollID}`));
  const [prevState, setPrevState] = useState<State | null>(null);
  const { dispatch } = useContext(SnackbarContext);
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClick = useCallback(
    (nextState: State) => {
      runTransaction(pollRef.current, (poll: TLiveDataResult) => {
        if (!poll) {
          dispatch({
            type: "SET_ALERT",
            severity: "error",
            msg: "Could not update value. Is the poll closed?",
          });
          invalidatePoll();
          return;
        }
        poll.timestamp = Timestamp.fromMillis(
          getLocalizedTime(Math.floor(Date.now() / 1000)) * 1000
        );
        poll[nextState] = (poll[nextState] || 0) + 1;
        setPrevState(nextState);
        localStorage.setItem(`vote-${pollID}`, nextState);
        if (!prevState) return poll;
        poll[prevState] = (poll[prevState] || 0) - 1;
        return poll;
      });

      setDisabled(true);
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            setDisabled(false);
            return 100;
          }
          return oldProgress + 10;
        });
      }, 500);
    },
    [prevState]
  );

  // rehydrate if they previously voted before
  useEffect(() => {
    const vote = localStorage.getItem(`vote-${pollID}`) as State | null;
    if (!vote) return;
    setPrevState(vote);
  }, []);

  return (
    <Box className="flex flex-col items-center">
      <Box className="flex w-72 flex-col items-center">
        <Typography variant="h5">{title}</Typography>
        <Box className="flex w-full justify-between">
          <Box className="flex flex-col justify-start">
            <Typography variant="h5">-6 Approval</Typography>
            <Typography variant="caption">
              {started.toDate().toLocaleTimeString()}
            </Typography>
          </Box>
          <Box className="">
            <img
              src={profile_url}
              className="h-12 w-12 rounded-full"
              alt={`profile of ${creator}`}
            />
          </Box>
        </Box>
      </Box>
      {children}
      <Box className="flex w-72 flex-col justify-center gap-4">
        <LinearProgress variant="determinate" value={progress} />
        <Box className="flex gap-2">
          <PrimaryButton
            className="w-36"
            endIcon={<ExpandMore />}
            disabled={prevState === "disapprovers" || disabled}
            onClick={() => handleClick("disapprovers")}
          >
            Downvote
          </PrimaryButton>
          <PrimaryButton
            className="w-36"
            endIcon={<ExpandLess />}
            disabled={prevState === "approvers" || disabled}
            onClick={() => handleClick("approvers")}
          >
            Upvote
          </PrimaryButton>
        </Box>
        <SecondaryButton
          endIcon={<PanTool />}
          disabled={prevState === "abstained" || disabled}
          onClick={() => handleClick("abstained")}
        >
          Abstain
        </SecondaryButton>
      </Box>
      <Box>{creator}</Box>
    </Box>
  );
}
