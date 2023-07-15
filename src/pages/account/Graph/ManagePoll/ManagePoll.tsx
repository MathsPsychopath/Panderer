import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { GraphContext } from "../context/GraphContext";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../../components/common/Buttons";
import {
  Action,
  SnackbarContext,
} from "../../../../components/context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { ago, copyClipboard } from "./util";
// import { useUser } from "@clerk/clerk-react";

export default function ManagePoll() {
  // need close poll functionality (remove live-polls record, poll on rtdb, dispatch closepoll)
  // need to build graph using data as state
  // need to initiate connection, and calculate next candle
  // need to make responsive and desktop composition
  // NON MVP - add multiple time frames, different graph types,
  // option to set more information and change
  const { state } = useContext(GraphContext);
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);
  // const { user } = useUser();
  const navigate = useNavigate();

  // need to cast type for parameter usage
  const dispatchAsParam = (action: Action) => snackbarDispatch(action);

  // close all polls associated with user
  // const closePolls = useCallback(async () => {
  //   const [isSuccessful, error] = await closePoll(user?.id);
  //   if (!isSuccessful) {
  //     snackbarDispatch({ type: "SET_ALERT", severity: "error", msg: error });
  //     return;
  //   }
  //   snackbarDispatch({
  //     type: "SET_ALERT",
  //     severity: "success",
  //     msg: "Successfully closed poll!",
  //   });
  //   // dispatch({type: "CLOSE_POLL"})
  // }, []);

  return (
    <Box className="relative flex flex-col gap-2 pb-36">
      <Paper className="flex flex-col items-center gap-8 p-8">
        <Box className="flex w-full items-center justify-between">
          <Typography variant="h5" className="place-self-start text-2xl">
            Manage "{state.title}"
          </Typography>
          <Typography variant="caption">
            Started: {ago(state.started)}
          </Typography>
        </Box>
        <Box className="flex h-80 w-full flex-grow border border-solid border-black"></Box>
      </Paper>
      <Box className="flex w-full gap-8">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Statistics</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Approvers</TableCell>
                <TableCell>567</TableCell>
                <TableCell>{Math.round((56700 / 723) * 100) / 100}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Disapprovers</TableCell>
                <TableCell>67</TableCell>
                <TableCell>{Math.round((6700 / 723) * 100) / 100}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Abstained</TableCell>
                <TableCell>89</TableCell>
                <TableCell>{Math.round((8900 / 723) * 100) / 100}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Participants</TableCell>
                <TableCell>723</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="fixed bottom-0 left-0 right-0 m-4 flex flex-col gap-2 sm:static">
          <PrimaryButton
            className="mx-auto w-[90%]"
            onClick={copyClipboard(state.pollID, navigate, dispatchAsParam)}
          >
            Share Link
          </PrimaryButton>
          <SecondaryButton className="mx-auto w-[90%]">
            Close Poll
          </SecondaryButton>
        </Box>
      </Box>
    </Box>
  );
}
