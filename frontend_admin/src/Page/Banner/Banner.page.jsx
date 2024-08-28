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
// import UpdateItems from "./UpdateItems";
// import DetailItems from "./DetailItems";

function Banner() {
  const [OverLayLoad, setOverLayLoad] = useState(false);
  const [LoadingTable, setLoadingTable] = useState(false);
  const [LoadingBtn, setLoadingBtn] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [OpenUpdate, setOpenUpdate] = useState(false);
  const [OpenDetail, setOpenDetail] = useState(false);
  const [ShowIMG, setShowIMG] = useState(false);

  const column = [
    {
      label: "#",
      field: "num",
    },
    {
      label: "รูปภาพ",
      field: "pic",
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
    axios.get(TT + "banner/index").then((res) => {
      const data = res.data.data.data;
      if (data.length !== 0) {
        setData({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              num: key + 1,
              pic: (
                <Paper
                  onClick={() => {
                    setOverLayLoad(true);
                    ShowImage(
                      "http://localhost/apisangkhathan/" + i.banner_pic,
                      i.banner_id
                    );
                  }}
                  style={{ cursor: "pointer" }}
                  maw={90}
                >
                  <Image src={TT + i.banner_pic} />
                </Paper>
              ),
              manage: (
                <>
                  <Flex gap={"5px"} justify="center" align="center">
                    {/* <Tooltip label="รายละเอียด">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("act_id", i.act_id);
                          setOpenDetail(true);
                        }}
                        color="violet"
                        variant="filled"
                      >
                        <IconEye size={20} />
                      </ActionIcon>
                    </Tooltip> */}
                    {/* <Tooltip label="อัพเดทรูปภาพ">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("act_id", i.act_id);
                          localStorage.setItem("act_name", i.act_name);
                          setOpenUpdate(true);
                        }}
                        color="blue"
                      >
                        <IconRefresh size={20} />
                      </ActionIcon>
                    </Tooltip> */}
                    <Tooltip label="แก้ไขแบนเนอร์">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("banner_id", i.banner_id);
                          setOpenEdit(true);
                        }}
                        color="yellow"
                      >
                        <IconEdit />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="ลบแบนเนอร์">
                      <ActionIcon
                        onClick={() => {
                          DelBanner(i.banner_id);
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

  const ShowImage = (banner_pic, banner_id) => {
    localStorage.setItem("banner_pic", banner_pic);
    localStorage.setItem("banner_id", banner_id);
    setTimeout(() => {
      setOverLayLoad(false);
      setShowIMG(true);
    }, 800);
  };

  const DelBanner = (banner_id) => {
    Swal.fire({
      icon: "warning",
      title: "คุณต้องการลบแบนเนอร์หรือไม่?",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed === true) {
        axios
          .post(TT + "Banner/DelBanner", {
            banner_id: banner_id,
          })
          .then((res) => {
            if (res.data === "success") {
              Swal.fire({
                icon: "success",
                title: "ลบแบนเนอร์เรียบร้อยแล้ว",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then((ress) => {
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
            รายการแบนเนอร์ทั้งหมด
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
              เพิ่มแบนเนอร์
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
                searchTop={false}
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
        onClose={() => {
          localStorage.removeItem("banner_id");
          localStorage.removeItem("banner_pic");
          setShowIMG(false);
        }}
        opened={ShowIMG}
        centered
        size={"auto"}
      >
        <Image src={localStorage.getItem("banner_pic")} />
      </Modal>
      <Modal
        title="เพิ่มแบนเนอร์"
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
          }}
        />
      </Modal>
      <Modal
        opened={OpenEdit}
        title={"แก้ไขแบนเนอร์"}
        onClose={() => {
          setOpenEdit(false);
          localStorage.removeItem("banner_id");
        }}
        size={"lg"}
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

export default Banner;
