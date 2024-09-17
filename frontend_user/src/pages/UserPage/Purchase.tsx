import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Text,
  Paper,
  Flex,
  Group,
  Button,
  Divider,
  LoadingOverlay,
  Badge,
  Box,
  Image,
  Tooltip,
  CopyButton,
  ActionIcon,
  rem,
  Modal,
  Center,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Carousel } from "@mantine/carousel";
import { useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconX,
  IconCash,
  IconMoodSad,
  IconChevronRight,
  IconEye,
  IconCopy,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import clsx from "clsx";
import classes from "./User.module.css";
import { useUser } from "../../components/UserContext";

type DateOptions = {
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
};

interface Items {
  id: any;
  order_id: any;
  order_date: any;
  status: any;
  note_tracking: any;
}

interface Image {
  id: string;
  url: string;
}

export function Purchase() {
  const nav = useNavigate();
  const { FetchUser } = useUser();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [Expanded, setExpanded] = useState<any[]>([]);
  const [Table, setTable] = useState<any[]>([]);
  const [ExpandedData, setExpandedData] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [DataImg, setDataImg] = useState<Image[]>([]);
  const [cachedImages, setCachedImages] = useState<{ [key: string]: Image[] }>(
    {}
  );
  const [ModalImg, setModalImg] = useState(false);

  const LoadDatatable = () => {
    setLoadingProfile(true);
    if (id) {
      axios
        .post(Api + "user/index/1", {
          userid: atob(id),
        })
        .then((res) => {
          const data = res.data;
          if (data.length !== 0) {
            const configData = data.map((i: any, key: any) => ({
              ...i,
              id: key + 1,
            }));
            setTable(configData);
          }
          setLoadingProfile(false);
        });
    }
  };

  const Loaddata2 = async (order_id: any) => {
    if (!ExpandedData[order_id]) {
      const res = await axios.post(Api + "user/index/2", {
        userid: atob(id),
        order_id: order_id,
      });
      const data = res.data;
      if (data.length !== 0) {
        const configData = data.map((i: any, key: any) => ({
          ...i,
          id: key + 1,
        }));
        setExpandedData((prev) => ({ ...prev, [order_id]: configData }));
      }
    }
  };

  const FetchImage = async (order_id: any) => {
    if (!cachedImages[order_id]) {
      try {
        const res = await axios.post(Api + "order/index/1", { order_id });
        if (res.data.length !== 0) {
          setCachedImages((prev) => ({ ...prev, [order_id]: res.data }));
          setDataImg(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    } else {
      setDataImg(cachedImages[order_id]);
    }
  };

  const options2: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const Checkoutt = async (order_id: any) => {
    const data = await FetchUser(id);
    const userData = data.data.data[0];
    if (userData.address === "") {
      Swal.fire({
        title: "คุณยังไม่ได้กรอกที่อยู่?",
        text: "กรุณากรอกที่อยู่ก่อนทำการชำระเงิน!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "green",
      }).then((result) => {
        if (result.isConfirmed) {
          nav("/user/account/?v=address");
        }
      });
    } else {
      nav("/checkout", { state: { order_id } });
    }
  };

  const CancelOrder = (order_id: any) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกการสั่งซื้อ?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "green",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(Api + "buy/index/4", {
            order_id: order_id,
          })
          .then((res) => {
            if (res.data === 200) {
              Notifications.show({
                title: "ยกเลิกการสั่งซื้อสำเร็จ",
                message: "คุณได้ยกเลิกการสั่งซื้อเรียบร้อยแล้ว",
                autoClose: 2000,
                color: "green",
                icon: <IconCheck />,
              });
              LoadDatatable();
            }
          });
      }
    });
  };

  useEffect(() => {
    if (id) {
      LoadDatatable();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, []);

  const PAGE_SIZES = [5, 10, 15];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [record, setRecord] = useState<Items[]>([]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecord(
      Table.slice(from, to).map((i: any, key: any) => ({
        ...i,
        id: from + key + 1,
      }))
    );
  }, [page, pageSize, Table]);

  return (
    <>
      <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
        <LoadingOverlay
          visible={LoadingProfile}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
        <Group justify={"space-between"} px={30}>
          <Text size={"lg"} fw={"bold"}>
            การซื้อของฉัน
          </Text>
        </Group>
        <Divider mt="md" />
        <Box>
          <DataTable
            styles={{
              header: {
                height: "50px",
              },
            }}
            minHeight={300}
            idAccessor="order_id"
            loaderType="dots"
            highlightOnHover
            columns={[
              {
                accessor: "x",
                title: "",
                render: ({ order_id }) => (
                  <>
                    <Tooltip label="ดูรายการที่สั่งซื้อ">
                      <Flex align={"center"} justify={"center"}>
                        <IconChevronRight
                          className={clsx(classes.expandIcon, {
                            [classes.expandIconRotated]:
                              Expanded.includes(order_id),
                          })}
                          stroke={1}
                        />
                      </Flex>
                    </Tooltip>
                  </>
                ),
              },
              {
                accessor: "order_date",
                textAlign: "center",
                title: "วันที่สั่งซื้อ",
                render: ({ order_date }) => (
                  <>
                    <Text size={"md"}>
                      {new Date(order_date).toLocaleDateString(
                        "TH-th",
                        options2
                      )}
                    </Text>
                  </>
                ),
              },
              {
                accessor: "order_id",
                textAlign: "center",
                title: "เลขที่การสั่งซื้อ",
                render: ({ order_id }) => (
                  <>
                    <Text size={"md"}>{order_id}</Text>
                  </>
                ),
              },
              {
                accessor: "status",
                textAlign: "center",
                title: "สถานะ",
                width: 200,
                render: ({ status }) => (
                  <>
                    <Flex align={"center"} justify={"center"}>
                      {status == 1 ? (
                        <Badge color="yellow" size="lg" variant="light">
                          รอการชำระเงิน
                        </Badge>
                      ) : status == 2 ? (
                        <Badge color="orange" size="lg" variant="light">
                          รอตรวจสอบการชำระเงิน
                        </Badge>
                      ) : status == 3 ? (
                        <Badge color="blue" size="lg" variant="light">
                          รอดำเนินการ
                        </Badge>
                      ) : status == 4 ? (
                        <Badge color="green" size="lg" variant="light">
                          ดำเนินการเรียบร้อย
                        </Badge>
                      ) : status == 5 ? (
                        <Badge color="red" size="lg" variant="light">
                          ยกเลิกการสั่งซื้อ
                        </Badge>
                      ) : (
                        <></>
                      )}
                    </Flex>
                  </>
                ),
              },
              {
                accessor: "xx",
                textAlign: "center",
                title: "จัดการ",
                render: ({ status, order_id, note_tracking }) => (
                  <Flex
                    align={"center"}
                    justify={"center"}
                    gap={5}
                    wrap={"wrap"}
                  >
                    {status == 1 ? (
                      <>
                        <Button
                          leftSection={<IconCash />}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            Checkoutt(order_id);
                          }}
                        >
                          ชำระเงิน
                        </Button>
                        <Button
                          variant={"subtle"}
                          color="red"
                          leftSection={<IconX />}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            CancelOrder(order_id);
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </>
                    ) : status == 2 ? (
                      <></>
                    ) : status == 3 ? (
                      <></>
                    ) : status == 4 ? (
                      <>
                        {note_tracking ? (
                          <>
                            <Text size={"md"}>
                              หมายเลขพัสดุ : {note_tracking}
                            </Text>
                            <CopyButton value={note_tracking} timeout={1500}>
                              {({ copied, copy }) => (
                                <Tooltip
                                  label={copied ? "Copied" : "Copy"}
                                  withArrow
                                  position="right"
                                >
                                  <ActionIcon
                                    color={copied ? "teal" : "gray"}
                                    variant="subtle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copy();
                                    }}
                                  >
                                    {copied ? (
                                      <IconCheck style={{ width: rem(16) }} />
                                    ) : (
                                      <IconCopy style={{ width: rem(16) }} />
                                    )}
                                  </ActionIcon>
                                </Tooltip>
                              )}
                            </CopyButton>
                          </>
                        ) : (
                          <>
                            <Button
                              variant={"subtle"}
                              leftSection={<IconEye />}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                FetchImage(order_id);
                                setModalImg(true);
                              }}
                            >
                              ดูรูปภาพการถวายสังฆทาน
                            </Button>
                          </>
                        )}
                      </>
                    ) : status == 5 ? (
                      <></>
                    ) : (
                      <></>
                    )}
                  </Flex>
                ),
              },
            ]}
            totalRecords={Table.length}
            recordsPerPage={pageSize}
            page={page}
            records={record}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            paginationText={({ from, to, totalRecords }) =>
              `แสดง ${from} ถึง ${to} ของ ${totalRecords} รายการ`
            }
            recordsPerPageLabel="แสดงรายการ"
            noRecordsText="ไม่พบรายการสินค้า"
            noRecordsIcon={
              <Box p={4} mb={4} className={classes.noRecordsBox}>
                <IconMoodSad size={36} strokeWidth={1.5} />
              </Box>
            }
            rowExpansion={{
              allowMultiple: false,
              expanded: {
                recordIds: Expanded,
                onRecordIdsChange: async (newExpanded: any) => {
                  setExpanded(newExpanded);
                  if (newExpanded.length > 0) {
                    const order_id = newExpanded[0];
                    if (!ExpandedData[order_id]) {
                      await Loaddata2(order_id);
                    }
                  }
                },
              },
              content: ({ record }) => {
                const order_id = record.order_id;
                const details = ExpandedData[order_id] || [];
                return (
                  <DataTable
                    striped
                    columns={[
                      {
                        accessor: "name",
                        title: "รายการ",
                        render: ({ pname, img }) => (
                          <>
                            <Group ml={30}>
                              <Image src={Api + img} h={30} w={30} />
                              <Text>{pname}</Text>
                            </Group>
                          </>
                        ),
                      },
                      {
                        accessor: "qty",
                        title: "จำนวน (ชิ้น)",
                        textAlign: "center",
                        render: ({ qty }) => (
                          <>
                            <Box component="span">
                              <span> {qty}</span>
                            </Box>
                          </>
                        ),
                      },
                      {
                        accessor: "price",
                        title: "ราคา (บาท)",
                        textAlign: "center",
                        render: ({ total }) => (
                          <>
                            <Box component="span">
                              <span>{total.toLocaleString()}</span>
                            </Box>
                          </>
                        ),
                      },
                    ]}
                    records={details}
                  />
                );
              },
            }}
          />
        </Box>
      </Paper>

      <Modal
        title={"รูปภาพการถวายสังฆทาน"}
        opened={ModalImg}
        onClose={() => {
          setModalImg(false);
        }}
        size={"xl"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        // classNames={{
        //   content: classes.customModal,
        //   header: classes.customModal,
        // }}
        centered
      >
        <Carousel withIndicators height="100%">
          {Array.isArray(DataImg) &&
            DataImg.map((img: any, key: number) => (
              <Carousel.Slide p={10} key={key}>
                <Center>
                  <Image maw={250} src={Api + img.pic_skt} />
                </Center>
              </Carousel.Slide>
            ))}
        </Carousel>
      </Modal>
    </>
  );
}
