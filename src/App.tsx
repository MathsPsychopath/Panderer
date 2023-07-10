import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import { Alert, Snackbar, StyledEngineProvider } from "@mui/material";
import Terms from "./pages/misc/Terms";
import Guide from "./pages/misc/Guide";
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
import NotFound from "./pages/misc/NotFound";
import accountRoutes from "./pages/account/accountRoutes";

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
    path: "/account/*",
    element: (
      <>
        <SignedIn>
          <Outlet />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    children: accountRoutes,
  },
  {
    path: "*",
    element: <NotFound />,
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

