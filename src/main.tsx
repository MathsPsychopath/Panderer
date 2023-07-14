import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SnackbarProvider } from "./components/context/SnackbarContext.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("No Clerk publishable key found");
}

const clerkKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkKey}>
          <App />
        </ClerkProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  </React.StrictMode>
);

