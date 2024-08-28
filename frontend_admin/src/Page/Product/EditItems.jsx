import { Button, Flex, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";

function EditItems({ close, closeWithSuccess }) {
  const [LoadingOnUpdate, setLoadingOnUpdate] = useState(false);
  const [Type, setType] = useState([]);
  const pid = localStorage.getItem("pid");

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
    },
  });

  const FetchDetailEdit = () => {
    axios
      .post(TT + "Product/ShowDetailEdit", {
        pid: pid,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.length !== 0) {
          const data = res.data[0];
          form.setValues({
            ptid: data.ptid,
            pname: data.pname,
            price: parseInt(data.price),
            qty: data.qty,
            // img: data.img,
          });
        }
      });
  };

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

  useEffect(() => {
    FetchType();
    FetchDetailEdit();
  }, []);

  const SaveEdit = (val) => {
    setLoadingOnUpdate(true);
    axios
      .post(TT + "Product/SaveEdit", {
        pid: pid,
        ptid: val.ptid,
        pname: val.pname,
        price: val.price,
        qty: val.qty,
      })
      .then((res) => {
        setLoadingOnUpdate(false);
        Swal.fire({
          icon: "success",
          title: "แก้ไขสินค้าเรียบร้อย",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
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
