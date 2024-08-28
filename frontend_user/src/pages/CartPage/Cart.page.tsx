import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Flex,
  Button,
  Anchor,
  Box,
  Breadcrumbs,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { NavLink as Nl, useNavigate } from "react-router-dom";
import {
  IconMoodSad,
  IconX,
  IconChevronRight,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { Notifications } from "@mantine/notifications";
import { useDocumentTitle } from "@mantine/hooks";
import classes from "./Card.module.css";
import cartempty from "../../assets/img/cartempty.png";
import { useCartsum } from "../../components/CartContext";

export function CartPage() {
  useDocumentTitle("ตระกร้า | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const { cartsum, fetchCartsum } = useCartsum();
  const nav = useNavigate();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const totalAmount = Data.reduce((sum: any, i: any) => sum + i.total, 0);

  const LoadData = (v: any) => {
    setLoadingData(true);
    if (v) {
      axios
        .post(Api + "cart/index/1", {
          userid: v,
        })
        .then((res) => {
          const data = res.data;
          if (data.length !== 0) {
            setData(data);
          }
          setLoadingData(false);
        });
    }
  };

  const Buy = () => {
    if (id) {
      axios
        .post(Api + "buy/index/1", {
          userid: atob(id),
        })
        .then((res) => {
          if (res.data === 200) {
            Notifications.show({
              title: "สั่งซื้อสินค้าสำเร็จ",
              message: "คุณสั่งซื้อสินค้าเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });

            fetchCartsum(atob(id));
            LoadData(atob(id));
            if (Data.length >= 1) {
              setData([]);
            }
            nav("/user/account/?v=purchase");
          } else if (res.data === 400) {
            Notifications.show({
              title: "สั่งซื้อสินค้าไม่สำเร็จ",
              message: "คุณต้องเพิ่มจำนวนสินค้าก่อนจะสั่งซื้อ",
              autoClose: 2000,
              color: "red",
              icon: <IconInfoCircle />,
            });
          }
        });
    }
  };

  const Delcart = (qty: number, price: number, pid: string) => {
    if (id && qty && price && pid) {
      axios
        .post(Api + "cart/index/3", {
          qty: qty,
          price: price,
          pid: pid,
          userid: atob(id),
        })
        .then((res) => {
          if (res.data === 200) {
            fetchCartsum(atob(id));
            LoadData(atob(id));
            if (Data.length === 1) {
              setData([]);
            }
          }
        });
    }
  };

  const items = [
    { title: "สินค้า / สังฆทาน", href: "/product" },
    { title: "ตระกร้า", href: "/cart" },
  ].map((item, index) => (
    <Anchor key={index} component={Nl} to={item.href} fz={"h5"}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    if (!id) {
      nav("/login");
    }
    if (id) {
      LoadData(atob(id));
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs
        separatorMargin={"xs"}
        mb={20}
        ml={20}
        separator={<IconChevronRight stroke={1} />}
      >
        {items}
      </Breadcrumbs>
      <Flex gap={30} direction="column" mb={50}>
        {Data.length !== 0 ? (
          <>
            <Paper shadow="xs">
              <DataTable
                styles={{
                  header: {
                    height: "50px",
                  },
                }}
                // scrollAreaProps={{ type: "never" }}
                minHeight={350}
                height={400}
                idAccessor="pid"
                fetching={LoadingData}
                loaderType="dots"
                noRecordsText="ไม่มีสินค้าในตระกร้า"
                noRecordsIcon={
                  <Box p={4} mb={4} className={classes.noRecordsBox}>
                    <IconMoodSad size={36} strokeWidth={1.5} />
                  </Box>
                }
                highlightOnHover
                columns={[
                  {
                    accessor: "pname",
                    title: "สินค้า / สังฆทาน",
                    render: ({ pname, img }) => (
                      <Flex align={"center"}>
                        <Image src={Api + img} w={45} />
                        <Text ml={15}>{pname}</Text>
                      </Flex>
                    ),
                  },
                  {
                    accessor: "price",
                    textAlign: "center",
                    title: "ราคาต่อชิ้น",
                    render: ({ price }) => (
                      <Text>฿{price.toLocaleString()}</Text>
                    ),
                  },
                  {
                    accessor: "qty",
                    textAlign: "center",
                    title: "จำนวน",
                    render: ({ qty }) => (
                      <>
                        <Flex justify={"center"}>
                          <Text>{qty}</Text>
                        </Flex>
                      </>
                    ),
                  },
                  {
                    accessor: "total",
                    textAlign: "center",
                    title: "ราคารวม",
                    render: ({ total }) => (
                      <Text c={"green"} fw={"bold"}>
                        ฿{total.toLocaleString()}
                      </Text>
                    ),
                  },
                  {
                    accessor: "del",
                    title: "ลบ",
                    textAlign: "center",
                    render: ({ qty, price, pid }) => (
                      <Tooltip label="ลบสินค้า">
                        <ActionIcon
                          color="red"
                          onClick={() => Delcart(qty, price, pid)}
                          variant="transparent"
                        >
                          <IconX />
                        </ActionIcon>
                      </Tooltip>
                    ),
                  },
                ]}
                records={Data}
              />
            </Paper>
            {/* <Divider variant="dashed" /> */}
            <Paper shadow="xs" p={30}>
              <Flex justify={"space-between"}>
                <Text fz={"lg"} fw={"bold"}>
                  ราคารวม ({cartsum} ชิ้น) :
                </Text>
                <Text fz={"lg"} fw={"bold"}>
                  ฿{totalAmount.toLocaleString()} บาท
                </Text>
              </Flex>
              <Flex justify={"flex-end"} mt={20}>
                <Button w={"100%"} onClick={Buy}>
                  สั่งซื้อสินค้า/สังฆทาน
                </Button>
              </Flex>
            </Paper>
          </>
        ) : (
          <>
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              wrap={"wrap"}
              w={"100%"}
            >
              <Image src={cartempty} w={300} />
              <Text fw={"bold"}>ตระกร้าสินค้า ว่างอยู่นะ!</Text>
              <Button onClick={() => nav("/product")} mt={20}>
                เลือกสินค้า / สังฆทานได้เลย
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
}
