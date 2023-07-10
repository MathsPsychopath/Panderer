import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
const FooterSvg = () => {
  return (
    <svg
      width="100%"
      viewBox="0 0 574 141"
      fill="none"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full bg-secondary-button"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 140.5V75L574 0.5V140.5H0Z" fill="#2F2074" />
    </svg>
  );
};

export default function FooterSection() {
  return (
    <Box className="relative flex h-40 items-center justify-center text-white lg:h-60">
      <FooterSvg />
      <Box className="z-10 flex flex-col items-center pt-20">
        <Typography variant="button">Panderer</Typography>
        <Box className="flex gap-2 text-white">
          <MUILink
            component={RouterLink}
            to="https://youtu.be/uFpK_r-jEXg"
            className="font-sans text-white"
            underline="none"
            target="_blank"
          >
            About
          </MUILink>
          <MUILink
            component={RouterLink}
            to="https://discordapp.com/users/1127377226548117585"
            className="font-sans text-white"
            underline="none"
          >
            Contact
          </MUILink>
          <MUILink
            component={RouterLink}
            to="/terms"
            className="font-sans text-white"
            underline="none"
          >
            Terms
          </MUILink>
        </Box>
      </Box>
    </Box>
  );
}
