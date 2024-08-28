import { useNavigate } from "react-router-dom";
import { Image, Group } from "@mantine/core";
import screen from "../../assets/img/splashsreen.png";
import classes from "./Splashscreen.module.css";
import { useDocumentTitle } from "@mantine/hooks";

export function SplashscreenPage() {
  const nav = useNavigate();
  useDocumentTitle("ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");

  return (
    <>
      <Image src={screen} />
      <Group justify={"center"} align={"center"} mt={40} gap={10}>
        <button
          className={classes.button_82_pushable}
          onClick={() => nav("/product?t=สินค้าผลิตภัณฑ์")}
        >
          <span className={classes.button_82_shadow}></span>
          <span className={classes.button_82_edge}></span>
          <span className={classes.button_82_front}>สินค้าผลิตภัณฑ์</span>
        </button>

        <button
          className={classes.button_82_pushable}
          onClick={() => nav("/product?t=สังฆฑานออนไลน์")}
        >
          <span className={classes.button_82_shadow}></span>
          <span className={classes.button_82_edge}></span>
          <span className={classes.button_82_front}>สังฆทานออนไลน์</span>
        </button>
      </Group>
    </>
  );
}
