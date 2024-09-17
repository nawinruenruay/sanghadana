import {
  Burger,
  Group,
  UnstyledButton,
  Avatar,
  Text,
  Menu,
  rem,
  Image,
  Flex,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconLogout,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import classes from "./Header.module.css";
import logo from "../../assets/icon/LOGO.png";
import TT from "../../Api";

function Header({ opened, toggle }) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const nav = useNavigate();

  const Logout = () => {
    nav("/logout");
  };

  const { id, name } = JSON.parse(localStorage.getItem("dataUser") || "{}");

  return (
    <>
      <div className={classes.header}>
        <Group gap={"xs"}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Flex
            className="mantine-visible-from-xs"
            align={"center"}
            gap={"5px"}
          >
            <Image radius={"lg"} src={logo} w={"45px"} />
            <Text
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 90 }}
            >
              ระบบจัดการสังฆทานออนไลน์
            </Text>
          </Flex>
        </Group>
        <Menu
          width={"auto"}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          withinPortal
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
        >
          <Menu.Target>
            <UnstyledButton
              style={{
                outline: "none",
              }}
            >
              <Group gap={10}>
                <Avatar radius="xl" size={40} color={"green"} />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {name}
                  </Text>

                  <Text c="blue" size="xs" fw={500}>
                    Administrator
                  </Text>
                </div>

                {userMenuOpened ? (
                  <IconChevronUp
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                ) : (
                  <IconChevronDown
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                )}
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="red"
              leftSection={
                <IconLogout
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              onClick={Logout}
            >
              ออกจากระบบ
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}

export default Header;
