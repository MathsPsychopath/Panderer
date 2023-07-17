import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../../components/common/Buttons";
import placeholderImage from "./placeholder.png";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { auth, firestore, rtDB } from "../../../../firebase";
import { useUser } from "@clerk/clerk-react";
import { SnackbarContext } from "../../../../components/context/SnackbarContext";
import { GraphContext } from "../context/GraphContext";
import { ref, set } from "firebase/database";

interface IPollDialog {
  isDialogOpen: boolean;
  setDialog: Dispatch<SetStateAction<boolean>>;
}
function PollDialog({ isDialogOpen, setDialog }: IPollDialog) {
  const [title, setTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { user } = useUser();
  const { dispatch } = useContext(SnackbarContext);
  const { dispatch: pollDispatch } = useContext(GraphContext);
  const startPoll = useCallback(async () => {
    setLoading(true);
    const pollID = window.crypto.randomUUID();
    try {
      if (!user?.id) throw new Error();
      const timestamp = new Date();
      const started = Timestamp.fromDate(timestamp);
      const creator =
        user?.username || auth.currentUser?.displayName || "Unknown";
      const profile_url =
        user?.profileImageUrl || auth.currentUser?.photoURL || null;

      // insert poll metadata
      const docRef = doc(firestore, "live-polls", user.id);
      await setDoc(docRef, {
        creator,
        profile_url,
        started, // this is the firebase date
        title,
        pollID,
      });

      // insert a dictionary of voters (subscriber)
      const subRef = doc(firestore, "poll-subs", user.id);
      await setDoc(subRef, {});

      // insert a new real time poll
      await set(ref(rtDB, "polls/" + pollID), {
        userID: user.id,
        timestamp: started,
        approvers: 0,
        abstained: 0,
        disapprovers: 0,
      });
      setLoading(false);
      pollDispatch({
        type: "OPEN_POLL",
        title,
        started: timestamp, // this is the JS date
        pollID,
      });
      setDialog(false);
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not start poll! Try re-logging",
      });
    }
  }, [title]);

  return (
    <Dialog open={isDialogOpen} onClose={() => setDialog(false)}>
      <DialogTitle>Start Poll</DialogTitle>
      <DialogContent className="flex flex-col gap-8 sm:w-80">
        <DialogContentText>Choose a title for your poll:</DialogContentText>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TextField
            variant="outlined"
            label="Title"
            inputProps={{ maxLength: 30 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        )}
        <Box className="flex justify-end gap-4">
          <SecondaryButton
            className="py-1.5"
            onClick={() => setDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            className="py-1.5"
            onClick={startPoll}
            disabled={isLoading}
          >
            Start
          </PrimaryButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function StartPoll() {
  const [isDialogOpen, setDialog] = useState(false);
  return (
    <Box className="flex flex-col items-center gap-4 overflow-hidden py-28 lg:gap-8">
      <PollDialog isDialogOpen={isDialogOpen} setDialog={setDialog} />
      <Typography variant="h5" className="text-4xl">
        Start a poll
      </Typography>
      <Box>
        <Typography>
          You haven't started a poll yet. Click below to unleash the market!
        </Typography>
      </Box>
      <img
        className="h-80 w-80"
        src={placeholderImage}
        alt="stock chart with red and green man"
      />
      <PrimaryButton onClick={() => setDialog(true)}>Start Poll</PrimaryButton>
    </Box>
  );
}
