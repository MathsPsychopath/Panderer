import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

interface IExpandableCard {
  elevation: number;
  title: string;
  timestamp: Timestamp;
  children: React.ReactNode;
}

export default function ExpandableCard({
  elevation,
  title,
  timestamp,
  children,
}: IExpandableCard) {
  const [showBody, setShow] = useState(false);
  return (
    <Paper
      elevation={elevation}
      className="rounded-md border-4 border-solid border-black"
    >
      <ButtonBase className="w-full" onClick={() => setShow(!showBody)}>
        <Box className="flex w-full items-center justify-between p-2">
          <Typography variant="h5">{title}</Typography>
          <Typography variant="caption">
            {timestamp.toDate().toDateString()}
          </Typography>
          {showBody ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ButtonBase>
      {showBody && <Box className="p-2">{children}</Box>}
    </Paper>
  );
}
