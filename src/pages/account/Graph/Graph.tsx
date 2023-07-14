import { useAuth } from "@clerk/clerk-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { PrimaryButton } from "../../../components/common/Buttons";
import { httpsCallable } from "firebase/functions";
import { Box, Typography } from "@mui/material";
import StartPoll from "./StartPoll/StartPoll";
import { GraphContext } from "./context/GraphContext";

export default function Graph() {
  // Check that they haven't already started a polling instance
  // if started, then render the poll, graph, browser source
  // If not started, then render button to start
  // On start, set Started, then add all their data to rtdb, profile pic url, title
  // generate a link, do "started"

  // const handleLivePoll = useCallback(async () => {
  //   const livePoll = httpsCallable(functions, "livePoll");
  //   livePoll({ pollID: "nOJko63xSe9bJyijtnPI", method: "GET" })
  //     .then((e) => console.log(e))
  //     .catch((e) => console.error(e));
  // }, []);
  // useEffect firestore.livePolls.filter(userID)
  const { state, dispatch } = useContext(GraphContext);

  return (
    <Box className="flex flex-col items-center gap-4 lg:gap-8">
      {state.isOpen ? <ManagePoll /> : <StartPoll />}

      {/* <PrimaryButton onClick={handleLivePoll}>livePoll</PrimaryButton> */}
    </Box>
  );
}

function ManagePoll() {
  return <>Managing Poll</>;
}
