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

function FormAddItems({ close }) {
  //// if not img ===  public/uploadimg/Defualt/noimage.png
  const resetRef = useRef();
  const form = useForm({
    initialValues: {
      ptid: "",
      pname: "",
      qty: "",
      price: "",
      img: null,
    },
    validate: {
      ptid: (val) => (val.length === 0 ? "กรุณาเลือกประเภทสินค้า" : null),
      pname: (val) => (val.length < 1 ? "กรุณาเพิ่มชื่อสินค้า" : null),
      price: (val) => (val.length < 1 ? "กรุณาเพิ่มราคาสินค้า" : null),
      qty: (val) => (val.length < 1 ? "กรุณาเพิ่มจำนวนสินค้า" : null),
      // img: (val) => (val === null ? "กรุณาเพิ่มรูปภาพสินค้า" : null),
    },
  });

  const [Type, setType] = useState([]);
  const [File, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
  );

  const FetchType = () => {
    axios.get(TT + "Product/ShowTypeProduct").then((res) => {
      if (res.data.length !== 0) {
        const data = res.data.map((i) => ({
          value: i.ptid,
          label: i.ptname,
        }));
        setType(data);
      }
    });
  };

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
    // FetchFisicalYear();
    // FetchStatus();
    FetchType();
    // FetchDate();
    // FetchAgen();
    // FetchMoney();
    // FetchRoom();
  }, []);

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (val) => {
    setLoadingSubmit(true);
    console.log(val);

    if (val.img === null) {
      Notifications.show({
        title: "กรุณาเพิ่มรูปภาพสินค้า",
        autoClose: 1500,
        color: "red",
      });
      setLoadingSubmit(false);
      return;
    }
    // if (val.img === null) {
    //   const imggg = "public/uploadimg/noimage.png";
    //   axios
    //     .post(TT + "Product/AddProduct", {
    //       // pid: val.pid,
    //       pname: val.pname,
    //       ptid: val.ptid,
    //       qty: val.qty,
    //       price: val.price,
    //       img: imggg,
    //     })
    //     .then((add) => {
    //       if (add.data === "ok") {
    //         setLoadingSubmit(false);
    //         Swal.fire({
    //           icon: "success",
    //           title: "เพิ่มสินค้าเรียบร้อย",
    //           timer: 1500,
    //           timerProgressBar: true,
    //           allowOutsideClick: false,
    //           showConfirmButton: false,
    //         }).then((reees) => {
    //           close();
    //         });
    //       }
    //     });
    // } else {

    const Update = new FormData(); //สร้างฟอร์มสำหรับการส่งข้อมูล
    Update.append("file", val.img);
    Update.append("typeimg", "add");
    // Update.append("name", val.pid);

    axios.post(TT + "Product/UploadIMG", Update).then((res) => {
      // const imgpath = res.data[0].data;
      axios
        .post(TT + "Product/AddProduct", {
          pname: val.pname,
          ptid: val.ptid,
          qty: val.qty,
          price: val.price,
          // img: imgpath,
        })
        .then((add) => {
          if (add.data === "ok") {
            setLoadingSubmit(false);
            Swal.fire({
              icon: "success",
              title: "เพิ่มสินค้าเรียบร้อย",
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
    // }
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
        <Select
          clearable
          withAsterisk
          allowDeselect={false}
          data={Type}
          {...form.getInputProps("ptid")}
          label="ประเภทสินค้า"
          placeholder="เลือกประเภทสินค้า"
        />
        <TextInput
          withAsterisk
          {...form.getInputProps("pname")}
          label="ชื่อสินค้า"
          placeholder="กรอกชื่อสินค้า"
        />
        <NumberInput
          withAsterisk
          {...form.getInputProps("price")}
          label="ราคาสินค้า"
          placeholder="กรอกราคาสินค้า"
        />
        <NumberInput
          withAsterisk
          {...form.getInputProps("qty")}
          label="จำนวนสินค้า"
          placeholder="กรอกจำนวนสินค้า"
        />
        <Flex mah={300} justify={"space-between"} direction={"column"} pt={10}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            รูปภาพสินค้า
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
          </Button>{" "}
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
