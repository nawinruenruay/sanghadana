import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Text,
  Paper,
  Flex,
  Group,
  Button,
  TextInput,
  Divider,
  Radio,
  UnstyledButton,
  Modal,
  LoadingOverlay,
  CheckIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconCheck } from "@tabler/icons-react";
import { useUser } from "../../components/UserContext";

import { AddEmail, Addphone, AddBirthday } from "./AddItems";

type FormValues = {
  name: string;
  sex: string;
};

export function Profile() {
  const nav = useNavigate();
  const { FetchUser } = useUser();
  const [ModalAddEmail, setModalAddEmail] = useState<boolean>(false);
  const [ModalAddPhone, setModalAddPhone] = useState<boolean>(false);
  const [ModalAddBirthday, setModalAddBirthday] = useState<boolean>(false);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Birthday, setBirthday] = useState("");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      sex: "",
    },
    validate: {
      name: (value) =>
        value.length < 6 ? "กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง" : null,
    },
  });

  const FetchData = async () => {
    setLoadingProfile(true);
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        form.setValues({
          name: userData.name,
          sex: userData.sex,
        });
        setEmail(userData.email);
        setPhone(userData.phone);
        setBirthday(userData.birthday);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length < 2) return number;
    return "*".repeat(number.length - 2) + number.slice(-2);
  };

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length < 2) return email;
    return `${localPart.slice(0, 2)}***@${domain}`;
  };

  const formatBirthday = (birthday: string) => {
    const [year, month] = birthday.split("-");
    return `**/${month}/${year.slice(0, 2)}**`;
  };

  const Submit = (val: any) => {
    setLoadingSubmit(true);
    setTimeout(() => {
      axios
        .post(Api + "user/index/3", {
          userid: atob(id),
          name: val.name,
          sex: val.sex,
          typeadd: "name_sex",
        })
        .then((res) => {
          if (res.data === 200) {
            setLoadingSubmit(false);
            Notifications.show({
              title: "บันทึกข้อมูลสำเร็จ",
              message: "คุณได้เพิ่มข้อมูลเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
          }
        });
    }, 2000);
  };

  useEffect(() => {
    if (id) {
      FetchData();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((val) => {
          Submit(val);
        })}
      >
        <LoadingOverlay
          visible={LoadingProfile}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
        <Paper shadow="sm" py={25} mih={400}>
          <Flex direction={"column"} px={30}>
            <Text size={"lg"} fw={"bold"}>
              ข้อมูลของฉัน
            </Text>
            <Text>จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</Text>
          </Flex>
          <Divider my="md" />
          <Group justify={"space-between"} gap={25} px={30}>
            <Flex
              gap={15}
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
            >
              <Flex align={"center"} gap={10}>
                <Text>ชื่อ</Text>
                <TextInput {...form.getInputProps("name")} />
              </Flex>
              <Flex align={"center"} gap={10}>
                <Text>อีเมล</Text>
                {Email.length > 0 ? (
                  <>
                    <Text>{formatEmail(Email)}</Text>
                    <UnstyledButton
                      variant="transparent"
                      c={"green"}
                      style={{ textDecoration: "underline" }}
                      onClick={() => setModalAddEmail(true)}
                    >
                      เปลี่ยน
                    </UnstyledButton>
                  </>
                ) : (
                  <>
                    <UnstyledButton
                      variant="transparent"
                      c={"green"}
                      style={{ textDecoration: "underline" }}
                      onClick={() => setModalAddEmail(true)}
                    >
                      เพิ่ม
                    </UnstyledButton>
                  </>
                )}
              </Flex>
              <Flex align={"center"} gap={10}>
                <Text>หมายเลขโทรศัพท์</Text>
                {Phone.length > 0 ? (
                  <>
                    <Text>{formatPhoneNumber(Phone)}</Text>
                    <UnstyledButton
                      variant="transparent"
                      c={"green"}
                      style={{ textDecoration: "underline" }}
                      onClick={() => setModalAddPhone(true)}
                    >
                      เปลี่ยน
                    </UnstyledButton>
                  </>
                ) : (
                  <>
                    <UnstyledButton
                      variant="transparent"
                      c={"green"}
                      style={{ textDecoration: "underline" }}
                      onClick={() => setModalAddPhone(true)}
                    >
                      เพิ่ม
                    </UnstyledButton>
                  </>
                )}
              </Flex>
              <Group gap={5}>
                <Text>เพศ</Text>
                <Radio.Group
                  value={form.values.sex}
                  onChange={(value) => form.setValues({ sex: value })}
                  withAsterisk
                >
                  <Group gap={5}>
                    <Radio label="ชาย" icon={CheckIcon} value="1" />
                    <Radio label="หญิง" icon={CheckIcon} value="2" />
                    <Radio label="อื่น ๆ" icon={CheckIcon} value="3" />
                  </Group>
                </Radio.Group>
              </Group>
              <Group gap={10}>
                <Text>วันเกิด</Text>
                {Birthday !== "0000-00-00" ? (
                  <>
                    <Text>{formatBirthday(Birthday)}</Text>
                    <UnstyledButton
                      variant="transparent"
                      c={"green"}
                      style={{ textDecoration: "underline" }}
                      onClick={() => setModalAddBirthday(true)}
                    >
                      เปลี่ยน
                    </UnstyledButton>
                  </>
                ) : (
                  <UnstyledButton
                    variant="transparent"
                    c={"green"}
                    style={{ textDecoration: "underline" }}
                    onClick={() => setModalAddBirthday(true)}
                  >
                    เพิ่ม
                  </UnstyledButton>
                )}
              </Group>
            </Flex>
            <Button
              w={"100%"}
              type="submit"
              loading={LoadingSubmit}
              loaderProps={{ type: "dots" }}
            >
              บันทึกข้อมูล
            </Button>
          </Group>
        </Paper>
      </form>

      <Modal
        title="อีเมล"
        opened={ModalAddEmail}
        onClose={() => {
          setModalAddEmail(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddEmail
          closeWithSuccess={() => {
            setModalAddEmail(false);
            Notifications.show({
              title: "เพิ่มอีเมลสำเร็จ",
              message: "คุณได้เพิ่มอีเมลเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddEmail(false);
          }}
        />
      </Modal>
      <Modal
        title="หมายเลขโทรศัพท์"
        opened={ModalAddPhone}
        onClose={() => {
          setModalAddPhone(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Addphone
          closeWithSuccess={() => {
            setModalAddPhone(false);
            Notifications.show({
              title: "เพิ่มหมายเลขโทรศัพท์สำเร็จ",
              message: "คุณได้เพิ่มหมายเลขโทรศัพท์เรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddPhone(false);
          }}
        />
      </Modal>
      <Modal
        title="วันเกิด"
        opened={ModalAddBirthday}
        onClose={() => {
          setModalAddBirthday(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddBirthday
          closeWithSuccess={() => {
            setModalAddBirthday(false);
            Notifications.show({
              title: "เพิ่มวันเกิดสำเร็จ",
              message: "คุณได้เพิ่มวันเกิดเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddBirthday(false);
          }}
        />
      </Modal>
    </>
  );
}
