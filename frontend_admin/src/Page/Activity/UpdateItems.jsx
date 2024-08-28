import {
  Button,
  Divider,
  FileButton,
  Flex,
  Group,
  Image,
  Paper,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TT from "../../Api";
import { useForm } from "@mantine/form";
import { IconCamera } from "@tabler/icons-react";
import Swal from "sweetalert2";
import moment from "moment";

function UpdateItems({ close }) {
  const act_id = localStorage.getItem("act_id");
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
        form.setValues({
          img_preview: reader.result,
        });
      };
      reader.readAsDataURL(files);
    }
  };

  const ShowIMG = () => {
    axios
      .post(TT + "Activity/ShowIMG", {
        act_id: act_id,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          form.setValues({
            img: res.data[0].act_pic,
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
      const currentTimestamp = moment().locale("th").format("DDMMYYHHmmss");
      const Update = new FormData();
      Update.append("act_id", act_id);
      Update.append("file", val.img_file);
      Update.append("typeimg", "update");
      Update.append("name", currentTimestamp);
      axios.post(TT + "Activity/UploadGallery", Update).then((res) => {
        setLoadingBUUU(false);
        Swal.fire({
          icon: "success",
          title: "อัพเดทรูปภาพเรียบร้อย",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          close();
        });
      });
    } else {
      axios
        .post(TT + "Activity/UploadGallery", {
          act_id: act_id,
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
          }).then(() => {
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
