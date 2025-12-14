import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "../contexts/AppContext";
import "./index.css";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AppRoutes />
        </AppContextProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
