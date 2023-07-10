import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import { Alert, Box, Snackbar, StyledEngineProvider } from "@mui/material";
import Terms from "./pages/docs/Terms";
import Guide from "./pages/docs/Guide";
import AuthWrapper from "./pages/login/AuthWrapper";
import { useContext } from "react";
import { SnackbarContext } from "./components/context/SnackbarContext";
import {
  RedirectToSignIn,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/guide",
    element: <Guide />,
  },
  {
    path: "/sign-in",
    element: (
      <AuthWrapper>
        <SignIn />
      </AuthWrapper>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AuthWrapper>
        <SignUp />
      </AuthWrapper>
    ),
  },
  {
    path: "/account",
    element: (
      <>
        <SignedIn>
          <h1>hello</h1>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
  },
  {
    path: "/*",
    element: <Box>Undefined</Box>,
  },
]);

function App() {
  const { state, dispatch } = useContext(SnackbarContext);
  return (
    <StyledEngineProvider injectFirst>
      <RouterProvider router={browserRouter} />
      <Snackbar
        open={state.isOpen}
        onClose={() => dispatch({ type: "SET_CLOSE" })}
        autoHideDuration={6000}
      >
        <Alert
          severity={state.severity}
          onClose={() => dispatch({ type: "SET_CLOSE" })}
        >
          {state.msg}
        </Alert>
      </Snackbar>
    </StyledEngineProvider>
  );
}

export default App;

