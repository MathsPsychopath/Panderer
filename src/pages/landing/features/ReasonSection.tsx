import { EmojiPeople, AutoAwesome, Link } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function ReasonSection() {
  return (
    <Box className="mt-60 flex justify-center pb-40 lg:mt-0">
      <Box className="flex flex-col items-center gap-8 text-center md:items-start md:text-start">
        <Typography variant="h6" className="text-primary-button">
          Why Panderer
        </Typography>
        <Typography variant="h4" className="md:w-[30rem] lg:w-[40rem]">
          A streamer-first approach to viewer interaction
        </Typography>
        <Box className="flex flex-col flex-wrap items-center gap-8 md:items-start lg:flex-row">
          <Box className="">
            <Box className="flex items-center gap-2 border-0 border-l-2 border-solid border-accent pl-2">
              <EmojiPeople className="hover:animate-bounce" />
              <Typography variant="caption" className="hover:text-accent">
                Engage
              </Typography>
            </Box>
            <Typography variant="body1" className="w-80">
              Engaging with your audience like never before with live polling
              and capture their opinions in seconds.
            </Typography>
          </Box>
          <Box>
            <Box className="flex items-center gap-2 border-0 border-l-2 border-solid border-accent pl-2">
              <AutoAwesome className="hover:animate-ping" />
              <Typography variant="caption" className="hover:text-accent">
                Enhance
              </Typography>
            </Box>
            <Typography variant="body1" className="w-80">
              Enhance your viewers' experience by gamifying the poll. Have sides
              like buyers and sellers of the stock market.
            </Typography>
          </Box>
          <Box>
            <Box className="flex items-center gap-2 border-0 border-l-2 border-solid border-accent pl-2">
              <Link className="hover:animate-pulse" />
              <Typography variant="caption" className="hover:text-accent">
                Integrate
              </Typography>
            </Box>
            <Typography variant="body1" className="w-80">
              Integrate seamlessly with a single browser source to streamline
              the experience.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
