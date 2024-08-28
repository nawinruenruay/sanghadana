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
// import { modals } from "@mantine/modals";
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
import DetailItems from "./DetailItems";

function Activity() {
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
      label: "ชื่อกิจกรรม",
      field: "act_name",
    },
    {
      label: "วันที่แผยแพร่",
      field: "act_date",
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
    axios.get(TT + "activity/index").then((res) => {
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
                      "http://localhost/apisangkhathan/" + i.act_pic,
                      i.act_id,
                      i.act_name
                    );
                  }}
                  style={{ cursor: "pointer" }}
                  maw={90}
                >
                  <Image src={TT + i.act_pic} />
                </Paper>
              ),
              act_name: i.act_name,
              act_date: new Date(i.act_date).toLocaleDateString(
                "TH-th",
                options2
              ),
              manage: (
                <>
                  <Flex gap={"5px"} justify="center" align="center">
                    <Tooltip label="รายละเอียด">
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
                    </Tooltip>
                    <Tooltip label="อัพเดทรูปภาพ">
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
                    </Tooltip>
                    <Tooltip label="แก้ไขข้อมูลกิจกรรม">
                      <ActionIcon
                        onClick={() => {
                          localStorage.setItem("act_id", i.act_id);
                          localStorage.setItem("act_name", i.act_name);
                          setOpenEdit(true);
                        }}
                        color="yellow"
                      >
                        <IconEdit />
                      </ActionIcon>
                    </Tooltip>
                    {/* กำลังพิจารณาว่าจะทำลบกิจกรรมมั้ย ?????????? */}
                    {/* <Tooltip label="ลบกิจกรรม">
                      <ActionIcon
                        onClick={() => {
                          DelStudent(i.act_id, i.act_name);
                        }}
                        color="red"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Tooltip> */}
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

  const ShowImage = (act_pic, act_id, act_name) => {
    localStorage.setItem("act_pic", act_pic);
    localStorage.setItem("act_id", act_id);
    localStorage.setItem("act_name", act_name);
    setTimeout(() => {
      setOverLayLoad(false);
      setShowIMG(true);
    }, 800);
  };

  return (
    <>
      <Container pt={10} fluid p={{ base: "0px", sm: 10, md: 20, lg: 30 }}>
        <Flex justify={"space-between"} align={"center"} py={5}>
          <Text c={"var(--main-text)"} fz={18} fw={500}>
            รายการกิจกรรมทั้งหมด
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
              เพิ่มกิจกรรม
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
                searchLabel="ชื่อกิจกรรม , วันที่เผยแพร่"
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
        size={"lg"}
        opened={OpenDetail}
        onClose={() => {
          setOpenDetail(false);
          localStorage.removeItem("act_id");
        }}
        centered
      >
        <DetailItems />
      </Modal>
      <Modal
        title={localStorage.getItem("act_name")}
        onClose={() => {
          localStorage.removeItem("act_pic");
          localStorage.removeItem("act_id");
          localStorage.removeItem("act_name");
          setShowIMG(false);
        }}
        opened={ShowIMG}
        centered
      >
        <Image src={localStorage.getItem("act_pic")} />
      </Modal>
      <Modal
        title="เพิ่มกิจกรรม"
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
        opened={OpenEdit}
        title={"แก้ไขข้อมูลกิจกรรม"}
        onClose={() => {
          setOpenEdit(false);
          localStorage.removeItem("act_id");
          localStorage.removeItem("act_name");
        }}
        size={"auto"}
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
      <Modal
        title={"อัพเดทรูปภาพ " + localStorage.getItem("act_name")}
        size={"lg"}
        opened={OpenUpdate}
        onClose={() => {
          setOpenUpdate(false);
          localStorage.removeItem("act_id");
          localStorage.removeItem("act_name");
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
    </>
  );
}

export default Activity;
