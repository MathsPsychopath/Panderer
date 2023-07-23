import { Box, Typography } from "@mui/material";
import FooterSection from "./features/Footer";
import CallToAction from "./features/CallToAction";
import ReasonSection from "./features/ReasonSection";
import SuiteSection from "./features/SuiteSection";
import RealTimeSection from "./features/RealTimeSection";
import MainHero from "./features/Hero";
import { useNavigate } from "react-router-dom";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/Buttons";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [showCookies, setShow] = useState(true);
  return (
    <Box>
      {showCookies && (
        <Box className="fixed bottom-0 right-0 z-50 m-4 rounded-md bg-text p-4 text-white md:w-[30rem]">
          <Typography variant="body1" className="whitespace-wrap">
            By using our website, you agree to our use of cookies outlined in
            the Terms, including advertising and essential cookies.
          </Typography>
          <Box className="flex h-12 items-end justify-center gap-8 pt-4">
            <PrimaryButton className="px-2 py-1" onClick={() => setShow(false)}>
              Accept
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate("/terms")}
              className="px-2 py-1 text-black"
            >
              See terms
            </SecondaryButton>
          </Box>
        </Box>
      )}
      <MainHero />
      <Box id="lead" />
      <RealTimeSection />
      <Box id="suite" />
      <SuiteSection />
      <Box id="reason" />
      <ReasonSection />
      <Box id="action" />
      <CallToAction />
      <FooterSection />
    </Box>
  );
}
