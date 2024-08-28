import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Flex,
  Grid,
  Group,
  Button,
  Badge,
  Modal,
  Anchor,
  Breadcrumbs,
  TextInput,
  LoadingOverlay,
  Center,
  Skeleton,
} from "@mantine/core";
import {
  useParams,
  NavLink as Nl,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import {
  IconMinus,
  IconPlus,
  IconMoodSad,
  IconCheck,
  IconChevronRight,
  IconExclamationMark,
} from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import classes from "./Product.module.css";
import { useCartsum } from "../../components/CartContext";
import Swal from "sweetalert2";

export function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const productId: any = searchParams.get("v");
  const productType = searchParams.get("t");
  const { productName } = useParams<{
    productName: any;
  }>();
  useDocumentTitle(productName + " | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const nav = useNavigate();
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState([]);
  const [ShowIMG, setShowIMG] = useState(false);
  const [ImagePath, setImagePath] = useState("");
  const [Price, setPrice] = useState("");
  const [Qty, setQty] = useState(1);
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const { fetchCartsum } = useCartsum();
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const base64UrlDecode = (str: string): string => {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (str.length % 4)) % 4);
    str += padding;
    return atob(str);
  };
  const useProductId = base64UrlDecode(productId);

  const LoadData = useCallback((useProductId: any) => {
    setLoadingData(true);
    axios
      .post(Api + "product/index", {
        pid: useProductId,
      })
      .then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data.data;
          setData(data);
          setPrice(data[0].price);
        }
        setLoadingData(false);
      });
  }, []);

  const Addcart = () => {
    setLoadingSubmit(true);
    setTimeout(() => {
      if (!id) {
        Notifications.show({
          title: "เพิ่มสินค้าไม่สำเร็จ",
          message: "คุณต้องเข้าสู่ระบบก่อนสั่งสินค้า",
          autoClose: 2000,
          color: "red",
          icon: <IconExclamationMark />,
        });
        nav("/login");
      } else {
        axios
          .post(Api + "cart/index/2", {
            qty: Qty,
            price: Price,
            pid: useProductId,
            userid: atob(id),
          })
          .then((res) => {
            if (res.data === 200) {
              setLoadingSubmit(false);
              Notifications.show({
                title: "เพิ่มสินค้าเรียบร้อย",
                message: "คุณได้เพิ่มสินค้าลงในตระกร้าแล้ว",
                autoClose: 2000,
                color: "green",
                icon: <IconCheck />,
              });
              fetchCartsum(atob(id));
            } else if (res.data.status === 400) {
              setLoadingSubmit(false);
              Swal.fire({
                icon: "info",
                iconColor: "red",
                text: res.data.message,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
            }
          });
      }
    }, 1000);
  };

  const ShowImage = (path: string) => {
    setImagePath(path);
    setShowIMG(true);
  };

  const items = useMemo(
    () =>
      [
        {
          title: productType,
          href: "/product?t=" + productType,
        },
        {
          title: productName,
          href: "/" + productName + "?v=" + productId + "&t=" + productType,
        },
      ].map((item, index) => (
        <Anchor key={index} component={Nl} to={item.href}>
          {item.title}
        </Anchor>
      )),
    []
  );

  useEffect(() => {
    LoadData(useProductId);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs
        separatorMargin={"xs"}
        ml={20}
        mb={20}
        separator={<IconChevronRight stroke={1} />}
      >
        {items}
      </Breadcrumbs>

      {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm" p={10}>
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={400} />
            </Flex>
          </Paper>
        </>
      ) : (
        <>
          <Paper radius={5} shadow="sm" p={15} mb={50} pos={"relative"}>
            <LoadingOverlay
              visible={LoadingData}
              zIndex={100}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ type: "dots" }}
            />
            {Data.map((i: any, key) => (
              <Grid key={key} gutter={50} justify="center" align="center">
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Center>
                    <Image
                      radius="md"
                      src={Api + i.img}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        ShowImage(Api + i.img);
                      }}
                      className={classes.image}
                      w={400}
                      h={400}
                    />
                  </Center>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Flex justify="center" direction="column" wrap="wrap">
                    {/* TITLE */}
                    <Group>
                      <Badge color={"red"} size={"lg"}>
                        แนะนำ
                      </Badge>
                      <Text size={"xl"}>{i.pname}</Text>
                    </Group>
                    <Text size={"30px"} mt={20} c={"green"}>
                      ฿ {i.price.toLocaleString()} บาท
                    </Text>

                    {/* DETAIL */}
                    {i.qty > 0 ? (
                      <>
                        <Text mt={40}>มีสินค้าทั้งหมด {i.qty} ชิ้น</Text>
                      </>
                    ) : (
                      <>
                        <Group gap={5} mt={30}>
                          <Text c={"red"}>สินค้าหมด</Text>
                          <IconMoodSad size={30} color={"red"} />
                        </Group>
                      </>
                    )}

                    {/* BUTTON */}
                    {i.qty > 0 ? (
                      <>
                        <Group mt={30}>
                          <Text>จำนวน </Text>
                          <Group gap={0} align="center">
                            <Button
                              variant="default"
                              radius={0}
                              onClick={() => setQty((v) => (v > 1 ? v - 1 : 1))}
                            >
                              <IconMinus size={16} />
                            </Button>
                            <TextInput
                              radius={0}
                              w={70}
                              value={Qty}
                              onChange={(e: any) => {
                                const value = e.currentTarget.value;
                                if (/^\d*$/.test(value)) {
                                  const newQty = parseInt(value, 10);
                                  if (newQty <= i.qty) {
                                    setQty(newQty);
                                  }
                                }
                              }}
                              classNames={{ input: classes.textinput }}
                            />
                            <Button
                              variant="default"
                              radius={0}
                              onClick={() =>
                                setQty((v) => (v < i.qty ? v + 1 : v))
                              }
                            >
                              <IconPlus size={16} />
                            </Button>
                          </Group>
                        </Group>
                        <Flex mt={25} gap={10}>
                          <Button
                            w={"100%"}
                            onClick={Addcart}
                            loading={LoadingSubmit}
                            loaderProps={{ type: "dots" }}
                          >
                            เพิ่มไปยังตระกร้า
                          </Button>
                        </Flex>
                      </>
                    ) : (
                      <></>
                    )}
                  </Flex>
                </Grid.Col>
              </Grid>
            ))}
          </Paper>
        </>
      )}

      <Modal
        onClose={() => {
          setShowIMG(false);
          setImagePath("");
        }}
        opened={ShowIMG}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={"auto"}
        withCloseButton={false}
        classNames={{
          content: classes.customModal,
          header: classes.customModal,
        }}
      >
        <Image src={ImagePath} />
      </Modal>
    </>
  );
}
