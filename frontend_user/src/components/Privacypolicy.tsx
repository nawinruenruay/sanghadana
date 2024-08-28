import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Box, Group, Button, Text, UnstyledButton } from "@mantine/core";

export function Privacypolicy() {
  const nav = useNavigate();
  const [isVisible, setIsVisible] = useState(!Cookies.get("acceptPolicy"));

  const handleAccept = () => {
    Cookies.set("acceptPolicy", "accepted", { expires: 365 });
    setIsVisible(false);
  };

  const handlePDPA = () => {
    nav("/privacypolicy");
  };

  return (
    isVisible && (
      <Box
        pos={"fixed"}
        bottom={0}
        w={"100%"}
        bg={"rgba(51, 51, 51, 0.8)"}
        c={"#fff"}
        p={"15px"}
      >
        <Group justify={"center"} align={"center"} gap={10}>
          <Text>
            เว็บไซต์ของเราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพในการใช้งานเว็บไซต์
          </Text>
          <UnstyledButton onClick={handlePDPA}>
            <Text td="underline">
              อ่านนโยบายข้อมูลส่วนบุคคล (PDPA) และ ข้อกำหนดในการให้บริการ
            </Text>
          </UnstyledButton>
          <Button onClick={handleAccept}>ยอมรับ</Button>
        </Group>
      </Box>
    )
  );
}
