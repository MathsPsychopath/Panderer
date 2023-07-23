import { Container, Typography, Box } from "@mui/material";
import SVGBackground from "../../components/common/SVGBackground";
import loginImage from "./login.png";
import menuImage from "./menu.png";
import buttonImage from "./button.png";
import titleImage from "./title.png";
import manageImage from "./manage.png";

export default function Guide() {
  return (
    <Box className="h-full w-full">
      <SVGBackground height="350vh" />
      <Container maxWidth="md" className="my-20 bg-secondary-button pt-4">
        <Typography variant="body2">Updated on 23 July 2023</Typography>
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
        <img
          src={loginImage}
          loading="lazy"
          className="w-full"
          alt="login page image"
        />
        <Typography variant="body1" gutterBottom>
          2. Once signed in, navigate to the "Start Poll" page.
        </Typography>
        <img
          src={menuImage}
          loading="lazy"
          className="w-full"
          alt="menu image"
        />

        <Typography variant="body1" gutterBottom>
          3. Click on the "Start Poll" button to initiate a new poll.
        </Typography>
        <img
          src={buttonImage}
          loading="lazy"
          className="w-full"
          alt="start button image"
        />

        <Typography variant="body1" gutterBottom>
          4. Choose a title for your poll. Pick a good one for people to vote
          on.
        </Typography>
        <img
          src={titleImage}
          loading="lazy"
          className="w-full"
          alt="title modal image"
        />

        <Typography variant="body1" gutterBottom>
          5. On the current page, you can view the (blue) real-time graph and
          (red) monitor the number of users approving, disapproving, and
          abstaining from the poll.
        </Typography>
        <img
          src={manageImage}
          loading="lazy"
          className="w-full"
          alt="manage poll image"
        />

        <Typography variant="body1" gutterBottom>
          6. (green) Click on "Share link" to copy the public-facing voting
          page. You can use the graph here for your OBS browser source.
        </Typography>

        <Typography variant="body1" gutterBottom>
          7. (purple) Close the poll to end voting. This will also automatically
          happen after 15 minutes.
        </Typography>
      </Container>
    </Box>
  );
}
