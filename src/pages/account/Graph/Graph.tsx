import { useCallback, useContext, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import StartPoll from "./StartPoll/StartPoll";
import { FetchedState, GraphContext } from "./context/GraphContext";
import { useUser } from "@clerk/clerk-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SnackbarContext } from "../../../components/context/SnackbarContext";
import { firestore } from "../../../firebase";
import { useQuery } from "@tanstack/react-query";
import ManagePoll from "./ManagePoll/ManagePoll";

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
  const { state, dispatch } = useContext(GraphContext);
  const [isLoading, setLoading] = useState(true);

  const { user } = useUser();
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  const applyExistingPoll = useCallback(async () => {
    try {
      if (!user?.id) throw new Error();
      // check if there's a poll already on with userID
      const documentQuery = query(
        collection(firestore, "/live-polls"),
        where("userId", "==", user.id)
      );
      const { empty, docs } = await getDocs(documentQuery);
      if (empty) {
        dispatch({ type: "CLOSE_POLL" });
        return;
      }

      // if so, then apply options
      const { title, started } = docs[0].data() as FetchedState;
      dispatch({
        type: "OPEN_POLL",
        title,
        started: started.toDate(),
        pollID: docs[0].id,
      });
      snackbarDispatch({
        type: "SET_ALERT",
        severity: "success",
        msg: "Successfully got previous poll",
      });
      return true;
    } catch (error) {
      console.error(error);
      snackbarDispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not check previous instance! Try re-logging.",
      });
    }
  }, []);

  const queryKey = ["get-existing-poll"];
  const { refetch } = useQuery({
    queryFn: async () => {
      await applyExistingPoll();
      setLoading(false);
      return null;
    },
    queryKey,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {isLoading ? (
        <Box className="flex h-screen w-full items-center justify-center">
          <CircularProgress />
        </Box>
      ) : state.isOpen ? (
        <ManagePoll />
      ) : (
        <StartPoll />
      )}
      {/* <PrimaryButton onClick={handleLivePoll}>livePoll</PrimaryButton> */}
    </>
  );
}
