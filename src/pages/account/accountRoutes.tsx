import { RouteObject } from "react-router-dom";
import Menu from "./Menu";
import NotFound from "../misc/NotFound";

// this is the main export for all the pages,
// usable in the React Router createBrowserRouter.children
const accountRoutes: RouteObject[] = [
  {
    path: "",
    element: <Menu />,
    children: [
      {
        path: "dashboard",
        element: <div>dashboard</div>,
      },
      {
        path: "start-graph",
        element: <div>graph</div>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
export default accountRoutes;
