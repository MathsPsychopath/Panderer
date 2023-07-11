import { Box, Container, Typography } from "@mui/material";
import { PrimaryButton } from "../../components/common/Buttons";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box className="relative ">
      <Box
        sx={{ backgroundImage: "url('/beach.jpg')" }}
        className="absolute inset-0 z-[-1] h-full w-full bg-center blur-sm"
      />
      <Container
        className="flex h-[100vh] flex-col items-center justify-center gap-8 bg-secondary-button px-0 text-center shadow-lg"
        maxWidth="md"
      >
        <Box
          sx={{ backgroundImage: "url('/beach.jpg')" }}
          className="flex h-1/2 w-full scale-90 items-center justify-center bg-center md:h-1/3 md:w-1/2"
        >
          <Typography variant="h1">404</Typography>
        </Box>
        <Typography variant="h6">
          The page you were looking for doesn't seem to exist 🤔
        </Typography>
        <PrimaryButton onClick={() => navigate(-1)}>Go back</PrimaryButton>
      </Container>
    </Box>
  );
}
