import { AppShell, Container, rem } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useWindowScroll, useHeadroom } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import axios from "axios";
import { Api } from "../Api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import classes from "./Header/Header.module.css";
import { IconExclamationMark } from "@tabler/icons-react";
import { Privacypolicy } from "../components/Privacypolicy";

export function LayoutUser() {
  const nav = useNavigate();
  const pinned = useHeadroom({ fixedAt: 120 });
  const [{ y }] = useWindowScroll();
  const isScrolled = y > 0;
  const auth = localStorage.getItem("auth");

  // const FetchAuth = () => {
  //   if (auth) {
  //     axios
  //       .post(Api + "Auth/verifyToken", { auth })
  //       .then((res) => {
  //         if (res.data.status === 200) {
  //           // console.log("Token ถูกต้อง");
  //         }
  //       })
  //       .catch(() => {
  //         nav("/logout");
  //         Notifications.show({
  //           title: "Token หมดอายุ",
  //           message: "โปรดเข้าสู่ระบบอีกครั้ง",
  //           autoClose: 3000,
  //           color: "red",
  //           icon: <IconExclamationMark />,
  //         });
  //       });
  //   }
  // };

  useEffect(() => {
    // FetchAuth();
  }, []);

  return (
    <>
      <AppShell
        header={{ height: 80, collapsed: !pinned, offset: false }}
        padding={"md"}
      >
        <AppShell.Header
          className={clsx(classes.root, {
            [classes.scrolled]: isScrolled,
          })}
        >
          <Container size={"1200px"}>
            <Header />
          </Container>
        </AppShell.Header>

        <AppShell.Main
          pt={`calc(${rem(90)} + var(--mantine-spacing-md))`}
          className={classes.bgcolor_main}
          mih={600}
        >
          <Notifications zIndex={1000} />
          <Container size={"1200px"}>
            <Outlet />
          </Container>
        </AppShell.Main>

        <AppShell.Footer pos={"static"}>
          <Footer />
        </AppShell.Footer>

        <Privacypolicy />
      </AppShell>
    </>
  );
}
