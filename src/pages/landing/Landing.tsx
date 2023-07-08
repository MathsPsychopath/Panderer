import { Box } from "@mui/material";
// import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import FooterSection from "./features/Footer";
import CallToAction from "./features/CallToAction";
import ReasonSection from "./features/ReasonSection";
import SuiteSection from "./features/SuiteSection";
import RealTimeSection from "./features/RealTimeSection";
import MainHero from "./features/Hero";

export default function Landing() {
  return (
    <Box>
      <MainHero />
      <Box id="lead" />
      <RealTimeSection />
      <SuiteSection />
      <ReasonSection />
      <CallToAction />
      <FooterSection />
    </Box>
  );
}
