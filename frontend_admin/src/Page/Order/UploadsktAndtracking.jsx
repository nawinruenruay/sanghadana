import {
  Button,
  FileButton,
  Flex,
  Image,
  TextInput,
  Modal,
  LoadingOverlay,
  Tooltip,
  ActionIcon,
  Center,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useForm } from "@mantine/form";
import {
  IconDeviceFloppy,
  IconPlus,
  IconFileUpload,
  IconPhotoEdit,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";
import { MDBDataTableV5 } from "mdbreact";
import moment from "moment";

export function Uploadtracking({ close, closeWithSuccess, orderId }) {
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const form = useForm({
    initialValues: {
      note_tracking: "",
    },
    validate: {
      // note_tracking: (val) =>
      //   val.length < 10 ? "กรุณากรอกหมายเลขพัสดุให้ถูกต้อง" : null,
    },
  });

  const FetchData = () => {
    axios
      .post(TT + "Order/ShowOrder2", {
        order_id: orderId,
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          form.setValues({
            note_tracking: data[0].note_tracking,
          });
        }
      });
  };

  const Submit = (val) => {
    setLoadingSubmit(true);
    axios
      .post(TT + "Order/UploadNote_tracking", {
        order_id: orderId,
        note_tracking: val.note_tracking,
        typeadd: "note_tracking",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          Swal.fire({
            icon: "success",
            title: "อัพโหลดหลักฐานการส่งสินค้าเรียบร้อย",
            timer: 1500,
            timerProgressBar: true,
            allowOutsideClick: false,
            showConfirmButton: false,
          }).then(() => {
            closeWithSuccess();
          });
        }
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <form
        style={{ fontWeight: 400 }}
        onSubmit={form.onSubmit((val) => {
          Submit(val);
        })}
      >
        <Flex mah={300} justify={"space-between"} direction={"column"}>
          <TextInput
            label="เลขพัสดุ (Tracking)"
            placeholder="เลขพัสดุ (Tracking)"
            {...form.getInputProps("note_tracking")}
            withAsterisk
          />
        </Flex>
        <Flex pt={10} justify={"flex-end"} gap={5}>
          <Button
            fw={400}
            color="red"
            variant="subtle"
            onClick={() => {
              close();
            }}
          >
            ยกเลิก
          </Button>
          <Button
            loading={LoadingSubmit}
            type="submit"
            fw={400}
            color="green"
            leftSection={<IconDeviceFloppy />}
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

export function Uploadskt({ orderId, closeWithSuccess }) {
  useEffect(() => {
    FetchImage();
  }, []);

  const [ManagePic, setManagePic] = useState(false);
  const [DataImg, setDataImg] = useState([]);

  const columnimg = [
    {
      field: "img",
      label: "รูปภาพ",
    },
    {
      field: "manage",
      label: "จัดการ",
    },
  ];

  const [TableImage, setTableImage] = useState({
    columns: columnimg,
    rows: [],
  });

  const FetchImage = () => {
    axios
      .post(TT + "order/index/1", {
        order_id: orderId,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          setDataImg(res.data);
          setTableImage({
            columns: columnimg,
            rows: [
              ...res.data.map((i, key) => ({
                key: key,
                img: (
                  <Image
                    mah={150}
                    maw={150}
                    style={{ aspectRatio: "1/1" }}
                    src={TT + i.pic_skt}
                  />
                ),
                manage: (
                  <>
                    <Tooltip label="ลบรูปภาพ">
                      <ActionIcon
                        onClick={() => {
                          DelImage(i.id, i.order_id);
                        }}
                        color="red"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Tooltip>
                  </>
                ),
              })),
            ],
          });
        }
      });
  };

  const [OpenFormAdd, setOpenFormAdd] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFilesChange = (files) => {
    setArrImage([]);
    setImagePreviews([]);
    files.forEach((file) => {
      setArrImage((val) => [...val, { img: file }]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearFile = () => {
    setArrImage([]);
    setImagePreviews([]);
    resetRef.current?.();
  };

  const resetRef = useRef();
  const [ArrImage, setArrImage] = useState([]);
  const [LoadBtnImg, setLoadBtnImg] = useState(false);

  const uploadImage = async (images, id) => {
    const uploadPromises = images.map((image, index) => {
      const frmImg = new FormData();
      return new Promise((resolve) => {
        const currentTimestamp =
          moment().locale("th").format("DDMMYYHHmmss") + index;
        frmImg.append("order_id", id);
        frmImg.append("file", image.img);
        frmImg.append("name", currentTimestamp);
        frmImg.append("typeimg", "add");
        axios.post(TT + "order/Uploadskt", frmImg).then((res) => {
          setTimeout(() => {
            resolve({ index, success: res.data[0].message === "success" });
          }, 2000);
        });
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      const allSuccessful = results.every((result) => result.success);

      if (allSuccessful) {
        setLoadBtnImg(false);
        Swal.fire({
          icon: "success",
          title: "อัพโหลดรูปภาพเรียบร้อย",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          FetchImage();
          setOpenFormAdd(false);
          closeWithSuccess();
        });
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  const DelImage = (id, order_id) => {
    Swal.fire({
      icon: "warning",
      title: "ต้องการลบรูปภาพใช่หรือไม่ ?",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#38b000",
      cancelButtonColor: "#ef233c",
    }).then((res) => {
      if (res.isConfirmed === true) {
        setLoadDell(true);
        axios
          .post(TT + "order/DelImage", {
            id: id,
            order_id: order_id,
          })
          .then((res) => {
            if (res.data === "success") {
              Swal.fire({
                icon: "success",
                title: "ลบรูปภาพเรียบร้อย",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then(() => {
                setLoadDell(false);
                FetchImage();
                setOpenFormAdd(false);
              });
            }
          });
      }
    });
  };

  const [LoadDell, setLoadDell] = useState(false);

  return (
    <>
      <>
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Flex w={"100%"} justify={"flex-end"} pr={50}>
            <Tooltip label="จัดการรูปภาพ">
              <ActionIcon
                onClick={() => {
                  setManagePic(true);
                }}
                color="violet"
              >
                <IconPhotoEdit />
              </ActionIcon>
            </Tooltip>
          </Flex>
          <Carousel withIndicators height="100%">
            {Array.isArray(DataImg) &&
              DataImg.map((img, key) => (
                <Carousel.Slide p={10} key={key}>
                  <Center>
                    <Image maw={250} src={TT + img.pic_skt} />
                  </Center>
                </Carousel.Slide>
              ))}
          </Carousel>
        </Flex>
      </>

      <Modal
        size={"xl"}
        opened={ManagePic}
        onClose={() => {
          setManagePic(false);
        }}
      >
        <Flex justify={"flex-end"}>
          <Button
            onClick={() => {
              setManagePic(false);
              setOpenFormAdd(true);
            }}
            size="xs"
            color="green"
            variant="light"
          >
            <IconPlus />
            เพิ่มรูปภาพ
          </Button>
        </Flex>
        <LoadingOverlay visible={LoadDell} loaderProps={{ type: "dots" }} />
        <MDBDataTableV5
          data={TableImage}
          responsive
          searching={false}
          info={false}
          striped
          entries={3}
          entriesOptions={[3, 5, 10, 20]}
          entriesLabel="จำนวนรายการ"
        />
      </Modal>

      <Modal
        title="เพิ่มรูปภาพการถวายสังฆทาน"
        opened={OpenFormAdd}
        onClose={() => {
          setOpenFormAdd(false);
        }}
        centered
      >
        <FileButton
          onChange={handleFilesChange}
          multiple
          accept="image/png,image/jpeg"
        >
          {(props) => (
            <Button variant="light" color="violet" {...props}>
              เลือกรูปภาพ
            </Button>
          )}
        </FileButton>
        <Button variant="subtle" fw={400} color="red" onClick={clearFile}>
          รีเซ็ต
        </Button>
        <Button
          loading={LoadBtnImg}
          loaderProps={{ type: "dots" }}
          onClick={() => {
            setLoadBtnImg(true);
            uploadImage(ArrImage, orderId, ArrImage.length);
          }}
          disabled={ArrImage.length === 0 ? true : false}
          leftSection={<IconFileUpload />}
        >
          อัพโหลด
        </Button>
        {imagePreviews.length > 0 ? (
          <>
            <Carousel withIndicators height="100%">
              {imagePreviews.map((i, index) => (
                <Carousel.Slide key={index} p={10}>
                  <Center>
                    <Image maw={250} src={i} />
                  </Center>
                </Carousel.Slide>
              ))}
            </Carousel>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
}
