import { Container, Typography, Box } from "@mui/material";
import SVGBackground from "../../components/common/SVGBackground";

export default function Guide() {
  return (
    <Box className="h-full w-full">
      <SVGBackground />
      <Container
        maxWidth="md"
        className="mt-20 h-[100vh] bg-secondary-button pt-4"
      >
        <Typography variant="body2">Updated on 09 July 2023</Typography>
        <Typography
          variant="h6"
          gutterBottom
          className="rounded-md bg-primary-button p-4 text-white"
        >
          User Guide
        </Typography>

        <Typography variant="body1" gutterBottom>
          1. Sign in with your Google account to access the poll management
          dashboard.
        </Typography>

        <Typography variant="body1" gutterBottom>
          2. Once signed in, navigate to the "Start Poll" page.
        </Typography>

        <Typography variant="body1" gutterBottom>
          3. Click on the "Start Poll" button to initiate a new poll.
        </Typography>

        <Typography variant="body1" gutterBottom>
          4. A public link for viewers to participate in the poll will appear
        </Typography>

        <Typography variant="body1" gutterBottom>
          5. The OBS browser source link will appear for displaying the graph on
          your stream
        </Typography>

        <Typography variant="body1" gutterBottom>
          6. On the current page, you can view the real-time graph and monitor
          the number of users approving, disapproving, and abstaining from the
          poll.
        </Typography>

        <Typography variant="body1" gutterBottom>
          7. Follow the OBS browser source guide to set up the graph display on
          your stream.
        </Typography>
      </Container>
    </Box>
  );
}
