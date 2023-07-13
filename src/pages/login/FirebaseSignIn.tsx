// This executes signInWithCustomToken to enable firebase services
// This should be an intermediate component that redirects to the main dashboard

import { useAuth } from "@clerk/clerk-react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../firebase";
import { SnackbarContext } from "../../components/context/SnackbarContext";

export default function FirebaseSignIn() {
  const [shouldRedirect, setRedirect] = useState(false);
  const { getToken } = useAuth();
  const { dispatch } = useContext(SnackbarContext);
  useEffect(() => {
    async function firebaseAuth() {
      try {
        const token = await getToken({ template: "integration_firebase" });
        if (!token) throw new Error();
        await signInWithCustomToken(auth, token);
        setRedirect(true);
        console.log("authenticated");
      } catch (error) {
        dispatch({
          type: "SET_ALERT",
          severity: "error",
          msg: "Could not authenticate properly with firebase. Some service may not function properly.",
        });
        console.error(error);
      }
    }
    firebaseAuth();
  }, []);
  return (
    <Box className="flex h-screen items-center justify-center gap-4">
      {shouldRedirect ? (
        <Navigate to="/account/dashboard" replace />
      ) : (
        <>
          <CircularProgress />
          <Typography>Loading firebase services...</Typography>
        </>
      )}
    </Box>
  );
}
