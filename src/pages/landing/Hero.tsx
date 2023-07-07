import { Box, Typography } from "@mui/material";
import {
  ArrowBackIosNew,
  BatteryFull,
  ExpandLess,
  ExpandMore,
  Menu,
  NetworkWifi,
  PanTool,
  SignalCellular4Bar,
} from "@mui/icons-material";
import { IChartApi, UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import "./component.css";
import logo from "./android-chrome-192x192.png";

function Chart() {
  const chart = useRef<IChartApi | null>(null);
  useEffect(() => {
    document.querySelector("#chart-1 .tv-lightweight-charts")?.remove();
    chart.current = createChart(document.getElementById("chart-1")!, {
      autoSize: true,
      timeScale: {
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          const minutes = date.getUTCMinutes();
          return `${date.getUTCHours()}:${(minutes < 10 ? "0" : "") + minutes}`;
        },
        secondsVisible: true,
      },
    });

    const areaSeries = chart.current.addAreaSeries({
      lineWidth: 2,
      topColor: "#2f2074",
      bottomColor: "rgba(66, 135, 245, 0)",
      lineColor: "#2f2074",
    });
    const data = [
      {
        time: (Date.parse("2023-07-06T10:06:30.000") / 1000) as UTCTimestamp,
        value: 0,
      },
      {
        time: (Date.parse("2023-07-06T10:07:30.000") / 1000) as UTCTimestamp,
        value: 1,
      },
      {
        time: (Date.parse("2023-07-06T10:08:30.000") / 1000) as UTCTimestamp,
        value: 3,
      },
      {
        time: (Date.parse("2023-07-06T10:09:30.000") / 1000) as UTCTimestamp,
        value: 5,
      },
      {
        time: (Date.parse("2023-07-06T10:10:30.000") / 1000) as UTCTimestamp,
        value: 10,
      },
      {
        time: (Date.parse("2023-07-06T10:11:30.000") / 1000) as UTCTimestamp,
        value: 6,
      },
      {
        time: (Date.parse("2023-07-06T10:12:30.000") / 1000) as UTCTimestamp,
        value: -4,
      },
      {
        time: (Date.parse("2023-07-06T10:13:30.000") / 1000) as UTCTimestamp,
        value: -10,
      },
      {
        time: (Date.parse("2023-07-06T10:14:30.000") / 1000) as UTCTimestamp,
        value: -11,
      },
      {
        time: (Date.parse("2023-07-06T10:15:30.000") / 1000) as UTCTimestamp,
        value: -6,
      },
    ];
    areaSeries.setData(data);
    chart.current.timeScale().fitContent();
    chart.current.timeScale().applyOptions({
      timeVisible: true,
      secondsVisible: false,
    });
  });
  return <Box id="chart-1" className="h-full w-full" />;
}

function MobileHero() {
  const date = new Date("2023-07-06T10:15:30.000");
  const [hours, mins] = [date.getUTCHours(), date.getUTCMinutes()];
  return (
    <Box className="hero-drop-shadow relative h-[34rem] w-[18rem] overflow-hidden rounded-3xl bg-background px-0.5 pb-4 outline outline-4 outline-black">
      <Box className="absolute bottom-1 left-0 right-0 mx-auto h-1 w-20 rounded-full bg-black" />
      <Box className="relative flex items-center justify-between px-4 pt-1">
        <Typography variant="subtitle2">
          {hours}:{mins}
        </Typography>
        <Box className="absolute left-0 right-0 top-0 mx-auto h-3 w-20 rounded-b-lg bg-black" />
        <Box className="flex items-center gap-1">
          <SignalCellular4Bar className="text-[1.125rem]" />
          <NetworkWifi className="text-[1.125rem]" />
          <BatteryFull className="rotate-90 text-[1.25rem]" />
        </Box>
      </Box>
      <ArrowBackIosNew className="absolute left-5 top-8" />
      <Typography className="flex justify-center text-black" variant="h6">
        xQc
      </Typography>
      <Box className="px-6 py-2">
        <Box className="flex justify-between">
          <Box>
            <Typography variant="h5">-6 Approval</Typography>
            <Typography variant="caption">
              {hours}:{mins} {hours > 11 ? "PM" : "AM"}
            </Typography>
          </Box>
          <img
            className="h-12 w-12 rounded-full"
            src="https://yt3.googleusercontent.com/hpM847jO7S4k41eWMFSlRc1NSVTuD14iaHSsvv2ZGMIqQ1SKI1HGXo5dpThtgjChPTlh_WMHNQ=s176-c-k-c0x00ffffff-no-rj"
            alt="xqc profile"
          />
        </Box>
        <Box className="flex items-center justify-evenly">
          <Box className="flex align-middle text-red-600">
            <ExpandMore />
            <Typography variant="body1">x114</Typography>
          </Box>
          <Box className="flex w-12 items-center gap-x-1">
            <PanTool className="align-middle text-[1.125rem]" />
            <Typography variant="body1">x56</Typography>
          </Box>
          <Box className="flex align-middle text-blue-500">
            <ExpandLess />
            <Typography variant="body1">x108</Typography>
          </Box>
        </Box>
      </Box>
      <Box className=" flex h-[250px] w-[275px] items-center justify-items-center px-4">
        <Chart />
      </Box>
      <Box>
        <Box className="m-4 flex flex-col justify-center gap-4 ">
          <Box className="flex gap-2">
            <PrimaryButton
              variant="contained"
              endIcon={<ExpandMore />}
              className="pointer-events-none w-36 px-8 py-3 "
            >
              Downvote
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              endIcon={<ExpandLess />}
              className="pointer-events-none w-36 px-8 py-3"
            >
              Upvote
            </PrimaryButton>
          </Box>
          <SecondaryButton
            variant="contained"
            color="inherit"
            endIcon={<PanTool />}
            className="pointer-events-none px-8 py-3"
          >
            Abstain
          </SecondaryButton>
        </Box>
        <Box className="h-px w-full bg-secondary-button" />
        <Typography variant="h5" className="mx-4 text-[1.125rem]">
          Streamer information
        </Typography>
      </Box>
    </Box>
  );
}

