import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import { StyledEngineProvider } from "@mui/material";
import Terms from "./pages/docs/Terms";
import Guide from "./pages/docs/Guide";

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
]);

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <RouterProvider router={browserRouter} />
    </StyledEngineProvider>
  );
}

export default App;

