import {
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import Logo from "../assets/icon/LOGO.png";
import { useForm } from "@mantine/form";
import axios from "axios";
import TT from "../Api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Login() {
  const nav = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (v) => (v.length !== 0 ? null : "กรุณากรอกชื่อผู้ใช้งาน"),
      password: (v) => (v.length !== 0 ? null : "กรุณากรอกรหัสผ่าน"),
    },
  });
  const [LoadingLogin, setLoadingLogin] = useState(false);

  const Login = (v) => {
    setLoadingLogin(true);
    axios
      .post(TT + "Auth/LoginAdmin", {
        username: v.username,
        password: v.password,
      })
      .then((res) => {
        setLoadingLogin(false);
        if (res.data.message === "success") {
          const data = res.data.data[0];
          Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            text: "ยินดีต้อนรับ " + data.name,
            timer: 1200,
            timerProgressBar: true,
            showConfirmButton: false,
            focusConfirm: false,
          }).then((resp) => {
            localStorage.clear();
            const dataUser = {
              id: btoa(data.userid),
              role: "Admin",
              name: data.name,
            };
            localStorage.setItem("UUID", res.data.uuid);
            // localStorage.setItem("tokenID", res.data.token);
            localStorage.setItem("auth", res.data.auth);
            localStorage.setItem("dataUser", JSON.stringify(dataUser));
            nav("/home");
          });
        } else {
          setLoadingLogin(false);
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: "ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง",
            confirmButtonColor: "red",
            confirmButtonText: "ตกลง",
          });
        }
      });
  };

  return (
    <form
      onSubmit={form.onSubmit((v) => {
        Login(v);
      })}
      style={{ backgroundColor: "#edf2f4" }}
    >
      <Container fluid bg={"#edf2f4"} h={"100dvh"}>
        <Flex h="100%" align={"center"} justify={"center"}>
          <Paper p={20} mah={800} w={"clamp(375px,80vw,400px)"}>
            <Flex justify={"center"} wrap={"wrap"}>
              <Image w={"100%"} maw={120} src={Logo} />
            </Flex>

            <Flex
              c={"#2b2d42"}
              justify={"center"}
              align={"center"}
              direction={"column"}
            >
              <Text fz={"h3"} fw={"bold"}>
                Superadmin System
              </Text>
            </Flex>
            <Divider my="sm" variant="dashed" />
            <SimpleGrid cols={1} pt={5}>
              <TextInput
                {...form.getInputProps("username")}
                label="ชื่อผู้ใช้งาน"
              />
              <TextInput
                {...form.getInputProps("password")}
                type="password"
                label="รหัสผ่าน"
              />
              <Button
                loading={LoadingLogin}
                loaderProps={{ type: "dots" }}
                type="submit"
                color="#7ea236"
              >
                เข้าสู่ระบบ
              </Button>
            </SimpleGrid>
          </Paper>
        </Flex>
      </Container>
    </form>
  );
}

export default Login;
