import { useEffect } from "react";
import { Image, Text, Paper, Grid, Group } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { IconBrandFacebook } from "@tabler/icons-react";
import banner from "../../assets/img/banner_contact.png";

export function ContactPage() {
  useDocumentTitle("ติดต่อสอบถาม | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Paper radius={8} shadow="sm">
        <Image src={banner} radius={8} />
      </Paper>
      <Grid gutter="md" mt={20}>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Paper radius={8} shadow="md" px={50} py={20} h={"100%"}>
            <Text ta={"center"} size={"20px"} mb={20}>
              ติดต่อเรา
            </Text>
            <Text mb={10}>ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน</Text>
            <Text>
              202/16 หมู่ที่ 3 ตำบลนครชุม อำเภอเมือง จังหวัดกำแพงเพชร 62000
            </Text>
            <Text>โทรศัพท์ : 081-0435031 , 098-9745553</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Paper radius={8} shadow="md" px={50} py={20} h={"100%"}>
            <Text ta={"center"} size={"20px"} mb={20}>
              โซเชียล
            </Text>
            <Group mt={30}>
              <IconBrandFacebook /> <Text>ชฎาพร ทองธรรมชาติ</Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
      <Group align={"center"} justify={"center"} mt={40} mb={50}>
        <Text size={"20px"}>แผนที่ตั้ง วัดทุ่งเศรษฐี</Text>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1798.6231218385876!2d99.495681!3d16.453564!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30de1903e4340b6d%3A0x234a6c879ce43cf3!2sWat%20Thung%20Setthi!5e1!3m2!1sen!2sth!4v1715934412099!5m2!1sen!2sth"
          width="100%"
          height="545"
        ></iframe>
      </Group>
    </>
  );
}
