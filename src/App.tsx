import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import { StyledEngineProvider } from "@mui/material";
import Terms from "./pages/docs/Terms";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
]);

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <RouterProvider router={browserRouter} />
    </StyledEngineProvider>
  );
}

export default App;

