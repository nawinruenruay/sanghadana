import { Text, Container, ActionIcon, Group, rem, Image } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandFacebook,
} from "@tabler/icons-react";
import logo from "../../assets/icon/LOGO.png";
import classes from "./Footer.module.css";

const data = [
  {
    title: "ที่อยู่",
    links: [
      {
        label: "202/16 หมู่ที่ 3 ",
        link: "/",
      },
      {
        label: "ตำบลนครชุม อำเภอเมือง",
        link: "/",
      },
      {
        label: " จังหวัดกำแพงเพชร 62000",
        link: "/",
      },
    ],
  },
  {
    title: "ติดต่อสอบถาม",
    links: [
      { label: "081-0435031", link: "/" },
      { label: "098-9745553", link: "/" },
    ],
  },
  {
    title: "โซเชียลมีเดีย",
    links: [
      {
        label: (
          <>
            <Group>
              <IconBrandFacebook size={18} /> ชฎาพร ทองธรรมชาติ
            </Group>
          </>
        ),
        link: "/",
      },
    ],
  },
];

const currentYear = new Date().getFullYear();

function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image src={logo} />
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © สงวนลิขสิทธิ์ {currentYear} ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}

export default Footer;
