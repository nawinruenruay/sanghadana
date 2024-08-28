import {
  Button,
  Divider,
  FileButton,
  Flex,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TT from "../../Api";
import { useForm } from "@mantine/form";
import { IconCamera } from "@tabler/icons-react";
import Swal from "sweetalert2";

function UpdateItems({ close }) {
  const pid = localStorage.getItem("pid");
  const form = useForm({
    initialValues: {
      img: "",
      img_file: null,
      img_preview: null,
    },
    validate: {},
  });

  const handleFileChange = (files) => {
    form.setValues({
      img_file: null,
      img_preview: null,
    });
    if (files) {
      form.setValues({
        img_file: files,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        // setSelectedImage(reader.result);
        form.setValues({
          img_preview: reader.result,
        });
      };
      reader.readAsDataURL(files);
    }
  };

  const ShowIMG = () => {
    axios
      .post(TT + "Product/ShowIMG", {
        pid: pid,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.length !== 0) {
          form.setValues({
            img: res.data[0].img,
          });
        }
      });
  };

  useEffect(() => {
    ShowIMG();
  }, []);

  const SaveUpdate = (val) => {
    setLoadingBUUU(true);
    if (val.img_file !== null) {
      const Update = new FormData(); //สร้างฟอร์มสำหรับการส่งข้อมูล
      Update.append("pid", pid);
      Update.append("file", val.img_file);
      Update.append("typeimg", "update");
      axios.post(TT + "Product/UploadIMG", Update).then((res) => {
        setLoadingBUUU(false);
        Swal.fire({
          icon: "success",
          title: "อัพเดทรูปภาพเรียบร้อย",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then((ress) => {
          close();
        });
      });
    } else {
      axios
        .post(TT + "Product/UploadIMG", {
          pid: pid,
          file: val.img,
          typeimg: "update",
        })
        .then((res) => {
          setLoadingBUUU(false);
          Swal.fire({
            icon: "success",
            title: "อัพเดทรูปภาพเรียบร้อย",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then((ress) => {
            close();
          });
        });
    }
  };

  const [LoadingBUUU, setLoadingBUUU] = useState(false);
  return (
    <>
      <form
        onSubmit={form.onSubmit((value) => {
          SaveUpdate(value);
        })}
      >
        <Flex justify={"center"} align={"center"} direction={"column"}>
          <Paper maw={250}>
            <Image
              src={
                form.values.img_preview === null
                  ? TT + form.values.img
                  : form.values.img_preview
              }
            />
          </Paper>
          <Group justify="center">
            <FileButton
              fw={400}
              // resetRef={resetRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button
                  color="violet"
                  variant="outline"
                  w={150}
                  mt={5}
                  {...props}
                >
                  <IconCamera />
                </Button>
              )}
            </FileButton>
          </Group>
        </Flex>
        <Divider my="sm" variant="dashed" />
        <Flex justify={"flex-end"} pt={10} gap={10}>
          <Button onClick={close} color="red" variant="subtle">
            ยกเลิก
          </Button>
          <Button
            loading={LoadingBUUU}
            loaderProps={{ type: "dots" }}
            type="submit"
            color="green"
            variant="filled"
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default UpdateItems;
