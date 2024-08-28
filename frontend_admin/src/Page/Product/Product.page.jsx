import {
  ActionIcon,
  Flex,
  Modal,
  Button,
  TextInput,
  Loader,
  Tooltip,
  LoadingOverlay,
  Paper,
  Skeleton,
  Container,
  Text,
  Image,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";
import axios from "axios";
import { MDBDataTableV5 } from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TT from "../../Api";

import FormAddItems from "./FormAddItems";
import EditItems from "./EditItems";
import UpdateItems from "./UpdateItems";

function Product() {
  const [OverLayLoad, setOverLayLoad] = useState(false);
  const [LoadingTable, setLoadingTable] = useState(false);
  const [LoadingBtn, setLoadingBtn] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [OpenUpdate, setOpenUpdate] = useState(false);
  const [ShowIMG, setShowIMG] = useState(false);

  const column = [
    {
      label: "#",
      field: "num",
    },
    {
      label: "ประเภทสินค้า",
      field: "ptname",
    },
    {
      label: "รูปสินค้า",
      field: "pic",
    },
    {
      label: "ชื่อสินค้า",
      field: "pname",
    },
    {
      label: "ราคาสินค้า",
      field: "price",
    },
    {
      label: "จำนวนสินค้า",
      field: "qty",
    },
    {
      label: "จัดการ",
      field: "manage",
    },
  ];

  const [Data, setData] = useState({
    columns: column,
    rows: [],
  });

  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = () => {
    setLoadingTable(true);
    axios.get(TT + "product/index").then((res) => {
      const data = res.data.data.data;
      if (data.length !== 0) {
        setData({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              num: key + 1,
              ptname: i.ptname,
              pic: (
                <Paper
                  onClick={() => {
                    setOverLayLoad(true);
                    ShowImage(
                      "http://localhost/apisangkhathan/" + i.img,
                      i.pid,
                      i.pname
                    );
                  }}
                  style={{ cursor: "pointer" }}
                  maw={90}
                >
                  <Image src={TT + i.img} />
                </Paper>
              ),
              pname: i.pname,
              price: i.price.toLocaleString() + " บาท",
              qty: i.qty,
              manage: (
                <>
                  <Flex gap={"5px"} justify="center" align="center">
                    <Tooltip label="อัพเดทรูปภาพ">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("pid", i.pid);
                          localStorage.setItem("pname", i.pname);
                          setOpenUpdate(true);
                        }}
                        color="blue"
                      >
                        <IconRefresh size={20} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="แก้ไขสินค้า">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("pid", i.pid);
                          localStorage.setItem("pname", i.pname);
                          setOpenEdit(true);
                        }}
                        color="yellow"
                      >
                        <IconEdit />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="ลบสินค้า">
                      <ActionIcon
                        onClick={() => {
                          DelProduct(i.pid, i.pname);
                        }}
                        color="red"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Tooltip>
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

  const ShowImage = (path, id, pname) => {
    localStorage.setItem("img", path);
    localStorage.setItem("id", id);
    localStorage.setItem("pname", pname);
    setTimeout(() => {
      setOverLayLoad(false);
      setShowIMG(true);
    }, 800);
  };

  const DelProduct = (pid, pname) => {
    Swal.fire({
      icon: "warning",
      title: "คุณต้องการลบสินค้าหรือไม่?",
      text: pname,
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed === true) {
        // setLoadDell(true);
        axios
          .post(TT + "Product/DelProduct", {
            pid: pid,
          })
          .then((res) => {
            if (res.data === "success") {
              Swal.fire({
                icon: "success",
                title: "ลบสินค้าเรียบร้อยแล้ว",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then((ress) => {
                // setLoadDell(false);
                LoadData();
              });
            }
          });
      }
    });
  };

  return (
    <>
      <Container pt={10} fluid p={{ base: "0px", sm: 10, md: 20, lg: 30 }}>
        <Flex justify={"space-between"} align={"center"} py={5}>
          <Text c={"var(--main-text)"} fz={18} fw={500}>
            รายการสินค้าทั้งหมด
          </Text>
          <Flex gap={10}>
            <Button
              onClick={() => {
                setLoadingBtn(true);
                setTimeout(() => {
                  setLoadingBtn(false);
                  setModalAdd(true);
                }, 450);
              }}
              loading={LoadingBtn}
              loaderProps={{ type: "dots" }}
              size={"sm"}
              fw={400}
              variant="light"
              // color="green"
              leftSection={<IconPlus />}
            >
              เพิ่มสินค้า
            </Button>
          </Flex>
        </Flex>
        <Paper
          mt={"sm"}
          bg={"white"}
          radius={8}
          shadow="sm"
          // p={10}
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
                searchLabel="ประเภทสินค้า , ชื่อสินค้า"
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
        title={localStorage.getItem("pname")}
        onClose={() => {
          localStorage.removeItem("img");
          localStorage.removeItem("id");
          localStorage.removeItem("pname");
          setShowIMG(false);
        }}
        opened={ShowIMG}
        centered
      >
        <Image src={localStorage.getItem("img")} />
      </Modal>
      <Modal
        title="เพิ่มสินค้า"
        opened={ModalAdd}
        onClose={() => {
          setModalAdd(false);
        }}
        size={"md"}
        centered
      >
        <FormAddItems
          close={() => {
            setModalAdd(false);
            LoadData();
          }}
        />
      </Modal>
      <Modal
        // opened={true}
        title={"อัพเดทรูปภาพ " + localStorage.getItem("pname")}
        size={"lg"}
        opened={OpenUpdate}
        onClose={() => {
          setOpenUpdate(false);
          localStorage.removeItem("pid");
          localStorage.removeItem("pname");
        }}
        centered
      >
        <UpdateItems
          close={() => {
            setOpenUpdate(false);
            LoadData();
          }}
        />
      </Modal>
      <Modal
        opened={OpenEdit}
        title={"แก้ไขข้อมูลสินค้า " + localStorage.getItem("pname")}
        onClose={() => {
          setOpenEdit(false);
          localStorage.removeItem("pid");
          localStorage.removeItem("pname");
        }}
        size={"sm"}
        centered
      >
        <EditItems
          closeWithSuccess={() => {
            LoadData();
            setOpenEdit(false);
          }}
          close={() => {
            setOpenEdit(false);
          }}
        />
      </Modal>
    </>
  );
}

export default Product;
