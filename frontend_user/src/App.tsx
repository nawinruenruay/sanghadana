import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
import { theme } from "./theme";
import { CartsumProvider } from "./components/CartContext";
import { UserProvider } from "./components/UserContext";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <CartsumProvider>
        <UserProvider>
          <Router />
        </UserProvider>
      </CartsumProvider>
    </MantineProvider>
  );
}
