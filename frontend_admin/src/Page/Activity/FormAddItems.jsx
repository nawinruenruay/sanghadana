import {
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications, notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";
import moment from "moment";

function FormAddItems({ close }) {
  //// if not img ===  public/uploadimg/Defualt/noimage.png
  const resetRef = useRef();
  const form = useForm({
    initialValues: {
      act_name: "",
      act_detail: "",
      img: null,
    },
    validate: {
      act_name: (val) => (val.length < 1 ? "กรุณาเพิ่มชื่อกิจกรรม" : null),
      act_detail: (val) =>
        val.length < 1 ? "กรุณาเพิ่มรายละเอียดกิจกรรม" : null,
      // img: (val) => (val === null ? "กรุณาเพิ่มรูปภาพสินค้า" : null),
    },
  });

  const [Day, setDay] = useState([]);
  const [Month, setMonth] = useState([]);
  const [Year, setYear] = useState([]);

  const [File, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
  );

  const FetchDate = () => {
    ///วันที่///
    const day = [];
    for (let i = 1; i <= 31; i++) {
      let v = i < 10 ? "0" + i : i.toString();
      day.push({
        value: v,
        label: v,
      });
    }
    setDay(day);

    ///เดือน///
    const month = [
      {
        value: "1",
        label: "มกราคม",
      },
      {
        value: "2",
        label: "กุมภาพันธ์",
      },
      {
        value: "3",
        label: "มีนาคม",
      },
      {
        value: "4",
        label: "เมษายน",
      },
      {
        value: "5",
        label: "พฤษภาคม",
      },
      {
        value: "6",
        label: "มิถุนายน",
      },
      {
        value: "7",
        label: "กรกฎาคม",
      },
      {
        value: "8",
        label: "สิงหาคม",
      },
      {
        value: "9",
        label: "กันยายน",
      },
      {
        value: "10",
        label: "ตุลาคม",
      },
      {
        value: "11",
        label: "พฤศจิกายน",
      },
      {
        value: "12",
        label: "ธันวาคม",
      },
    ];
    setMonth(month);
    ///ปี///
    const year = [];
    const yearNow = new Date().getFullYear() + 543;
    for (let k = 0; k < 31; k++) {
      year.push({
        value: (yearNow - k).toString(),
        label: (yearNow - k).toString(),
      });
    }
    setYear(year);
  };

  const [Day1, setDay1] = useState("01");
  const [Month1, setMonth1] = useState("1");
  const [Year1, setYear1] = useState(
    (new Date().getFullYear() + 543).toString()
  );

  const handleFileChange = (files) => {
    setFile(files);
    form.setValues({
      img: files,
    });
    // const file = files[0];
    if (files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(files);
    } else {
      setFile(null);
      form.setValues({
        img: null,
      });
      setSelectedImage(
        "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
      );
    }
  };

  const clearFile = () => {
    setFile(null);
    form.setValues({
      img: null,
    });
    setSelectedImage(
      "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
    );
    resetRef.current?.();
  };

  useEffect(() => {
    FetchDate();
  }, []);

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (val) => {
    setLoadingSubmit(true);

    // if (val.img === null) {
    //   Notifications.show({
    //     title: "กรุณาเพิ่มรูปภาพสินค้า",
    //     autoClose: 1500,
    //     withIcon: true,
    //     color: "red",
    //   });
    //   setLoadingSubmit(false);
    //   return;
    // }

    if (val.img === null) {
      const imggg = "public/uploadimg/noimage.png";
      axios
        .post(TT + "Activity/AddActivity", {
          act_name: val.act_name,
          act_detail: val.act_detail,
          act_date: Year1 - 543 + "-" + Month1 + "-" + Day1,
          img: imggg,
        })
        .then((add) => {
          console.log(Year1 - 543 + "-" + Month1 + "-" + Day1);
          if (add.data === "ok") {
            setLoadingSubmit(false);
            Swal.fire({
              icon: "success",
              title: "เพิ่มกิจกรรมเรียบร้อย",
              timer: 1500,
              timerProgressBar: true,
              allowOutsideClick: false,
              showConfirmButton: false,
            }).then((reees) => {
              close();
            });
          }
        });
    } else {
      const currentTimestamp = moment().locale("th").format("DDMMYYHHmmss");
      const Update = new FormData(); //สร้างฟอร์มสำหรับการส่งข้อมูล
      Update.append("file", val.img);
      Update.append("name", currentTimestamp);
      Update.append("typeimg", "add");

      axios.post(TT + "Activity/UploadIMG", Update).then((res) => {
        const imgpath = res.data[0].data;
        axios
          .post(TT + "Activity/AddActivity", {
            act_name: val.act_name,
            act_detail: val.act_detail,
            act_date: Year1 - 543 + "-" + Month1 + "-" + Day1,
            img: imgpath,
          })
          .then((add) => {
            if (add.data === "ok") {
              setLoadingSubmit(false);
              Swal.fire({
                icon: "success",
                title: "เพิ่มกิจกรรมเรียบร้อย",
                timer: 1500,
                timerProgressBar: true,
                allowOutsideClick: false,
                showConfirmButton: false,
              }).then((reees) => {
                close();
              });
            }
          });
      });
    }
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <form
        style={{ fontWeight: 400 }}
        onSubmit={form.onSubmit((value) => {
          Submit(value);
        })}
      >
        <TextInput
          withAsterisk
          {...form.getInputProps("act_name")}
          label="ชื่อกิจกรรม"
          placeholder="กรอกชื่อกิจกรรม"
        />
        <Textarea
          withAsterisk
          {...form.getInputProps("act_detail")}
          label="รายละเอียด"
          placeholder="กรอกรายละเอียด"
          rows={3}
          maxRows={3}
        />
        <SimpleGrid cols={3}>
          <Select
            allowDeselect={false}
            onChange={setDay1}
            value={Day1}
            label="วัน"
            data={Day}
            searchable
          />
          <Select
            allowDeselect={false}
            label="เดือน"
            value={Month1}
            onChange={setMonth1}
            data={Month}
            searchable
          />
          <Select
            allowDeselect={false}
            label="ปี"
            onChange={setYear1}
            value={Year1}
            data={Year}
            searchable
          />
        </SimpleGrid>
        <Flex mah={300} justify={"space-between"} direction={"column"} pt={10}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            รูปภาพตัวอย่าง
          </label>
          {selectedImage && <Image w={150} src={selectedImage} mb={10} />}
          <Group justify={"flex-start"}>
            <FileButton
              fw={400}
              resetRef={resetRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button variant="light" color="violet" {...props}>
                  เลือกรูปภาพ
                </Button>
              )}
            </FileButton>
            <Button
              variant="subtle"
              fw={400}
              disabled={!File}
              color="red"
              onClick={clearFile}
            >
              รีเซ็ต
            </Button>
          </Group>
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

export default FormAddItems;