function DesktopChart() {
  const chart = useRef<IChartApi | null>(null);
  const generate = useMemo(() => {
    const list = [];
    let currentClose = 60;
    for (let i = 0; i < 30; i++) {
      const fluctuation = Math.random() * 10;
      const newData = {
        time: (Date.parse("2023-07-06T10:06:30.000") / 1000 +
          60 * i) as UTCTimestamp,
        open: currentClose,
        close: Math.floor(
          currentClose + (Math.random() > 0.5 ? 1 : -1) * fluctuation
        ),
        high: Math.floor(currentClose + fluctuation + Math.random() * 5),
        low: Math.floor(currentClose - Math.random() * 8),
      };
      list.push(newData);
      currentClose = newData.close;
    }
    list.at(-1)!.close = 65;
    return list;
  }, []);
  useEffect(() => {
    document.querySelector("#chart-2 .tv-lightweight-charts")?.remove();
    chart.current = createChart(document.getElementById("chart-2")!, {
      autoSize: true,
      timeScale: {
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          const minutes = date.getUTCMinutes();
          return `${date.getUTCHours()}:${(minutes < 10 ? "0" : "") + minutes}`;
        },
        secondsVisible: true,
      },
    });

    const candlestickSeries = chart.current.addCandlestickSeries();
    candlestickSeries.setData(generate);
    chart.current.timeScale().fitContent();
    chart.current.timeScale().applyOptions({
      timeVisible: true,
      secondsVisible: false,
    });
  });
  return <Box id="chart-2" className="h-full w-full" />;
}

function DesktopHero() {
  return (
    <Box className="hero-drop-shadow w-[50rem] rounded-md outline outline-4 outline-black">
      <Box className="flex items-center justify-between bg-background p-4 px-8">
        <img src={logo} alt="logo" className="h-10 w-10" />
        <Menu />
      </Box>

      <Box className="relative h-[25rem] overflow-hidden bg-secondary-button p-4">
        <Box className="absolute right-5 flex h-[20rem] w-4/5 flex-col gap-4 bg-background p-8 pb-5">
          <Box className="flex items-center justify-between">
            <Box className="ml-28 flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="https://yt3.googleusercontent.com/ytc/AGIKgqPzDF0P9mISeSG4jx6bKj7TdWDp22qjsfuo5wb97w=s176-c-k-c0x00ffffff-no-rj"
                alt="ludwig profile"
              />
              <Typography variant="h5">Ludwig</Typography>
            </Box>
            <Box className="flex flex-col items-end">
              <Typography variant="h5">+65 Approval </Typography>
              <Typography variant="caption">9:35 AM</Typography>
            </Box>
          </Box>
          <DesktopChart />
          <Box className="flex h-10 justify-end gap-4">
            <SecondaryButton className="pointer-events-none">
              Abstain
            </SecondaryButton>
            <PrimaryButton className="pointer-events-none">
              Downvote
            </PrimaryButton>
            <PrimaryButton className="pointer-events-none">
              Upvote
            </PrimaryButton>
          </Box>
        </Box>

        <Box className="absolute bottom-[-3rem] right-5 flex w-3/5 flex-col gap-4 bg-background p-8">
          <Typography>Streamer information</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function Hero() {
  return (
    <Box className="relative">
      <Box className="absolute top-12 z-10">
        <MobileHero />
      </Box>
      <Box className="absolute left-12 top-0 z-0">
        <DesktopHero />
      </Box>
    </Box>
  );
}
