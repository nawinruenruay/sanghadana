import axios from "axios";
import TT from "../../Api";
import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Center,
  Divider,
  FileButton,
  Flex,
  Image,
  LoadingOverlay,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconFileUpload,
  IconPhotoEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { MDBDataTableV5 } from "mdbreact";
import Swal from "sweetalert2";
import moment from "moment";

function DetailItems() {
  const [Detail, setDetail] = useState([]);

  const ShowDetail = () => {
    axios
      .post(TT + "Activity/ActivityDetail", {
        act_id: localStorage.getItem("act_id"),
      })
      .then((res) => {
        if (res.data.length !== 0) {
          setDetail(res.data);
        }
      });
  };

  useEffect(() => {
    ShowDetail();
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

  const options2 = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [TableImage, setTableImage] = useState({
    columns: columnimg,
    rows: [],
  });

  const FetchImage = () => {
    axios
      .post(TT + "Activity/AllImg", {
        act_id: localStorage.getItem("act_id"),
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
                    src={TT + i.gal_pic}
                  />
                ),
                manage: (
                  <>
                    <Tooltip label="ลบรูปภาพ">
                      <ActionIcon
                        onClick={() => {
                          DelImage(i.act_id, i.gal_id, i.gal_pic);
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
        frmImg.append("act_id", id);
        frmImg.append("file", image.img);
        frmImg.append("name", currentTimestamp);
        frmImg.append("typeimg", "add");
        axios.post(TT + "Activity/UploadGallery", frmImg).then((res) => {
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
        });
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  const DelImage = (act_id, gal_id) => {
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
          .post(TT + "Activity/DelImage", {
            act_id: act_id,
            gal_id: gal_id,
            // gal_pic: gal_pic,
          })
          .then((res) => {
            if (res.data === "success") {
              Swal.fire({
                icon: "success",
                title: "ลบรูปภาพเรียบร้อย",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then((ress) => {
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
      {Detail.length !== 0 && (
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
                      <Image maw={250} src={TT + img.gal_pic} />
                    </Center>
                  </Carousel.Slide>
                ))}
            </Carousel>
            <Flex direction={"column"} maw={500}>
              <Text>ชื่อกิจกรรม : {Detail[0].act_name}</Text>
              <Text>
                เผยแพร่วันที่ :{" "}
                {new Date(Detail[0].act_date).toLocaleDateString(
                  "TH-th",
                  options2
                )}
              </Text>
              <Flex direction={"column"} maw={500}>
                <Divider my="sm" variant="dashed" />
                <Text lineClamp={9}>รายละเอียด : {Detail[0].act_detail}</Text>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
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
          //   displayEntries={false}
          striped
          entries={3}
          entriesOptions={[3, 5, 10, 20]}
          entriesLabel="จำนวนรายการ"
        />
      </Modal>

      <Modal
        title="เพิ่มรูปภาพแกลเลอรี"
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
            uploadImage(
              ArrImage,
              localStorage.getItem("act_id"),
              ArrImage.length
            );
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

export default DetailItems;
