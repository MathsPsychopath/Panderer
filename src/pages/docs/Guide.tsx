import { Container, Typography, Box } from "@mui/material";

export default function Guide() {
  return (
    <Box className="h-full w-full">
      <svg
        id="visual"
        viewBox="0 0 900 600"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[-1]"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
      >
        <rect x="0" y="0" width="900" height="600" fill="#2f2074"></rect>
        <g fill="#86a1dc">
          <circle r="89" cx="499" cy="295"></circle>
          <circle r="39" cx="863" cy="496"></circle>
          <circle r="75" cx="663" cy="471"></circle>
          <circle r="68" cx="577" cy="67"></circle>
          <circle r="61" cx="155" cy="555"></circle>
          <circle r="62" cx="845" cy="103"></circle>
          <circle r="49" cx="226" cy="146"></circle>
          <circle r="51" cx="79" cy="284"></circle>
          <circle r="68" cx="430" cy="482"></circle>
          <circle r="86" cx="818" cy="288"></circle>
          <circle r="41" cx="274" cy="378"></circle>
          <circle r="51" cx="38" cy="23"></circle>
          <circle r="80" cx="352" cy="10"></circle>
        </g>
      </svg>
      <Container maxWidth="md" className="h-[100vh] bg-secondary-button pt-4">
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
