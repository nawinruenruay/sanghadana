import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Api } from "../../Api";
import {
  Image as MantineIMG,
  Container,
  Text,
  Skeleton,
  Paper,
  Grid,
  Group,
  Card,
  Blockquote,
  Anchor,
  Breadcrumbs,
  UnstyledButton,
} from "@mantine/core";
import { NavLink as Nl, useParams, useSearchParams } from "react-router-dom";
import {
  IconInfoCircle,
  IconCalendarMonth,
  IconChevronRight,
  IconDownload,
} from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import { Fancybox } from "@fancyapps/ui";
import classes from "./Gallery.module.css";

export function GalleryDetailPage() {
  const [searchParams] = useSearchParams();
  const v1: any = searchParams.get("v");
  const { galleryName } = useParams<{ galleryName: any }>();
  useDocumentTitle(galleryName + " | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const icon = <IconInfoCircle />;
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loadData = useCallback(async (v1: string) => {
    setLoadingData(true);
    try {
      const res = await axios.post(Api + "activity/index", {
        act_id: v1,
      });
      if (res.data.status === 200) {
        const data = res.data.data.data;
        setData(data);
        preloadImages(data.map((i: any) => Api + i.gal_pic));
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const formatDateThai = (dateStr: string) => {
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

  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const items = useMemo(
    () =>
      [
        { title: "ภาพกิจกรรม", href: "/gallery" },
        {
          title: <>{truncateText(galleryName, 15)}</>,
          href: "",
        },
      ].map((item, index) => (
        <Anchor key={index} component={Nl} to={item.href}>
          {item.title}
        </Anchor>
      )),
    [galleryName]
  );

  const preloadImages = (urls: string[]) => {
    let loaded = 0;
    const total = urls.length;
    const onLoad = () => {
      loaded++;
      if (loaded === total) {
        setImagesLoaded(true);
      }
    };

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = onLoad;
      img.onerror = onLoad;
    });
  };

  useEffect(() => {
    if (!loadingData && !imagesLoaded) {
      preloadImages(data.map((i: any) => Api + i.gal_pic));
    }
  }, [loadingData, imagesLoaded, data]);

  useEffect(() => {
    if (imagesLoaded) {
      Fancybox.bind('[data-fancybox="gallery"]');
    }
  }, [imagesLoaded]);

  useEffect(() => {
    if (v1) {
      loadData(v1).catch((error) => {
        console.error("Error loading data", error);
      });
    }
    window.scrollTo(0, 0);
  }, [v1, loadData]);

  return (
    <Container size={"1200px"}>
      {loadingData || !imagesLoaded ? (
        <Paper radius={8} shadow="sm" p={10}>
          <Skeleton height={20} width="50%" mb={20} />
          <Skeleton height={40} width="70%" mb={10} />
          <Skeleton height={20} width="60%" mb={30} />
          <Grid gutter="md" mt={50} mb={50}>
            {Array.from({ length: data.length || 4 }).map((_, index) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={index}>
                <Card shadow="sm" withBorder>
                  <Card.Section
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Skeleton height={200} width="100%" />
                  </Card.Section>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      ) : (
        <>
          <Breadcrumbs
            separatorMargin={"xs"}
            ml={20}
            mb={20}
            separator={<IconChevronRight stroke={1} />}
          >
            {items}
          </Breadcrumbs>
          {data
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex((t) => t.act_detail === item.act_detail)
            )
            .map((i) => (
              <Blockquote
                cite={
                  <Group gap={2}>
                    <IconCalendarMonth size={20} />
                    {formatDateThai(i.act_date)}
                  </Group>
                }
                icon={icon}
                key={i.act_id}
              >
                <Text size={"25px"}> {galleryName} </Text>
                <Text mt={15}>{i.act_detail}</Text>
              </Blockquote>
            ))}
          <Grid gutter="md" mt={50} mb={50}>
            {data.map((i, key) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={key}>
                <Card shadow="sm" withBorder>
                  <Card.Section style={{ position: "relative" }}>
                    <UnstyledButton
                      component="a"
                      data-fancybox="gallery"
                      href={Api + i.gal_pic}
                    >
                      <MantineIMG
                        src={Api + i.gal_pic}
                        loading="lazy"
                        className={classes.image}
                        alt="Gallery Image"
                      />
                    </UnstyledButton>
                    <UnstyledButton
                      component="a"
                      target="_blank"
                      href={Api + i.gal_pic}
                      className={classes.downloadButton}
                    >
                      <IconDownload size={24} />
                    </UnstyledButton>
                  </Card.Section>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
