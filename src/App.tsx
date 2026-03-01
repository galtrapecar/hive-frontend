import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import type { CSSVariablesResolver } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Planning from "./pages/Planning";
import { CreateOrganization } from "./pages/CreateOrganization";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { Vehicles } from "./pages/Vehicles";

const theme = createTheme({
  white: "#FFFCF1",
  components: {
    Button: {
      defaultProps: {
        color: "#FFB71A",
      },
    },
  },
});

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--mantine-color-anchor": "#FFB71A",
    "--mantine-color-text": "#1C0E08",
  },
  dark: {
    "--mantine-color-anchor": "#FFB71A",
    "--mantine-color-text": "#1C0E08",
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-organization"
            element={
              <ProtectedRoute requireOrganization={false}>
                <CreateOrganization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planning/:orderId"
            element={
              <ProtectedRoute>
                <Planning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="orders" element={<Orders />} />
            <Route path="vehicles" element={<Vehicles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
