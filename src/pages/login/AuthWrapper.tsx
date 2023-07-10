import SVGBackground from "../../components/common/SVGBackground";
import { Box } from "@mui/material";

interface IAuthWrapper {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: IAuthWrapper) {
  return (
    <Box className="flex h-[80vh] w-full items-end justify-center font-sans">
      <SVGBackground />
      {children}
    </Box>
  );
}
