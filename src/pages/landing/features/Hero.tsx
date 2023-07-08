import { Box, Typography, useMediaQuery } from "@mui/material";
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
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../components/common/Buttons";
import "./component.css";
import logo from "./android-chrome-192x192.png";
import LoadingBar from "react-top-loading-bar";

const idSequence = [
  { id: "lead", alreadyScrolled: false },
  { id: "suite", alreadyScrolled: false },
  { id: "reason", alreadyScrolled: false },
  { id: "action", alreadyScrolled: false },
];

export default function MainHero() {
  const [progress, setProgress] = useState(0);
  const [timeoutIDs, setIDs] = useState<NodeJS.Timeout[]>([]);
  const [interval, setIntID] = useState<NodeJS.Timer | null>(null);

  const cancelWalkthrough = () => {
    timeoutIDs.forEach((id) => clearTimeout(id));
    clearInterval(interval!);
    setIDs([]);
    setIntID(null);
    setProgress(0);
  };

  const walkthrough = () => {
    let times = 1;
    const intID = setInterval(() => {
      setProgress((prev) => prev + 10);
      if (times === 40) cancelWalkthrough();
      if (times % 10 === 0) setProgress(0);
      times++;
    }, 1000);
    setIntID(intID);
    for (let i = 0; i < 4; i++) {
      const id = setTimeout(() => {
        document.getElementById(idSequence[i].id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 10000 * i);
      setIDs((prev) => [...prev, id]);
    }
  };

  const showHeroUI = useMediaQuery("(min-width:768px)");
  return (
    <Box className="mx-10 mb-8 flex h-full flex-col xl:mx-20">
      {interval && (
        <LoadingBar
          color="#2f2074"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      )}
      {timeoutIDs.length > 0 && (
        <PrimaryButton
          className="fixed bottom-0 left-0 z-30 m-4 bg-accent"
          onClick={() => cancelWalkthrough()}
        >
          Cancel walkthrough
        </PrimaryButton>
      )}
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
            <SecondaryButton onClick={() => walkthrough()}>
              Learn more
            </SecondaryButton>
          </Box>
        </Box>
        <Box>{showHeroUI && <Hero />}</Box>
      </Box>
    </Box>
  );
}

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

function Hero() {
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
      className="z-0 h-[80vh] min-w-[700px] md:h-[100vh]"
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
