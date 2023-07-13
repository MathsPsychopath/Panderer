import { UserButton } from "@clerk/clerk-react";
import {
  Close,
  LineAxis,
  Menu as MenuIcon,
  RocketLaunch,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  ButtonBase,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";

type NavigationObject = {
  icon: JSX.Element;
  listItemText: string;
  to: string;
};

const navLinks: NavigationObject[] = [
  {
    icon: <RocketLaunch />,
    listItemText: "Dashboard",
    to: "/account/dashboard",
  },
  {
    icon: <LineAxis />,
    listItemText: "Start Poll",
    to: "/account/start-poll",
  },
];

export default function Menu() {
  const [isMenuOpen, setOpen] = useState(true);
  const isBig = useMediaQuery("(min-width:640px)");
  return (
    <Box className="flex">
      <AppBar
        className="fixed bg-accent"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="flex justify-between">
          <Box className="flex items-center gap-4">
            <ButtonBase onClick={() => setOpen(!isMenuOpen)}>
              {isBig ? null : isMenuOpen ? <Close /> : <MenuIcon />}
            </ButtonBase>
            <Typography variant="button" className="text-lg">
              Panderer
            </Typography>
          </Box>
          <UserButton
            appearance={{
              layout: {
                shimmer: true,
                termsPageUrl: "/terms",
              },
              elements: {
                userPreviewMainIdentifier: "font-sans",
                userPreviewSecondaryIdentifier: "font-sans",
                userButtonPopoverActionButtonText: "font-sans",
                userButtonPopoverFooter: "font-sans",
              },
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isBig ? "permanent" : "temporary"}
        open={isMenuOpen}
        onClose={() => setOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            // backgroundColor: "inherit",
          },
        }}
      >
        <Toolbar />
        <List>
          {navLinks.map(({ icon, to, listItemText }) => (
            <ListItemButton
              component={RouterLink}
              to={to}
              key={listItemText}
              className="pl-8 text-gray-600 hover:text-accent"
            >
              <ListItemIcon className="text-inherit">{icon}</ListItemIcon>
              <ListItemText>{listItemText}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box className="flex-grow">
        <Toolbar />
        <Box className="p-4 lg:p-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
