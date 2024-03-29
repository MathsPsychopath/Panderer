import { Box, CircularProgress, Typography } from "@mui/material";

import { SecondaryButton } from "../../../components/common/Buttons";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const LazySpline = lazy(() => import("./SplineClock"));

const Svg2 = () => {
  return (
    <svg
      width="100%"
      viewBox="0 0 574 725"
      preserveAspectRatio="none"
      className="absolute inset-0 h-[75rem] lg:h-[52.5rem]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 724.5V150L574 0.5V602L0 724.5Z" fill="#16284E" />
    </svg>
  );
};

export default function SuiteSection() {
  const navigate = useNavigate();
  return (
    <Box className="relative h-[1000px]">
      <Svg2 />
      <Box className="absolute inset-0 z-[-1] h-[40rem] w-full bg-secondary-button" />
      <Box className="absolute top-52 flex w-full flex-col items-center justify-evenly gap-8 text-white md:top-28 md:mt-[10rem] lg:flex-row lg:items-start">
        <Box className="flex flex-col items-center gap-8 text-center md:items-start md:text-start">
          <Typography variant="h6" className="text-[#c3d0ed]">
            Dedicated management suite
          </Typography>
          <Typography variant="h4" className="md:w-[30rem] lg:w-[40rem]">
            Setup quickly with easy to manage tools
          </Typography>
          <Box className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <Typography variant="body1" className="w-80">
              Streaming is already fast-paced. Get peace of mind here with our
              suite allows fast and easy setup of polls, quick destruction, and
              overall time saving.
            </Typography>
            <Typography variant="body1" className="w-80">
              We've created the simplest interface, so go do what it is you do
              best live with speed.
            </Typography>
          </Box>
          <SecondaryButton
            className="text-black"
            onClick={() => navigate("/guide")}
          >
            See guide
          </SecondaryButton>
        </Box>
        <Box className="flex h-80 w-80 items-center justify-center rounded-xl bg-black p-2">
          <Suspense fallback={<CircularProgress color="error" />}>
            <LazySpline />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
