import { useEffect, useState } from "react";
import {
  Text,
  Paper,
  Flex,
  Group,
  Button,
  Divider,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useUser } from "../../components/UserContext";

import { AddAddress } from "./AddItems";

export function Address() {
  const nav = useNavigate();
  const { FetchUser } = useUser();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [ModalAddAddress, setModalAddAddress] = useState<boolean>(false);
  const [IsAddress, setIsAddress] = useState("");
  const [DataAddress, setDataAddress] = useState<any[]>([]);

  const FetchData = async () => {
    setLoadingProfile(true);
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        setIsAddress(userData.address);
        setDataAddress(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingProfile(false);
    }
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
      <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
        <LoadingOverlay
          visible={LoadingProfile}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
        <Group justify={"space-between"} px={30}>
          <Text size={"lg"} fw={"bold"}>
            ที่อยู่ของฉัน
          </Text>
          {IsAddress !== "" ? (
            <></>
          ) : (
            <Button
              leftSection={<IconPlus />}
              onClick={() => setModalAddAddress(true)}
            >
              เพิ่มที่อยู่
            </Button>
          )}
        </Group>
        <Divider my="md" />
        {IsAddress !== "" ? (
          DataAddress.map((i: any, key) => (
            <Group px={30} key={key} justify={"space-between"}>
              <Flex direction={"column"}>
                <Text>
                  {i.ad_name} | {i.ad_phone}
                </Text>
                <Text>{i.address}</Text>
                <Text>
                  {i.ad_tambon}, {i.ad_amphure}, จังหวัด
                  {i.ad_province}, {i.zip_code}
                </Text>
              </Flex>
              <Flex>
                <Button
                  variant={"outline"}
                  onClick={() => setModalAddAddress(true)}
                >
                  แก้ไข
                </Button>
              </Flex>
            </Group>
          ))
        ) : (
          <></>
        )}
      </Paper>
      <Modal
        title="ที่อยู่ใหม่"
        opened={ModalAddAddress}
        onClose={() => {
          setModalAddAddress(false);
        }}
        size={"auto"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddAddress
          closeWithSuccess={() => {
            setModalAddAddress(false);
            Notifications.show({
              title: "เพิ่มที่อยู่สำเร็จ",
              message: "คุณได้ที่เพิ่มอยู่เรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            FetchData();
          }}
          close={() => {
            setModalAddAddress(false);
          }}
        />
      </Modal>
    </>
  );
}
