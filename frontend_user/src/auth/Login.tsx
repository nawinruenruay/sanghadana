import {
  Group,
  Button,
  Image,
  Text,
  UnstyledButton,
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  SimpleGrid,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Notifications } from "@mantine/notifications";
import {
  IconMoon,
  IconSun,
  IconExclamationMark,
  IconCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Api } from "../Api";
import { useDocumentTitle } from "@mantine/hooks";
import LOGO from "../assets/icon/LOGO.png";
import Footer from "../layout/Footer/Footer";

export function Login() {
  useDocumentTitle("เข้าสู่ระบบ | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const nav = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (v) => (v.length !== 0 ? null : "กรุณากรอกชื่อผู้ใช้งาน"),
      password: (v) => (v.length !== 0 ? null : "กรุณากรอกรหัสผ่านผู้ใช้งาน"),
    },
  });
  const [LoadingLogin, setLoadingLogin] = useState(false);

  const Login = (v: any) => {
    setLoadingLogin(true);
    axios
      .post(Api + "Auth/LoginUser", {
        username: v.username,
        password: v.password,
      })
      .then((res) => {
        setLoadingLogin(false);
        if (res.data.message === "success") {
          const data = res.data.data[0];
          // console.log(data);
          Notifications.show({
            title: "เข้าสู่ระบบสำเร็จ",
            message: "ยินดีต้อนรับ " + data.name,
            autoClose: 2000,
            color: "green",
            icon: <IconCheck />,
          });
          localStorage.clear();
          const dataUser = {
            id: btoa(data.userid),
            role: "user",
          };
          localStorage.setItem("UUID", res.data.uuid);
          // localStorage.setItem("tokenID", res.data.token);
          localStorage.setItem("auth", res.data.auth);
          localStorage.setItem("dataUser", JSON.stringify(dataUser));
          nav("/home");
        } else {
          setLoadingLogin(false);
          Notifications.show({
            title: "เข้าสู่ระบบไม่สำเร็จ",
            message: "ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง",
            autoClose: 3000,
            color: "red",
            icon: <IconExclamationMark />,
          });
          v.username = "";
          v.password = "";
        }
      })
      .catch(() => {
        setLoadingLogin(false);
        Notifications.show({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          message: "ปิดปรับปรุ่งเว็บไซต์",
          autoClose: 3000,
          color: "red",
          icon: <IconExclamationMark />,
        });
      });
  };

  useEffect(() => {
    if (id) {
      nav("/");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Notifications zIndex={1000} />
      <Container size={"lg"}>
        <Group justify={"space-between"} h={90}>
          <UnstyledButton onClick={() => nav("/")}>
            <Group gap={0}>
              <Image radius="md" src={LOGO} w={60} />
              <Text size={"md"} c={"#7EA236"}>
                สินค้าผลิตภัณฑ์และสังฆทานออนไลน์
              </Text>
            </Group>
          </UnstyledButton>
          <Group gap={5}>
            <Text fw={"bold"} visibleFrom="xs">
              เข้าสู่ระบบ
            </Text>
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
                visibleFrom={"xs"}
              >
                {computedColorScheme === "light" ? (
                  <IconMoon stroke={1.5} />
                ) : (
                  <IconSun stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Container>

      <Group bg={"#7EA236"} mih={590}>
        <Container size={"lg"} fluid w={450} py={20}>
          <Title ta="center" fw={900}>
            ยินดีต้อนรับ !
          </Title>
          <Text c="dark" size="sm" ta="center" mt={5}>
            คุณมีสมาชิกหรือยัง?{" "}
            <Anchor
              size="lg"
              c={"white"}
              component="button"
              onClick={() => nav("/register")}
            >
              สมัครสมาชิก
            </Anchor>
          </Text>

          <form
            onSubmit={form.onSubmit((v) => {
              Login(v);
            })}
          >
            <Paper withBorder shadow="md" p={30} mt={20} radius="md">
              <SimpleGrid cols={1} pt={5}>
                <TextInput
                  {...form.getInputProps("username")}
                  label="ชื่อผู้ใช้งาน"
                  placeholder="ชื่อผู้ใช้งาน"
                  withAsterisk
                />
                <PasswordInput
                  {...form.getInputProps("password")}
                  label="รหัสผ่านผู้ใช้งาน"
                  placeholder="รหัสผ่านผู้ใช้งาน"
                  withAsterisk
                />
                <Button
                  loading={LoadingLogin}
                  loaderProps={{ type: "dots" }}
                  type="submit"
                >
                  เข้าสู่ระบบ
                </Button>
              </SimpleGrid>
            </Paper>
          </form>
        </Container>
      </Group>
      <Footer />
    </>
  );
}
