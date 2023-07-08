import { Box, Typography } from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../components/common/Buttons";

export default function CallToAction() {
  return (
    <Box className="flex flex-col items-center justify-center gap-20 bg-secondary-button p-20 lg:flex-row lg:gap-40">
      <Box className="flex flex-col gap-8">
        <Box className="flex w-[25rem] flex-col gap-4">
          <Typography variant="h4">Ready to start?</Typography>
          <Typography>
            Sign up or login with Google and start a new polling instance. You
            can also contact to see if your use case can be used with Panderer.
          </Typography>
        </Box>
        <Box className="flex gap-4">
          <PrimaryButton className="py-2">Start now</PrimaryButton>
          <SecondaryButton className="py-2">Contact support</SecondaryButton>
        </Box>
      </Box>
      <Box className="flex w-60 flex-col gap-4">
        <Typography variant="h6" className="text-primary-button">
          Free until it's not.
        </Typography>
        <Typography>
          Right now, Panderer is free of costs and charges to use. There are no
          hidden or future fees by using now.
        </Typography>
      </Box>
    </Box>
  );
}