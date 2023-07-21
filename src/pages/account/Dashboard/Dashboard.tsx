import {
  Box,
  ButtonBase,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandableCard from "./ExpandableCard";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { SnackbarContext } from "../../../components/context/SnackbarContext";
import { firestore } from "../../../firebase";
import { UserData } from "../Graph/ManagePoll/util";
import { getLocalizedTime } from "../../../components/common/RTGraph/useCandlestick";
import { UTCTimestamp } from "lightweight-charts";
import LineChart from "./LineChart";
import { Info } from "@mui/icons-material";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const { user } = useUser();
  const { dispatch } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const [data, setData] = useState<UserData>();

  const fetchData = useCallback(async () => {
    try {
      if (!user?.id) throw new Error("Could not get data. Try re-logging.");
      const docRef = doc(firestore, "user-data", user.id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists())
        throw new Error("No data found. Start a poll to get some data");
      setData(snapshot.data() as UserData);
    } catch (error) {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: `${error}`,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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
        <Box className="grid min-h-[20rem] min-w-[20rem] grid-cols-4 grid-rows-5 gap-4 sm:h-[50rem] sm:w-[40rem] lg:h-[50rem] lg:w-[60rem]">
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-1 row-end-3 p-4 lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-3"
          >
            <Box className="flex items-center justify-between">
              <Typography variant="h5">Past peak approvals :</Typography>
              <Tooltip title="Score stats are only calculated when you close the poll yourself">
                <Info />
              </Tooltip>
            </Box>
            {isLoading ? (
              <CircularProgress variant="indeterminate" />
            ) : data ? (
              <LineChart
                id="approvals"
                data={data.history.map((point) => ({
                  time: getLocalizedTime(
                    point.timestamp.seconds
                  ) as UTCTimestamp,
                  value: point.maxApproval,
                }))}
              />
            ) : (
              <Box className="flex h-3/4 items-center justify-center">
                <Typography variant="body1">Not found</Typography>
              </Box>
            )}
          </Paper>
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-3 row-end-4 p-4 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3"
          >
            <Typography variant="h5">Cumulative poll time:</Typography>
            <Box className="flex h-[75%] items-center justify-center">
              {isLoading ? (
                <CircularProgress variant="indeterminate" />
              ) : (
                <Typography variant={data ? "h3" : "body1"}>
                  {data
                    ? `${Math.trunc(data?.timePolled! / 60)}h ${
                        data?.timePolled! % 60
                      }m`
                    : "Not found"}
                </Typography>
              )}
            </Box>
          </Paper>
          <Paper
            elevation={3}
            className="col-start-1 col-end-5 row-start-4 row-end-5 overflow-y-scroll p-4 lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-5"
          >
            <Typography variant="h5">Updates:</Typography>
            <Box className="my-4 flex flex-col gap-2">
              <ExpandableCard
                title="v1.0.1"
                elevation={2}
                timestamp={Timestamp.fromDate(
                  new Date("Thu, 20 Jul 2023 21:57:16 GMT")
                )}
              >
                1. Added poll statistic collection.
                <br />
                2. UI changes
                <br />
                3. Dashboard data
              </ExpandableCard>
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
            className="col-start-1 col-end-5 row-start-5 row-end-6 h-[15rem] overflow-y-scroll p-4 lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-5 lg:h-auto"
          >
            <Typography variant="h5">FAQ:</Typography>
            <Box className="my-4 flex flex-col gap-2">
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
