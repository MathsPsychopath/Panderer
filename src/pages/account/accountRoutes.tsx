import { Box } from "@mui/material";
import { Outlet, RouteObject } from "react-router-dom";

// this is the main export for all the pages,
// usable in the React Router createBrowserRouter.children
const accountRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <Box className="bg-black">
        <Outlet />
      </Box>
    ),
    children: [
      {
        path: "dashboard",
        element: <div>dashboard</div>,
      },
    ],
  },
];
export default accountRoutes;
