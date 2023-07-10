import { Box, Typography } from "@mui/material";
import {
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  createChart,
} from "lightweight-charts";
import { useRef, useEffect } from "react";
import { PrimaryButton } from "../../../components/common/Buttons";
import { useNavigate } from "react-router-dom";

const Candlesticks = () => {
  const chart = useRef<null | IChartApi>(null);
  const candlestickRef = useRef<null | ISeriesApi<"Candlestick">>(null);
  // add data
  useEffect(() => {
    if (!chart.current || !candlestickRef.current) return;
    const currentDay = { day: 29, month: 9, year: 2019 };
    let previous: CandlestickData = {
      time: currentDay,
      open: 141.77,
      high: 170.39,
      low: 120.25,
      close: 145.72,
    };
    let ticks = 0;
    let nextBar: CandlestickData;
    const interval = setInterval(() => {
      if (ticks === 5) {
        const date = new Date();
        date.setUTCFullYear(currentDay.year);
        date.setUTCMonth(currentDay.month);
        date.setUTCDate(currentDay.day + 1);
        currentDay.day = date.getUTCDate();
        currentDay.month = date.getUTCMonth();
        currentDay.year = date.getUTCFullYear();
        ticks = 0;
        previous = nextBar! as CandlestickData;
        nextBar = {
          time: currentDay as Time,
          open: previous.close,
          close: previous.close!,
          low: previous.close,
          high: previous.close,
        };
      }
      if (!nextBar) {
        nextBar = {
          ...previous,
          high: previous.close,
          low: previous.close,
          open: previous.close,
        };
      }
      // add ticks
      const newValue =
        Math.floor(10 * Math.random() * (Math.random() > 0.6 ? -1 : 1)) +
        nextBar.open;
      nextBar.high = Math.max(newValue, nextBar.high);
      nextBar.low = Math.min(newValue, nextBar.low);
      nextBar.close = newValue;
      ticks++;
      candlestickRef.current?.update(nextBar as CandlestickData);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // mount the chart
  useEffect(() => {
    document.querySelector("#candlesticks .tv-lightweight-charts")?.remove();
    chart.current = createChart(document.getElementById("candlesticks")!, {});
    candlestickRef.current = chart.current.addCandlestickSeries();
    candlestickRef.current.setData([
      {
        time: "2018-12-19",
        open: 141.77,
        high: 170.39,
        low: 120.25,
        close: 145.72,
      },
    ]);
    chart.current.applyOptions({
      handleScale: false,
      timeScale: {
        visible: false,
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false, labelVisible: false },
      },
      rightPriceScale: { visible: false },
      handleScroll: false,
      grid: { horzLines: { visible: false }, vertLines: { visible: false } },
    });
  }, []);
  return <Box id="candlesticks" className="h-full w-full" />;
};

export default function RealTimeSection() {
  const navigate = useNavigate();
  return (
    <Box className="flex flex-col items-center justify-evenly gap-8 bg-secondary-button py-32 lg:flex-row lg:items-start">
      <Box className="flex flex-col items-center gap-8 md:items-start">
        <Typography variant="h6" className=" text-primary-button">
          Real time responses
        </Typography>
        <Typography variant="h4" className="w-[30rem] lg:w-[40rem]">
          A fully synchronised platform for many concurrent users
        </Typography>
        <Box className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <Typography variant="body1" className="w-80">
            We provide all the components required to pander to your viewers and
            improve your public relations in real time. We put opinions on the
            hands of the viewers.
          </Typography>
          <Typography variant="body1" className="w-80">
            At the click of a button, viewers can express their opinion
            instantly, powered by WebSocket and Firebase technology.
          </Typography>
        </Box>
        <PrimaryButton
          className="w-40"
          onClick={() => navigate("/account/start-poll")}
        >
          Start a poll
        </PrimaryButton>
      </Box>
      <Box className="h-80 w-80 rounded-xl bg-black p-2">
        <Candlesticks />
      </Box>
    </Box>
  );
}
