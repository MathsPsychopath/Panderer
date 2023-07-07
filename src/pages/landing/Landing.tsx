import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import Hero from "./Hero";

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
      className="min-w-[700px]"
      version="1.1"
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

export default function Landing() {
  // const collectionRef = collection(db, "");
  const showHeroUI = useMediaQuery("(min-width:768px)");
  return (
    <Box className="mx-10 flex h-full flex-col xl:mx-20">
      <Box className="absolute inset-0 z-[-1]">
        <Svg renderBottom={!showHeroUI} />
      </Box>
      <Header />
      <Box className="flex justify-center gap-8 md:justify-normal">
        <Box className="my-20 flex h-[100vh] flex-col justify-start gap-4 text-center md:text-start">
          <Typography
            variant="h1"
            className="w-[30rem] text-4xl font-bold md:text-5xl lg:text-[4rem] lg:text-white"
          >
            Live audience
            <br />
            pandering for the internet
          </Typography>
          <Typography variant="body1" className="text-lg">
            Want to pander to your audience live <br />
            or gamify your public relations? Try today!
          </Typography>
          <Box className="flex justify-center gap-4 md:justify-normal">
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
  );
}
