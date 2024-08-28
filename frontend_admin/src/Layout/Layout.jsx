import { AppShell, Flex, NavLink, ThemeIcon, Divider } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, NavLink as Nl, useNavigate } from "react-router-dom";
import {
  IconActivity,
  IconShoppingCart,
  IconBrandProducthunt,
  IconBackground,
  IconDashboard,
  IconUsers,
} from "@tabler/icons-react";
import Header from "./Header/Header";
import TT from "../Api";
import axios from "axios";
// import { nprogress, NavigationProgress } from "@mantine/nprogress";
import Swal from "sweetalert2";

function Layout() {
  const [Active, setActive] = useState(() => {
    const Activenav = localStorage.getItem("Activenav");
    return Activenav ? parseInt(Activenav) : 0;
  });

  const nav = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  const data = [
    {
      title: "แดชบอร์ด",
      path: "/home",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconDashboard style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    "divider",
    {
      title: "จัดการข้อมูลสินค้า",
      path: "/product",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconBrandProducthunt style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการข้อมูลออเดอร์",
      path: "/order",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconShoppingCart style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการข้อมูลกิจกรรม",
      path: "/activity",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconActivity style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการข้อมูลรแบนเนอร์",
      path: "/banner",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconBackground style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    "divider2",
    {
      title: "จัดการข้อมูลผู้ใช้งาน",
      path: "/user",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconUsers style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
  ];

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      nav("/logout");
      return;
    }
    axios
      .post(TT + "Auth/verifyToken", { auth })
      .then((res) => {
        if (res.data.status === 200) {
          // console.log("Token ถูกต้อง");
        } else {
          // console.log("Token หมดอายุ");
          Swal.fire({
            icon: "error",
            title: "Token หมดอายุ",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          nav("/logout");
        }
      })
      .catch((err) => {
        // console.error("Error:", err);
        nav("/logout");
      });
  }, []);

  const HandleNavClick = (path, index) => {
    setActive(index);
    localStorage.setItem("Activenav", index.toString());
    toggle();
    nav(path);
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 270,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Flex direction={"column"}>
            {data.map((item, key) => {
              if (item === "divider") {
                return (
                  <Divider
                    key={key}
                    my="sm"
                    variant="dashed"
                    label="ข้อมูลทั่วไป"
                    labelPosition="center"
                  />
                );
              } else if (item === "divider2") {
                return (
                  <Divider
                    key={key}
                    my="sm"
                    variant="dashed"
                    label="ข้อมูลผู้ใช้"
                    labelPosition="center"
                  />
                );
              } else {
                return (
                  <NavLink
                    key={key}
                    style={{
                      borderRadius: "10px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                    className="NavLink ripple"
                    onClick={() => HandleNavClick(item.path, key)}
                    active={key === Active}
                    component={Nl}
                    to={item.path}
                    label={item.title}
                    leftSection={item.icon}
                  />
                );
              }
            })}
          </Flex>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default Layout;
