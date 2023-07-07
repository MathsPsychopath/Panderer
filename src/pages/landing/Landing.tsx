import React, { useEffect, useRef } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import Hero from "./Hero";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Time,
  UTCTimestamp,
  createChart,
} from "lightweight-charts";

const Header = () => (
  <Box className="flex items-center justify-between p-8 text-2xl font-bold text-text">
    <Box className="flex gap-x-2 text-white">
      <Typography variant="h5">Panderer</Typography>
    </Box>
    <PrimaryButton>Login</PrimaryButton>
  </Box>
);

const Svg = ({ renderBottom }: { renderBottom: boolean }) => {
  return (
    <svg
      id="visual"
      viewBox="0 0 900 600"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="h-[80vh] min-w-[700px] md:h-[100vh]"
      version="1.1"
      preserveAspectRatio="none"
    >
      <rect x="0" y="0" width="900" height="600" fill="#fff"></rect>
      <defs>
        <linearGradient id="grad1_0" x1="33.3%" y1="100%" x2="100%" y2="0%">
          <stop offset="20%" stopColor="#ffffff" stopOpacity="1"></stop>
          <stop offset="80%" stopColor="#ffffff" stopOpacity="1"></stop>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="grad2_0" x1="0%" y1="100%" x2="66.7%" y2="0%">
          <stop offset="20%" stopColor="#ffffff" stopOpacity="1"></stop>
          <stop offset="80%" stopColor="#ffffff" stopOpacity="1"></stop>
        </linearGradient>
      </defs>
      {renderBottom && (
        <g transform="translate(900, 600)">
          <path
            d="M-486.7 0C-476.8 -67.5 -466.9 -135 -429.6 -177.9C-392.3 -220.9 -327.6 -239.4 -287.1 -287.1C-246.5 -334.7 -230.1 -411.6 -186.3 -449.7C-142.4 -487.8 -71.2 -487.3 0 -486.7L0 0Z"
            fill="#594d90"
          ></path>
        </g>
      )}
      <g transform="translate(0, 0)">
        <path
          d="M486.7 0C485.2 68 483.6 135.9 449.7 186.3C415.8 236.6 349.6 269.4 296.3 296.3C243 323.2 202.6 344.3 155.4 375.1C108.1 405.9 54.1 446.3 0 486.7L0 0Z"
          fill="#594d90"
        ></path>
      </g>
    </svg>
  );
};

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

export default function Landing() {
  const showHeroUI = useMediaQuery("(min-width:768px)");
  return (
    <Box>
      <Box className="mx-10 flex h-full flex-col xl:mx-20">
        <Box className="absolute inset-0 z-[-1]">
          <Svg renderBottom={!showHeroUI} />
        </Box>
        <Header />
        <Box className="relative flex justify-center gap-8 md:justify-start">
          <Box className="ml-10 flex h-[60vh] flex-col items-center justify-center gap-4 text-center md:mt-40 md:items-start md:justify-start md:text-start">
            <Typography
              variant="h1"
              className="w-[20rem] text-4xl font-bold md:text-5xl lg:w-[30rem] lg:text-[4rem]"
            >
              Live audience
              <br />
              pandering for the internet
            </Typography>
            <Typography variant="body1" className="text-lg">
              Want to pander to your audience live <br />
              or gamify your public relations? Try today!
            </Typography>
            <Box className="flex flex-col justify-center gap-4 sm:flex-row md:justify-normal">
              <PrimaryButton>Start now</PrimaryButton>
              <SecondaryButton
                onClick={() =>
                  document
                    .getElementById("#how")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How does it work?
              </SecondaryButton>
            </Box>
          </Box>
          <Box>{showHeroUI && <Hero />}</Box>
        </Box>
      </Box>
      <Box className="flex flex-col items-center justify-evenly gap-20 bg-secondary-button py-32 lg:flex-row lg:items-start">
        <Box className="flex flex-col items-center gap-8 md:items-start">
          <Typography variant="h6" className=" text-primary-button">
            Real time responses
          </Typography>
          <Typography variant="h4" className="w-[30rem] lg:w-[40rem]">
            A fully synchronised platform for many concurrent users
          </Typography>
          <Box className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <Typography variant="body1" className="w-80">
              We provide all the components required to pander to your viewers
              and improve your public relations in real time. We put opinions on
              the hands of the viewers.
            </Typography>
            <Typography variant="body1" className="w-80">
              At the click of a button, viewers can express their opinion
              instantly, powered by WebSocket and Firebase technology.
            </Typography>
          </Box>
          <PrimaryButton className="w-40">Start a poll</PrimaryButton>
        </Box>
        <Box className="h-80 w-80 rounded-xl bg-black p-2">
          <Candlesticks />
        </Box>
      </Box>
    </Box>
  );
}
