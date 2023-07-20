// Rolling 14 poll history of max value on poll. Aggregate by client side 20s
// setInterval 20s, update the user data with max(current, new)
// max participants bar chart
// usage time history - onClose, calc diff started - now, add to user data

import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import ExpandableCard from "./ExpandableCard";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <Box className="flex h-fit w-full flex-col items-center justify-center bg-secondary-button">
      <Box className="py-40">
        <Typography variant="h3" className="my-10">
          Dashboard
          <ButtonBase
            onClick={() => navigate("/guide")}
            className="mx-4 rounded-full bg-accent p-2 py-1 text-white"
          >
            Help me!
          </ButtonBase>
        </Typography>
        <Box className="grid min-h-[20rem] min-w-[20rem] grid-cols-4 grid-rows-4 gap-4 sm:h-[40rem] sm:w-[40rem] lg:h-[50rem] lg:w-[60rem]">
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-1 row-end-2 p-4 lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-3"
          >
            <Typography variant="h5">Past peak approvals:</Typography>
          </Paper>
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-2 row-end-3 p-4 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3"
          >
            <Typography variant="h5">Cumulative poll time:</Typography>
            <Box className="flex h-[75%] items-center justify-center">
              <Typography variant="h3">1 hr 5m</Typography>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-3 row-end-4 overflow-y-scroll p-4 lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-5"
          >
            <Typography variant="h5">Updates:</Typography>
            <Box className="my-4">
              <ExpandableCard
                title="v1.0.0"
                elevation={2}
                timestamp={Timestamp.fromDate(
                  new Date("Wed, 19 Jul 2023 23:31:16 GMT")
                )}
              >
                Added main functionality
              </ExpandableCard>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-4 row-end-5 h-[15rem] overflow-y-scroll p-4 lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-5 lg:h-auto"
          >
            <Typography variant="h5">FAQ:</Typography>
            <Box className="my-4">
              <ExpandableCard
                title="How do I start a poll?"
                elevation={2}
                timestamp={Timestamp.fromDate(
                  new Date("Wed, 19 Jul 2023 22:07:50 GMT")
                )}
              >
                1. Open the menu on the top left <br />
                2. Select "Start Poll" and click the "Start poll" button in
                center
              </ExpandableCard>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
