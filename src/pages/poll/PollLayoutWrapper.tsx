import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TPollMetadata } from "./PublicPoll";
import { ExpandMore, ExpandLess, PanTool } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import { ref, runTransaction } from "firebase/database";
import { rtDB } from "../../firebase";
import {
  TLiveDataResult,
  TUsableData,
} from "../account/Graph/ManagePoll/ManagePoll";
import { Timestamp } from "firebase/firestore";
import { SnackbarContext } from "../../components/context/SnackbarContext";
import logo from "./android-chrome-192x192.png";
import { PublicPollContext } from "./PublicPollContext";

type TPollLayoutInfo = TPollMetadata & {
  children: React.ReactNode;
  pollData?: TUsableData;
};

type State = "abstained" | "approvers" | "disapprovers";

// handles layout for the public facing poll value
export default function PollWrapper({
  creator,
  profile_url,
  title,
  children,
  pollID,
  pollData,
}: TPollLayoutInfo) {
  const pollRef = useRef(ref(rtDB, `polls/${pollID}`));
  const [prevState, setPrevState] = useState<State | null>(null);
  const { dispatch } = useContext(SnackbarContext);
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(100);
  const { state } = useContext(PublicPollContext);

  const timeString = useCallback((s: number) => {
    const localDate = new Date(s * 1000);
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    return `${hours}:${(minutes < 10 ? "0" : "") + minutes} ${
      hours < 12 ? "AM" : "PM"
    }`;
  }, []);

  const handleClick = useCallback(
    async (nextState: State) => {
      await runTransaction(pollRef.current, (poll: TLiveDataResult | null) => {
        if (!poll)
          return {
            userID: state.isValid ? state.metadata.userID : "unknown",
            timestamp: Timestamp.now(),
            approvers: 0,
            abstained: 0,
            disapprovers: 0,
            maxApprovers: 0,
            maxDisapprovers: 0,
            maxParticipants: 0,
          };
        poll.timestamp = Timestamp.fromMillis(
          Math.floor(Date.now() / 1000) * 1000
        );
        poll[nextState] = (poll[nextState] || 0) + 1;
        if (nextState === "approvers") {
          poll.maxApprovers = Math.max(poll.maxApprovers, poll.approvers);
        }
        if (nextState === "disapprovers") {
          poll.maxDisapprovers = Math.max(
            poll.maxDisapprovers,
            poll.disapprovers
          );
        }
        poll.maxParticipants = Math.max(
          poll.maxParticipants,
          poll.approvers + poll.disapprovers + poll.abstained - 1
        );
        setPrevState(nextState);
        localStorage.setItem(`vote-${pollID}`, nextState);
        if (!prevState) return poll;
        poll[prevState] = (poll[prevState] || 0) - 1;
        return poll;
      }).catch((error) => {
        console.error(error);
        dispatch({
          type: "SET_ALERT",
          severity: "error",
          msg: "Could not update value. Is the poll closed?",
        });
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
    [prevState, state]
  );

  const storageListener = useCallback(() => {
    const otherVote = localStorage.getItem(`vote-${pollID}`) as State | null;
    if (!otherVote) return;
    setPrevState(otherVote);
  }, []);

  // rehydrate if they previously voted before
  useEffect(() => {
    const vote = localStorage.getItem(`vote-${pollID}`) as State | null;
    if (!vote) return;
    setPrevState(vote);
    addEventListener("storage", storageListener);
    return () => {
      removeEventListener("storage", storageListener);
    };
  }, []);

  return (
    <Box className="h-screen bg-secondary-button">
      <Box className="mx-auto flex flex-col items-center justify-evenly gap-1 sm:w-[40rem] md:w-[50rem]">
        <Paper className="hidden w-full p-2 py-4 sm:flex sm:justify-center">
          <HomeButton />
        </Paper>
        <Paper className="flex w-full flex-col items-center p-2">
          <Typography
            variant="caption"
            className="text-xl text-gray-500 sm:hidden"
          >
            {title}
          </Typography>
          <Box className="flex w-full max-w-[50rem] justify-evenly sm:flex-row-reverse sm:py-4">
            <Box className="flex flex-col justify-start sm:items-end">
              <Typography variant="h5">
                {(pollData?.approvers || 0) - (pollData?.disapprovers || 0)}{" "}
                Approval
              </Typography>
              <Typography variant="caption">
                {state.isValid && state.pollData
                  ? timeString(state.pollData.time)
                  : "???"}
              </Typography>
            </Box>
            <Box className="flex items-center gap-4">
              <Box className="">
                <img
                  src={profile_url}
                  className="h-12 w-12 rounded-full"
                  alt={`profile of ${creator}`}
                />
              </Box>
              <Typography
                variant="caption"
                className="hidden text-xl text-gray-500 sm:block"
              >
                {title}
              </Typography>
            </Box>
          </Box>
          <Box className="my-2 flex w-full items-center justify-evenly">
            <Box className="flex align-middle text-red-600">
              <ExpandMore />
              <Typography variant="body1">
                x{pollData?.disapprovers || 0}
              </Typography>
            </Box>
            <Box className="flex w-12 items-center gap-x-1">
              <PanTool className="pr-1 align-middle text-[1.125rem]" />
              <Typography variant="body1">
                x{pollData?.abstained || 0}
              </Typography>
            </Box>
            <Box className="flex align-middle text-blue-500">
              <ExpandLess />
              <Typography variant="body1">
                x{pollData?.approvers || 0}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper className="w-full p-2 py-4 sm:py-8">
          {children}
          <LinearProgress
            variant="determinate"
            value={progress}
            className="m-4"
          />
          <Box className="mx-auto flex w-[20rem] flex-col justify-center gap-4 sm:w-[90%] sm:flex-row-reverse sm:justify-start">
            <Box className="flex justify-between gap-2">
              <PrimaryButton
                className="w-[45%] min-w-[9rem]"
                endIcon={<ExpandMore />}
                disabled={prevState === "disapprovers" || disabled}
                onClick={() => handleClick("disapprovers")}
              >
                Downvote
              </PrimaryButton>
              <PrimaryButton
                className="w-[45%] min-w-[9rem]"
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
        </Paper>
        <Paper className="relative flex w-full items-center justify-evenly p-2">
          <Box className="sm:hidden">
            <HomeButton />
          </Box>
          <Typography className="text-[1.125rem]">
            Started by: {creator}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

const HomeButton = () => (
  <ButtonBase className="h-10 w-10" component="a" href="/">
    <img
      src={logo}
      alt="logo"
      title="Go to landing page"
      width="100%"
      height="100%"
    />
  </ButtonBase>
);
