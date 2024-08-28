import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Image,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
  ActionIcon,
  NavLink,
  Flex,
  Text,
  Menu,
  UnstyledButton,
  Indicator,
  Avatar,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMoon,
  IconSun,
  IconChevronUp,
  IconLogout,
  IconChevronDown,
  IconUserCircle,
  IconShoppingCart,
  IconShoppingBag,
} from "@tabler/icons-react";
import { NavLink as Nl, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import data from "./data";
import { useUser } from "../../components/UserContext";

interface MenuItem {
  title: string;
  path: string;
  sub?: MenuItem[];
  icon?: React.ReactNode;
}

import classes from "./Header.module.css";
import logo from "../../assets/icon/LOGO.png";
import { useCartsum } from "../../components/CartContext";

function Header() {
  const { FetchUser } = useUser();
  const { cartsum, fetchCartsum } = useCartsum();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { id, role } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const location = useLocation();
  const nav = useNavigate();
  const [activePath, setActivePath] = useState<string>(location.pathname);
  const [Name, setName] = useState("");
  const [LoadingData, setLoadingData] = useState(false);

  const FetchData = async () => {
    setLoadingData(true);
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        setName(userData.name);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const Link = (item: MenuItem[], path: string = ""): JSX.Element[] => {
    return item.map((i, key) => {
      const fullPath = path ? `${path}${i.path}` : i.path;
      return (
        <NavLink
          key={key}
          onClick={() => HandleNavClick(fullPath)}
          active={fullPath === activePath}
          component={Nl}
          to={fullPath}
          label={i.title}
          className={classes.link}
        />
      );
    });
  };

  const HandleNavClick = (path: string) => {
    setActivePath(path);
    closeDrawer();
  };

  const UserProfile = () => {
    nav("/user/account/?v=profile");
    closeDrawer();
  };

  const Userpurchase = () => {
    nav("/user/account/?v=purchase");
    closeDrawer();
  };

  const Logout = () => {
    nav("/logout");
  };

  useEffect(() => {
    if (id) {
      fetchCartsum(atob(id));
      FetchData();
    }
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify={"space-between"} h="100%">
          <Group gap={5}>
            <UnstyledButton onClick={() => nav("/")}>
              <Image radius="md" src={logo} w={60} />
              {/* <Text hiddenFrom="sm">สินค้าผลิตภัณฑ์และสังฆทานออนไลน์</Text> */}
            </UnstyledButton>
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Flex gap={1} align={"center"}>
              {Link(data)}
            </Flex>
          </Group>
          <Group gap={10} visibleFrom={"md"}>
            {!id && !role ? (
              <>
                <Group gap={5}>
                  <Button variant="default" onClick={() => nav("/login")}>
                    เข้าสู่ระบบ
                  </Button>
                  <Button onClick={() => nav("/register")}>สมัครสมาชิก</Button>
                </Group>
              </>
            ) : (
              <>
                <Menu
                  width={"auto"}
                  position="bottom-end"
                  transitionProps={{ transition: "pop-top-right" }}
                  withinPortal
                  offset={1}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                  withArrow
                >
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap={10}>
                        {LoadingData === true ? (
                          <>
                            <Flex direction={"row"} gap={10}>
                              <Skeleton h={50} circle />
                              <Skeleton h={5} />
                            </Flex>
                          </>
                        ) : (
                          <>
                            <Indicator
                              inline
                              size={14}
                              offset={6}
                              position="bottom-end"
                              color="green"
                              withBorder
                              processing
                            >
                              <Avatar
                                size="45"
                                radius="xl"
                                color="green"
                                variant="light"
                              />
                            </Indicator>
                            <Flex direction="column" wrap="wrap">
                              <Text size="sm" fw={500}>
                                {Name}
                              </Text>
                            </Flex>
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
                          </>
                        )}
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={
                        <IconUserCircle
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={UserProfile}
                    >
                      บัญชีของฉัน
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconShoppingBag
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={Userpurchase}
                    >
                      การซื้อของฉัน
                    </Menu.Item>
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
                <Tooltip label={"ตระกร้า"}>
                  <Indicator
                    inline
                    label={cartsum}
                    size={16}
                    offset={1}
                    position="top-end"
                    mr={5}
                    onClick={() => nav("/cart")}
                  >
                    <UnstyledButton>
                      <IconShoppingCart stroke={1.5} />
                    </UnstyledButton>
                  </Indicator>
                </Tooltip>
              </>
            )}
            <Tooltip
              label={`${
                computedColorScheme === "light" ? "Dark" : "Light"
              } mode`}
            >
              <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                variant="default"
                size={"35px"}
                visibleFrom={"md"}
              >
                {computedColorScheme === "light" ? (
                  <IconMoon stroke={1.5} />
                ) : (
                  <IconSun stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap={2} hiddenFrom="md">
            {id && role && (
              <>
                <Tooltip label={"ตระกร้า"}>
                  <Indicator
                    inline
                    label={cartsum}
                    size={16}
                    offset={1}
                    position="top-end"
                    mr={15}
                    onClick={() => nav("/cart")}
                  >
                    <UnstyledButton>
                      <IconShoppingCart stroke={1.5} />
                    </UnstyledButton>
                  </Indicator>
                </Tooltip>
              </>
            )}
            <Tooltip
              label={`${
                computedColorScheme === "light" ? "Dark" : "Light"
              } mode`}
            >
              <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                variant="default"
                size={"35px"}
              >
                {computedColorScheme === "light" ? (
                  <IconMoon stroke={1.5} />
                ) : (
                  <IconSun stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
        </Group>
      </header>

      {/* ********************DRAWER******************** */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        padding="md"
        title="สินค้าผลิตภัณฑ์และสังฆทานออนไลน์"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        size={"sm"}
        // hiddenFrom="md"
        // zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider mb="sm" />
          <Flex direction="column" px={"xs"} gap={3}>
            {Link(data)}
          </Flex>
          <Divider my="sm" />
          {!id ? (
            <>
              <Group justify="center" grow pb="xl" px="md">
                <Button variant="default" onClick={() => nav("/login")}>
                  เข้าสู่ระบบ
                </Button>
                <Button onClick={() => nav("/register")}>สมัครสมาชิก</Button>
              </Group>
            </>
          ) : (
            <>
              <Group mb={20} px={20}>
                <Indicator
                  inline
                  size={14}
                  offset={6}
                  position="bottom-end"
                  color="green"
                  withBorder
                  processing
                >
                  <Avatar size="45" radius="xl" color="green" variant="light" />
                </Indicator>
                <Text size="sm" fw={500}>
                  {Name}
                </Text>
              </Group>

              <Flex direction="column" px={"xs"} gap={3}>
                <NavLink
                  label="บัญชีของฉัน"
                  leftSection={
                    <IconUserCircle
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={UserProfile}
                />
                <NavLink
                  label="การซื้อของฉัน"
                  leftSection={
                    <IconShoppingBag
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={Userpurchase}
                />
                <NavLink
                  label="ออกจากระบบ"
                  leftSection={
                    <IconLogout
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  c={"red"}
                  onClick={Logout}
                />
              </Flex>
            </>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Header;
