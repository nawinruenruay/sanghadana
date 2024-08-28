import { useEffect, /*useRef,*/ useState } from "react";
import axios from "axios";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Group,
  Card,
  Grid,
  Flex,
  Skeleton,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconCalendarMonth } from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import banner from "../../assets/img/banner_gallery.png";
import classes from "./Gallery.module.css";

export function GalleryPage() {
  useDocumentTitle("ภาพกิจกรรม | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const nav = useNavigate();
  const [Gallery, setGallery] = useState([]);
  const [LoadingData, setLoadingData] = useState(false);

  const FetchGellery = () => {
    setLoadingData(true);
    axios.get(Api + "activity/index").then((res) => {
      const data = res.data.data.data;
      if (res.data.status === 200) {
        setGallery(data);
      }
      setLoadingData(false);
    });
  };

  const formatDateThai = (dateStr: any) => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const ViewGalley = (v1: string, v2: string) => {
    nav("/gallery/" + v2 + "?v=" + v1);
  };

  useEffect(() => {
    FetchGellery();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Paper radius={8} shadow="sm">
        <Image src={banner} radius={8} />
      </Paper>

      {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm" mt={20} mb={20}>
            <Flex direction={"row"} gap={10}>
              <Skeleton h={200} w={300} />
              <Skeleton h={200} w={300} />
              <Skeleton h={200} w={300} />
              <Skeleton h={200} w={300} />
            </Flex>
          </Paper>
        </>
      ) : (
        <>
          <Grid gutter="md" mt={20} m={5} mb={50}>
            {Gallery.map((i: any) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={i.act_id}>
                <Card
                  shadow="sm"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    ViewGalley(i.act_id, i.act_name);
                  }}
                >
                  <Card.Section
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={Api + i.act_pic}
                      className={classes.image}
                      h={200}
                    />
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text lineClamp={3}>{i.act_name}</Text>
                  </Group>

                  <Group gap={2}>
                    <IconCalendarMonth size={20} />
                    <Text size="sm" c="dimmed">
                      {formatDateThai(i.act_date)}
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
