import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Api } from "../../Api";
import { Image, Skeleton, Paper, Flex } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useDocumentTitle } from "@mantine/hooks";
import classes from "./Home.module.css";

export function HomePage() {
  useDocumentTitle("หน้าหลัก | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [Banner, setBanner] = useState([]);
  const [LoadingData, setLoadingData] = useState(false);

  const FetchBanner = () => {
    setLoadingData(true);
    axios.get(Api + "banner/index").then((res) => {
      const data = res.data.data.data.filter(
        (i: any) => i.banner_status === "T"
      );
      if (res.data.status === 200) {
        setBanner(data);
      }
      setLoadingData(false);
    });
  };

  useEffect(() => {
    FetchBanner();
  }, []);

  return (
    <>
      {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm" mb={20}>
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={450} />
            </Flex>
          </Paper>
        </>
      ) : (
        <>
          <Paper radius={8} shadow="sm" mb={20}>
            <Carousel
              withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              classNames={classes}
            >
              {Array.isArray(Banner) &&
                Banner.map((img: any, key) => (
                  <Carousel.Slide key={key}>
                    <Image src={Api + img.banner_pic} radius={8} w={"100%"} />
                  </Carousel.Slide>
                ))}
            </Carousel>
          </Paper>
        </>
      )}
    </>
  );
}
