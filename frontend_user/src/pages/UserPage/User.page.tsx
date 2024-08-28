import { useState, useEffect } from "react";
import { Paper, Grid, Tabs, rem } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { IconUserCircle, IconShoppingBag, IconMap2 } from "@tabler/icons-react";
import { useMediaQuery, useDocumentTitle } from "@mantine/hooks";

import { Profile } from "./Profile";
import { Address } from "./Address";
import { Purchase } from "./Purchase";

export function UserPage() {
  const [title, setTitle] = useState("บัญชีของฉัน");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsValue = searchParams.get("v") || "profile";
  const iconStyle = { width: rem(15), height: rem(15) };
  const isMobile = useMediaQuery("(max-width: 999px)");

  useEffect(() => {
    switch (tabsValue) {
      case "profile":
        setTitle("บัญชีของฉัน");
        break;
      case "address":
        setTitle("ที่อยู่ของฉัน");
        break;
      case "purchase":
        setTitle("การซื้อของฉัน");
        break;
      case "password":
        setTitle("เปลี่ยนรหัสผ่าน");
        break;
      default:
        setTitle("บัญชีของฉัน");
        break;
    }
  }, [tabsValue]);

  useDocumentTitle(title + " | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");

  return (
    <>
      <Tabs
        defaultValue="profile"
        value={tabsValue}
        onChange={(value: any) => {
          setSearchParams({ v: value });
        }}
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="outline"
        mt={15}
        p={10}
      >
        <Grid gutter={20}>
          <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
            <Tabs.List grow>
              <Tabs.Tab
                value="profile"
                leftSection={<IconUserCircle style={iconStyle} />}
              >
                บัญชีของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="address"
                leftSection={<IconMap2 style={iconStyle} />}
              >
                ที่อยู่ของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="purchase"
                leftSection={<IconShoppingBag style={iconStyle} />}
              >
                การซื้อของฉัน
              </Tabs.Tab>
              {/* <Tabs.Tab
                value="password"
                leftSection={<IconPassword style={iconStyle} />}
              >
                เปลี่ยนรหัสผ่าน
              </Tabs.Tab> */}
            </Tabs.List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 10, lg: 10 }} w={999}>
            <Tabs.Panel value="profile" pos="relative">
              <Profile />
            </Tabs.Panel>

            <Tabs.Panel value="address">
              <Address />
            </Tabs.Panel>

            <Tabs.Panel value="purchase">
              <Purchase />
            </Tabs.Panel>

            <Tabs.Panel value="password">
              <Paper shadow="sm" px={30} py={25} mih={400}></Paper>
            </Tabs.Panel>
          </Grid.Col>
        </Grid>
      </Tabs>
    </>
  );
}
