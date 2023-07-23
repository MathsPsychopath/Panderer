import { Box, Typography } from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../components/common/Buttons";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <Box className="flex flex-col items-center justify-center gap-20 bg-secondary-button p-20 lg:flex-row lg:gap-40">
      <Box className="flex flex-col gap-8">
        <Box className="flex flex-col gap-4 md:w-[25rem]">
          <Typography variant="h4">Ready to start?</Typography>
          <Typography>
            Sign up or login and start a new polling instance. You can also
            contact to see if your use case can be used with Panderer.
          </Typography>
        </Box>
        <Box className="flex gap-4">
          <PrimaryButton className="py-2" onClick={() => navigate("/sign-in")}>
            Start now
          </PrimaryButton>
          <SecondaryButton
            className="py-2"
            href="https://discordapp.com/users/499246244842176512"
          >
            Contact support
          </SecondaryButton>
        </Box>
      </Box>
      <Box className="flex w-60 flex-col gap-4">
        <Typography variant="h6" className="text-primary-button">
          Free 15 minute taster
        </Typography>
        <Typography>
          Right now, Panderer is free of costs and charges to try out for 15
          minutes. Give us a review after if you want longer poll durations.
        </Typography>
      </Box>
    </Box>
  );
}
