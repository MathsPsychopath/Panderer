import { useCallback, useContext, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import StartPoll from "./StartPoll/StartPoll";
import { FetchedState, GraphContext } from "./context/GraphContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { SnackbarContext } from "../../../components/context/SnackbarContext";
import { auth, firestore } from "../../../firebase";
import { useQuery } from "@tanstack/react-query";
import ManagePoll from "./ManagePoll/ManagePoll";
import { doc, getDoc } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { ExpiryDialog } from "../../../components/common/ExpiryDialog";

export default function Graph() {
  // Check that they haven't already started a polling instance
  // if started, then render the poll, graph, browser source
  // If not started, then render button to start
  // On start, set Started, then add all their data to rtdb, profile pic url, title

  const { state, dispatch } = useContext(GraphContext);
  const [isLoading, setLoading] = useState(true);
  const [isDialogOpen, setOpen] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);

  const applyExistingPoll = useCallback(async () => {
    try {
      if (!user?.id) throw new Error();
      // check if there's a poll already on with userID
      const docRef = doc(firestore, "live-polls", user.id);
      const snapshot = await getDoc(docRef);
      if (!snapshot || !snapshot.exists()) {
        dispatch({ type: "CLOSE_POLL" });
        return;
      }
      // if so, then apply options
      const { title, pollID } = snapshot.data() as FetchedState;
      dispatch({
        type: "OPEN_POLL",
        title,
        pollID,
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

  const handlePollExpiryExit = useCallback(() => {
    dispatch({ type: "CLOSE_POLL" });
    setOpen(false);
  }, []);

  const handleVisChange = useCallback(async () => {
    if (!document.hidden && !auth.currentUser) {
      const token = await getToken({ template: "integration_firebase" });
      if (!token) throw new Error();
      await signInWithCustomToken(auth, token);
      console.log("aauthenticated");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("visibilitychange", handleVisChange);
    refetch();
    return () => {
      removeEventListener("visibilitychange", handleVisChange);
    };
  }, []);

  return (
    <>
      <ExpiryDialog
        onDialogClose={handlePollExpiryExit}
        isDialogOpen={isDialogOpen}
      />
      {isLoading ? (
        <Box className="flex h-screen w-full items-center justify-center">
          <CircularProgress />
        </Box>
      ) : state.isOpen ? (
        <ManagePoll setExpiryDialog={setOpen} />
      ) : (
        <StartPoll />
      )}
    </>
  );
}
