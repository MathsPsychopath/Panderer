import { Box } from "@mui/material";
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
  const chart = useRef<null | IChartApi>(null);
  const candlestickRef = useRef<null | ISeriesApi<"Candlestick">>(null);
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
    const historyCommit = setInterval(() => {
      dispatch({ type: "COMMIT_CANDLE" });
    }, 60000);

    return () => {
      chart.current?.remove();
      clearInterval(historyCommit);
    };
  }, []);

  // every tick change, forward changes to reducer
  useEffect(() => {
    if (!chart.current || !candlestickRef.current) return;
    if (!timestamp || net === undefined) {
      dispatch({ type: "UNDEFINED_DATA" });
      return;
    }
    dispatch({ type: "UPDATE_CURRENT", net });
  }, [net]);

  return <Box id="candlesticks" className="h-full w-full" />;
}
