import { Navigate, RouteObject } from "react-router-dom";
import Menu from "./Menu";
import Graph from "./Graph/Graph";
import { GraphProvider } from "./Graph/context/GraphContext";
import Dashboard from "./Dashboard/Dashboard";

// this is the main export for all the pages,
// usable in the React Router createBrowserRouter.children
const accountRoutes: RouteObject[] = [
  {
    path: "",
    element: <Menu />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "poll",
        element: (
          <GraphProvider>
            <Graph />
          </GraphProvider>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/account/dashboard" />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/account/dashboard" />,
  },
];
export default accountRoutes;
