import { Box, Typography } from "@mui/material";
import {
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from "lightweight-charts";
import { useRef, useEffect } from "react";
import useCandlesticks from "./useCandlestick";

export type TChartData = {
  timestamp?: UTCTimestamp;
  net?: number;
};

export default function RealTimeGraph({ timestamp, net }: TChartData) {
  // NON MVP - add multiple time frames, different graph types,
  // use settimeout, set the time = Math.round(time / 60) * 60
  const chart = useRef<null | IChartApi>(null);
  const candlestickRef = useRef<null | ISeriesApi<"Candlestick">>(null);
  const timer = useRef<NodeJS.Timeout>();
  const [_, dispatch] = useCandlesticks(candlestickRef);

  // Mount the chart with options
  useEffect(() => {
    chart.current = createChart(document.getElementById("candlesticks")!, {
      autoSize: true,
      timeScale: {
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          const [hours, minutes] = [date.getUTCHours(), date.getUTCMinutes()];
          return `${(hours < 10 ? "0" : "") + hours}:${
            (minutes < 10 ? "0" : "") + minutes
          }`;
        },
        timeVisible: true,
        secondsVisible: false,
      },
    });
    candlestickRef.current = chart.current.addCandlestickSeries();
    // This is how candles are consolidated.
    const historyCommit = function () {
      const now = new Date();
      const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      timer.current = setTimeout(() => {
        dispatch({ type: "COMMIT_CANDLE" });
        historyCommit();
      }, delay);
    };
    historyCommit();

    return () => {
      chart.current?.remove();
      clearTimeout(timer.current);
    };
  }, []);

  // every tick change, forward changes to reducer
  useEffect(() => {
    if (!chart.current || !candlestickRef.current) return;
    if (!timestamp || net === undefined) {
      dispatch({ type: "UNDEFINED_DATA" });
      return;
    }
    dispatch({ type: "UPDATE_CURRENT", net, time: timestamp });
  }, [net]);

  return (
    <Box className="mx-auto flex h-full w-[95%] flex-col items-center">
      <Typography variant="h4" className="self-start pl-4 pt-2">
        {net} Approval
      </Typography>
      <Box id="candlesticks" className="w-full flex-grow" />
    </Box>
  );
}
