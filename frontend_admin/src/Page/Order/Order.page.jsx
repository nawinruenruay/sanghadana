import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Flex,
  Modal,
  Button,
  Tooltip,
  Paper,
  Skeleton,
  Container,
  Text,
  Badge,
  LoadingOverlay,
  Image,
  Group,
} from "@mantine/core";
import axios from "axios";
import { MDBDataTableV5 } from "mdbreact";
import {
  IconPlus,
  IconEye,
  IconCheck,
  IconClick,
  IconEdit,
} from "@tabler/icons-react";
import Swal from "sweetalert2";

import TT from "../../Api";
import DetailItems from "./DetailItems";
import { Uploadskt, Uploadtracking } from "./UploadsktAndtracking";

function Order() {
  const [OverLayLoad, setOverLayLoad] = useState(false);
  const [LoadingTable, setLoadingTable] = useState(false);
  const [OpenDetail, setOpenDetail] = useState(false);
  const [ShowIMG, setShowIMG] = useState(false);
  // Modal หลักฐานการส่งสินค้าและอัพโหลดรูปภาพการถวายสังฆทาน
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ModalEvidence, setModalEvidence] = useState(false);
  const [ModalUploadskt, setModalUploadskt] = useState(false);
  const [ModalUploadtracking, setModalUploadtracking] = useState(false);

  const column = [
    {
      label: "#",
      field: "num",
    },
    {
      label: "วันที่สั่งซื้อ",
      field: "order_date",
    },
    {
      label: "เลขที่การสั่งซื้อ",
      field: "order_id",
    },
    {
      label: "ชื่อลูกค้า",
      field: "name",
    },
    {
      label: "รายการสินค้าที่สั่งซื้อ",
      field: "orderdetail",
    },

    {
      label: "สถานะ",
      field: "status",
    },
    {
      label: "จัดการ",
      field: "manage",
    },
  ];

  const options2 = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [Data, setData] = useState({
    columns: column,
    rows: [],
  });

  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = () => {
    setLoadingTable(true);
    axios.get(TT + "Order/ShowOrder").then((res) => {
      const data = res.data;
      if (data.length !== 0) {
        setData({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              num: key + 1,
              order_date: (
                <>
                  {new Date(i.order_date).toLocaleDateString("TH-th", options2)}
                </>
              ),
              order_id: i.order_id,
              name: i.name,
              orderdetail: (
                <>
                  <Button
                    h={"20px"}
                    variant="filled"
                    radius="xl"
                    leftSection={<IconClick />}
                    color="cyan"
                    onClick={() => {
                      localStorage.setItem("order_id", i.order_id);
                      localStorage.setItem("name", i.name);
                      setOpenDetail(true);
                    }}
                  >
                    ดูรายการสินค้าที่สั่งซื้อ
                  </Button>
                </>
              ),
              status: (
                <>
                  <Flex align={"center"}>
                    {i.status == 1 ? (
                      <Badge color="yellow">รอการชำระเงิน</Badge>
                    ) : i.status == 2 ? (
                      <Badge color="orange">รอตรวจสอบการชำระเงิน</Badge>
                    ) : i.status == 3 ? (
                      <Badge color="green">ชำระเงินเรียบร้อยแล้ว</Badge>
                    ) : i.status == 4 ? (
                      <Badge color="green">ดำเนินการเรียบร้อย</Badge>
                    ) : i.status == 5 ? (
                      <Badge color="red">ยกเลิกการสั่งซื้อ</Badge>
                    ) : (
                      ""
                    )}
                  </Flex>
                </>
              ),
              manage: (
                <>
                  <Flex
                    align={"center"}
                    direction={"row"}
                    wrap={"wrap"}
                    gap={"5px"}
                  >
                    {i.status == 1 ? (
                      ""
                    ) : i.status == 2 ? (
                      <>
                        <Tooltip label="ตรวจสอบการชำระเงิน">
                          <ActionIcon
                            onClick={() => {
                              setOverLayLoad(true);
                              ShowImage(
                                TT + i.pay_slip,
                                i.order_id,
                                i.pay_date,
                                i.pay_time
                              );
                            }}
                            color="orange"
                          >
                            <IconEye />
                          </ActionIcon>
                        </Tooltip>
                        ,
                        <Tooltip label="ยืนยันการชำระเงิน">
                          <ActionIcon
                            color="green"
                            onClick={() => {
                              Confirmpay(i.order_id);
                            }}
                          >
                            <IconCheck />
                          </ActionIcon>
                        </Tooltip>
                        ,
                      </>
                    ) : i.status == 3 ? (
                      <>
                        <Tooltip label="อัพโหลดหลักฐานการส่งสินค้าหรือรูปภาพการถวายสังฆทาน">
                          <ActionIcon
                            color="grape"
                            onClick={() => {
                              UploadEvidence(i.order_id);
                            }}
                          >
                            <IconPlus />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    ) : i.status == 4 ? (
                      <>
                        <Tooltip label="แก้ไขหลักฐานการส่งสินค้าหรือรูปภาพการถวายสังฆทาน">
                          <ActionIcon
                            color="orange"
                            onClick={() => {
                              UploadEvidence(i.order_id);
                            }}
                          >
                            <IconEdit />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    ) : (
                      ""
                    )}
                  </Flex>
                </>
              ),
            })),
          ],
        });
      }
      setLoadingTable(false);
    });
  };

  const Confirmpay = (order_id) => {
    Swal.fire({
      icon: "warning",
      title: "ยืนยันการชำระเงิน?",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed === true) {
        axios
          .post(
            TT + "Order/Confirmpay",
            {
              order_id: order_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            if (res.data === "success") {
              Swal.fire({
                icon: "success",
                title: "ยืนยันการชำระเงินเรียบร้อย",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then(() => {
                LoadData();
              });
            }
          });
      }
    });
  };

  const ShowImage = (pay_slip, order_id, pay_date, pay_time) => {
    localStorage.setItem("order_id", order_id);
    localStorage.setItem("pay_slip", pay_slip);
    localStorage.setItem("pay_date", pay_date);
    localStorage.setItem("pay_time", pay_time);
    setTimeout(() => {
      setOverLayLoad(false);
      setShowIMG(true);
    }, 800);
  };

  const UploadEvidence = (order_id) => {
    setSelectedOrderId(order_id);
    setModalEvidence(true);
  };

  return (
    <>
      <Container pt={10} fluid p={{ base: "0px", sm: 10, md: 20, lg: 30 }}>
        <Flex justify={"space-between"} align={"center"} py={5}>
          <Text c={"var(--main-text)"} fz={18} fw={500}>
            รายการออเดอร์ทั้งหมด
          </Text>
        </Flex>
        <Paper
          mt={"sm"}
          bg={"white"}
          radius={8}
          shadow="sm"
          style={{ borderRadius: "8px" }}
        >
          <LoadingOverlay
            loaderProps={{ type: "dots" }}
            visible={OverLayLoad}
          />
          {LoadingTable === true ? (
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={20} />
              <Skeleton w={"60%"} h={10} />
              <Skeleton w={"50%"} h={10} />
              <Skeleton w={"30%"} h={10} />
            </Flex>
          ) : (
            <>
              <MDBDataTableV5
                barReverse={true}
                responsive
                searchLabel="ค้นหา..."
                searchTop={true}
                searchBottom={false}
                data={Data}
                noRecordsFoundLabel="ไม่พบรายการ"
                entries={3}
                entriesOptions={[3, 5, 10, 20, 25, 50, 100]}
                infoLabel={["แสดงรายการที่", "ถึง", "จาก", "รายการ"]}
                entriesLabel="จำนวนรายการ"
              />
            </>
          )}
        </Paper>
      </Container>

      <Modal
        title={
          "ชำระเงินวันที่  " +
          new Date(localStorage.getItem("pay_date")).toLocaleDateString(
            "TH-th",
            options2
          ) +
          " เวลา " +
          localStorage.getItem("pay_time")
        }
        onClose={() => {
          localStorage.removeItem("order_id");
          localStorage.removeItem("pay_slip");
          localStorage.removeItem("pay_date");
          localStorage.removeItem("pay_time");
          setShowIMG(false);
        }}
        opened={ShowIMG}
        centered
      >
        <Image src={localStorage.getItem("pay_slip")} />
      </Modal>

      <Modal
        title={"รายการสินค้าที่สั่งซื้อ " + localStorage.getItem("name")}
        size={"lg"}
        opened={OpenDetail}
        onClose={() => {
          setOpenDetail(false);
          localStorage.removeItem("order_id");
          localStorage.removeItem("name");
        }}
        centered
      >
        <DetailItems />
      </Modal>

      {/* อัพโหลดหลักฐานการส่งสินค้าหรือรูปภาพการถวายสังฆทาน */}
      <Modal
        title={"อัพโหลดหลักฐานการส่งสินค้าหรือรูปภาพการถวายสังฆทาน"}
        size={"lg"}
        opened={ModalEvidence}
        onClose={() => {
          setModalEvidence(false);
          setSelectedOrderId(null);
        }}
        centered
      >
        <Group justify="center" gap="xs" grow>
          <Button
            variant={"light"}
            onClick={() => {
              setModalUploadtracking(true);
              // setModalEvidence(false);
            }}
          >
            หลักฐานการส่งสินค้า
          </Button>
          <Button
            variant={"light"}
            onClick={() => {
              setModalUploadskt(true);
              // setModalEvidence(false);
            }}
          >
            รูปภาพการถวายสังฆทาน
          </Button>
        </Group>
      </Modal>
      {/* หลักฐานการส่งสินค้า */}
      <Modal
        title={"หลักฐานการส่งสินค้า"}
        size={"lg"}
        opened={ModalUploadtracking}
        onClose={() => {
          setModalUploadtracking(false);
        }}
        centered
      >
        <Uploadtracking
          orderId={selectedOrderId}
          closeWithSuccess={() => {
            LoadData();
            setModalEvidence(false);
            setModalUploadtracking(false);
          }}
          close={() => {
            setModalUploadtracking(false);
          }}
        />
      </Modal>
      {/* รูปภาพการถวายสังฆทาน  */}
      <Modal
        title={"รูปภาพการถวายสังฆทาน"}
        size={"lg"}
        opened={ModalUploadskt}
        onClose={() => {
          setModalUploadskt(false);
        }}
        centered
      >
        <Uploadskt
          orderId={selectedOrderId}
          closeWithSuccess={() => {
            LoadData();
            setModalEvidence(false);
            setModalUploadskt(false);
          }}
          // close={() => {
          //   setModalUploadskt(false);
          // }}
        />
      </Modal>
    </>
  );
}

export default Order;
