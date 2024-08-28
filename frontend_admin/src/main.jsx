import React from "react";
import ReactDOM from "react-dom/client";
// import "@mantine/core/styles.layer.css";
// import "mantine-datatable/styles.layer.css";
import "@mantine/core/styles.css";
// import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@mantine/carousel/styles.css";

const theme = createTheme({
  primaryColor: "dark",

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  fontFamily: "Bai Jamjuree, sans-serif",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="superadmin">
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications />
          <App />
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
