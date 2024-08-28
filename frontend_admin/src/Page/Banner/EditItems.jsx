import {
  Button,
  Flex,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Paper,
  Image,
  Radio,
  Group,
  CheckIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";

function EditItems({ close, closeWithSuccess }) {
  const [LoadingOnUpdate, setLoadingOnUpdate] = useState(false);
  const banner_id = localStorage.getItem("banner_id");

  //   const resetRef = useRef();
  const form = useForm({
    initialValues: {
      banner_status: "",
      img: null,
    },
    validate: {},
  });

  const FetchDetailEdit = () => {
    axios
      .post(TT + "Banner/ShowDetailEdit", {
        banner_id: banner_id,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data[0];
          form.setValues({
            img: data.banner_pic,
            banner_status: data.banner_status,
          });
        }
      });
  };

  useEffect(() => {
    FetchDetailEdit();
  }, []);

  const SaveEdit = (val) => {
    setLoadingOnUpdate(true);
    axios
      .post(TT + "Banner/SaveEdit", {
        banner_id: banner_id,
        banner_status: val.banner_status,
      })
      .then((res) => {
        setLoadingOnUpdate(false);
        Swal.fire({
          icon: "success",
          title: "แก้ไขสถานะแบนเนอร์เรียบร้อย",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then((ress) => {
          closeWithSuccess();
        });
      });
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((val) => {
          SaveEdit(val);
        })}
      >
        <Paper maw={"auto"}>
          <Image src={TT + form.values.img} />
        </Paper>
        <Radio.Group
          label="สถานะแบนเนอร์"
          value={form.values.banner_status}
          onChange={(value) => form.setValues({ banner_status: value })}
          withAsterisk
        >
          <Group mt="xs">
            <Radio value="T" icon={CheckIcon} label="แสดงแบนเนอร์" />
            <Radio value="F" icon={CheckIcon} label="ไม่แสดงแบนเนอร์" />
          </Group>
        </Radio.Group>
        <Flex justify={"flex-end"} gap={10} pt={10}>
          <Button
            variant="subtle"
            color="red"
            onClick={() => {
              close();
            }}
          >
            ยกเลิก
          </Button>
          <Button
            color="green"
            leftSection={<IconDeviceFloppy />}
            loading={LoadingOnUpdate}
            loaderProps={{ type: "dots" }}
            type="submit"
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default EditItems;
