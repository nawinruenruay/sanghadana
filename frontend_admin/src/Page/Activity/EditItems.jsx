import {
  Button,
  Flex,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";

function EditItems({ close, closeWithSuccess }) {
  const act_id = localStorage.getItem("act_id");

  const [Day, setDay] = useState([]);
  const [Month, setMonth] = useState([]);
  const [Year, setYear] = useState([]);

  const [Day2, setDay2] = useState("1");
  const [Month2, setMonth2] = useState("1");
  const [Year2, setYear2] = useState(
    (new Date().getFullYear() + 543).toString()
  );

  const FetchDate = () => {
    ///วันที่///
    // const day = [];
    // for (let i = 1; i <= 31; i++) {
    //   day.push({
    //     value: i.toString(),
    //     label: i.toString(),
    //   });
    // }
    // setDay(day);

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

  const form = useForm({
    initialValues: {
      act_name: "",
      act_detail: "",
      act_date: "",
      img: null,
    },
    validate: {
      act_name: (val) => (val.length < 1 ? "กรุณาเพิ่มชื่อกิจกรรม" : null),
      act_detail: (val) =>
        val.length < 1 ? "กรุณาเพิ่มรายละเอียดกิจกรรม" : null,
    },
  });

  const FetchDetailEdit = () => {
    axios
      .post(TT + "Activity/ShowDetailEdit", {
        act_id: act_id,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data[0];
          const b = data.act_date;
          setDay2(b.split("-")[2]);
          const bm1 = b.split("-")[1].split(0)[1];
          const bm2 = b.split("-")[1].split(0)[0];
          setMonth2(bm1 !== undefined ? bm1 : bm2);
          setYear2((parseInt(b.split("-")[0]) + 543).toString());
          form.setValues({
            act_name: data.act_name,
            act_detail: data.act_detail,
          });
        }
      });
  };

  useEffect(() => {
    FetchDate();
    FetchDetailEdit();
  }, []);

  const [LoadingOnUpdate, setLoadingOnUpdate] = useState(false);
  const SaveEdit = (val) => {
    setLoadingOnUpdate(true);
    axios
      .post(TT + "Activity/SaveEdit", {
        act_id: act_id,
        act_name: val.act_name,
        act_detail: val.act_detail,
        act_date: Year2 - 543 + "-" + Month2 + "-" + Day2,
      })
      .then(() => {
        setLoadingOnUpdate(false);
        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลกิจกรรมเรียบร้อย",
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
          rows={10}
        />
        <SimpleGrid cols={3}>
          <Select
            allowDeselect={false}
            value={Day2}
            onChange={setDay2}
            label="วัน"
            data={Day}
            // searchable
          />
          <Select
            allowDeselect={false}
            label="เดือน"
            value={Month2}
            onChange={setMonth2}
            data={Month}
            // searchable
          />
          <Select
            allowDeselect={false}
            label="ปี"
            onChange={setYear2}
            value={Year2}
            data={Year}
            // searchable
          />
        </SimpleGrid>
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
