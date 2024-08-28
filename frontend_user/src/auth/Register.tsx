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
import { useDisclosure } from "@mantine/hooks";
import { useDocumentTitle } from "@mantine/hooks";
import LOGO from "../assets/icon/LOGO.png";
import Footer from "../layout/Footer/Footer";

export function Register() {
  useDocumentTitle("สมัครสมาชิก | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const nav = useNavigate();
  const [LoadingLogin, setLoadingLogin] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    validate: {
      username: (v) => {
        if (v.length < 6) return "กรอกชื่อผู้ใช้งาน 6 ตัวอักษรขึ้นไป";
        if (/[\u0E00-\u0E7F]/.test(v))
          return "ชื่อผู้ใช้งานต้องเป็นภาษาอังกฤษเท่านั้น เช่น abc1234";
        return null;
      },
      password: (v) => {
        if (v.length === 0) return "กรอกรหัสผ่านผู้ใช้งาน";
        if (/[\u0E00-\u0E7F]/.test(v))
          return "รหัสผ่านต้องเป็นภาษาอังกฤษเท่านั้น";
        return null;
      },
      confirmPassword: (value, values) => {
        if (value.length === 0) return "ยืนยันรหัสผ่านผู้ใช้งาน";
        if (value !== values.password) return "รหัสผ่านไม่ตรงกัน";
        return null;
      },
      name: (value) =>
        value.length < 6 ? "กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง" : null,
    },
  });

  const Register = (v: any) => {
    setLoadingLogin(true);
    if (v.username && v.password && v.name) {
      axios
        .post(Api + "Auth/Register", {
          username: v.username,
          password: v.password,
          name: v.name,
        })
        .then((res) => {
          setLoadingLogin(false);
          if (res.data === 200) {
            console.log(res.data);
            Notifications.show({
              title: "สมัครสมาชิกสำเร็จ",
              message: "เข้าสู่ระบบเพื่อเลือกซื้อสินค้าในเว็บไซต์",
              autoClose: 3000,
              color: "green",
              icon: <IconCheck />,
            });
            nav("/login");
          } else {
          }
        })
        .catch(() => {
          setLoadingLogin(false);
          Notifications.show({
            title: "Error",
            message: "ปิดปรับปรุ่งเว็บไซต์",
            autoClose: 3000,
            color: "red",
            icon: <IconExclamationMark />,
          });
        });
    }
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
              สมัครสมาชิก
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
            คุณมีสมาชิกแล้วใช่มั้ย?
            <Anchor
              size="lg"
              c={"white"}
              component="button"
              onClick={() => nav("/login")}
            >
              เข้าสู่ระบบ
            </Anchor>
          </Text>

          <form
            onSubmit={form.onSubmit((v) => {
              Register(v);
            })}
          >
            <Paper withBorder shadow="md" p={30} mt={20} radius="md">
              <SimpleGrid cols={1} pt={5}>
                <TextInput
                  label="ชื่อ-นามสกุล"
                  placeholder="กรอกชื่อ-นามสกุล"
                  {...form.getInputProps("name")}
                  withAsterisk
                />
                <TextInput
                  {...form.getInputProps("username")}
                  label="ชื่อผู้ใช้งาน"
                  placeholder="ชื่อผู้ใช้งาน"
                  withAsterisk
                />
                <PasswordInput
                  label="รหัสผ่านผู้ใช้งาน"
                  {...form.getInputProps("password")}
                  placeholder="กรอกรหัสผ่านผู้ใช้งาน *แนะนำใช้รหัสผ่านที่เดาได้ยาก"
                  visible={visible}
                  onVisibilityChange={toggle}
                  withAsterisk
                />
                <PasswordInput
                  label="ยืนยันรหัสผ่านผู้ใช้งาน"
                  {...form.getInputProps("confirmPassword")}
                  placeholder="ยืนยันรหัสผ่านผู้ใช้งานอีกครั้ง"
                  visible={visible}
                  onVisibilityChange={toggle}
                  withAsterisk
                />
                <Button
                  loading={LoadingLogin}
                  loaderProps={{ type: "dots" }}
                  type="submit"
                >
                  สมัครสมาชิก
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
