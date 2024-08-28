import {
  IconPower,
  IconUser,
  Icon123,
  IconUsers,
  IconNotes,
} from "@tabler/icons-react";
import { ThemeIcon } from "@mantine/core";

export interface MenuItem {
  title: string;
  path: string;
  icon?: JSX.Element;
  sub?: MenuItem[];
}

const data: MenuItem[] = [
  {
    title: "หน้าหลัก",
    path: "/home",
    icon: (
      <ThemeIcon variant="light" size={30}>
        <IconPower size={20} />
      </ThemeIcon>
    ),
  },
  {
    title: "สินค้า & สังฆทาน",
    path: "/product",
    icon: (
      <ThemeIcon variant="light" size={30}>
        <IconUser size={20} />
      </ThemeIcon>
    ),
  },
  {
    title: "ประวัติ",
    path: "/about",
    icon: (
      <ThemeIcon variant="light" size={30}>
        <IconNotes size={20} />
      </ThemeIcon>
    ),
  },
  {
    title: "ภาพกิจกรรม",
    path: "/gallery",
    icon: (
      <ThemeIcon variant="light" size={30}>
        <IconUsers size={20} />
      </ThemeIcon>
    ),
  },
  {
    title: "ติดต่อสอบถาม",
    path: "/contact",
    icon: (
      <ThemeIcon variant="light" size={30}>
        <Icon123 size={20} />
      </ThemeIcon>
    ),
  },
];

export default data;
