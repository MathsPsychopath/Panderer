import React from "react";
import { TStrictMetadata } from "./PublicPoll";
import { ExpandMore, ExpandLess, PanTool } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";

type TPollLayoutInfo = TStrictMetadata & {
  children: React.ReactNode;
};

// handles layout for the public facing poll value
export default function PollWrapper({
  creator,
  profile_url,
  title,
  started,
  children,
}: TPollLayoutInfo) {
  return (
    <Box className="flex flex-col items-center">
      <Box className="flex w-72 flex-col items-center">
        <Typography variant="h5">{title}</Typography>
        <Box className="flex w-full justify-between">
          <Box className="flex flex-col justify-start">
            <Typography variant="h5">-6 Approval</Typography>
            <Typography variant="caption">
              {started.toDate().toLocaleTimeString()}
            </Typography>
          </Box>
          <Box className="">
            <img
              src={profile_url}
              className="h-12 w-12 rounded-full"
              alt={`profile of ${creator}`}
            />
          </Box>
        </Box>
      </Box>
      {children}
      <Box className="flex w-72 flex-col justify-center gap-4">
        <Box className="flex gap-2">
          <PrimaryButton className="w-36" endIcon={<ExpandMore />}>
            Downvote
          </PrimaryButton>
          <PrimaryButton className="w-36" endIcon={<ExpandLess />}>
            Upvote
          </PrimaryButton>
        </Box>
        <SecondaryButton endIcon={<PanTool />}>Abstain</SecondaryButton>
      </Box>
      <Box>{creator}</Box>
    </Box>
  );
}
