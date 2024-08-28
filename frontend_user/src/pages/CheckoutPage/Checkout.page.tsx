import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";

import {
  Text,
  Flex,
  Button,
  Image,
  Select,
  SimpleGrid,
  FileButton,
  Grid,
  Paper,
  Center,
  Skeleton,
  // Textarea,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { IconCash, IconCheck, IconExclamationMark } from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import { useNavigate, useLocation } from "react-router-dom";

type FormValues = {
  img: string;
  img_file: File | null;
  img_preview: any | ArrayBuffer | null;
};

export function CheckoutPage() {
  const nav = useNavigate();
  const location = useLocation();
  useDocumentTitle("ชำระเงิน | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const order_id = location.state?.order_id;

  const [Loadingdata, setLoadingdata] = useState(false);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const [Day, setDay] = useState<any[]>([]);
  const [Month, setMonth] = useState<any[]>([]);
  const [Year, setYear] = useState<any[]>([]);
  const [Hour, setHour] = useState<any[]>([]);
  const [Minute, setMinute] = useState<any[]>([]);
  const [Data, setData] = useState<any[]>([]);
  const totalAmount = Data.reduce((sum: any, i: any) => sum + i.total, 0);

  const [DaySelect, setDaySelect] = useState<any>("");
  const [MonthSelect, setMonthSelect] = useState<any>("");
  const [YearSelect, setYearSelect] = useState<any>("");
  const [HourSelect, setHourSelect] = useState<any>("");
  const [MinuteSelect, setMinuteSelect] = useState<any>("");

  const form = useForm<FormValues>({
    initialValues: {
      img: "",
      img_file: null,
      img_preview: null,
    },
    validate: {},
  });

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
    for (let k = 0; k < 60; k++) {
      year.push({
        value: (yearNow - k).toString(),
        label: (yearNow - k).toString(),
      });
    }
    setYear(year);

    // ชั่วโมง
    const hour = [];
    for (let h = 0; h < 24; h++) {
      let v = h < 10 ? "0" + h : h.toString();
      hour.push({
        value: v,
        label: v,
      });
    }
    setHour(hour);

    // นาที
    const minute = [];
    for (let m = 0; m < 60; m++) {
      let v = m < 10 ? "0" + m : m.toString();
      minute.push({
        value: v,
        label: v,
      });
    }
    setMinute(minute);
  };

  const Fetchdata = () => {
    setLoadingdata(true);
    axios
      .post(Api + "user/index/2", {
        userid: atob(id),
        order_id: order_id,
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          setData(data);
        }
        setLoadingdata(false);
      });
  };

  const handleFileChange = (files: any) => {
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

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    if (
      v.img_file &&
      order_id &&
      YearSelect &&
      MonthSelect &&
      DaySelect &&
      HourSelect &&
      MinuteSelect
    ) {
      setLoadingSubmit(false);
      const Update = new FormData();
      Update.append("order_id", order_id);
      Update.append("file", v.img_file);
      Update.append("typeimg", "update");
      axios.post(Api + "buy/index/3", Update).then(() => {
        axios
          .post(Api + "buy/index/2", {
            order_id: order_id,
            pay_date: YearSelect - 543 + "-" + MonthSelect + "-" + DaySelect,
            pay_time: HourSelect + ":" + MinuteSelect,
            pay_total: totalAmount,
            typeadd: "checkout",
          })
          .then((res) => {
            if (res.data === 200) {
              setLoadingSubmit(false);
              Notifications.show({
                title: "ชำระเงินสำเร็จ",
                message: "คุณได้ชำระเงินเรียบร้อยแล้ว",
                autoClose: 2000,
                color: "green",
                icon: <IconCheck />,
              });
              nav("/user/account/?v=purchase");
            }
          });
      });
    } else {
      setLoadingSubmit(false);
      Notifications.show({
        title: "ชำระเงินไม่สำเร็จ",
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        autoClose: 2000,
        color: "red",
        icon: <IconExclamationMark />,
      });
    }
  };

  useEffect(() => {
    if (id && order_id) {
    } else {
      nav("/login");
    }
    Fetchdata();
    FetchDate();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {Loadingdata === true ? (
        <>
          <Paper radius={8} shadow="sm" p={10}>
            <Skeleton w={"100%"} h={450} />
          </Paper>
        </>
      ) : (
        <>
          <form
            onSubmit={form.onSubmit((v) => {
              Submit(v);
            })}
          >
            <Paper radius={5} shadow="sm" p={15} mb={50} pos={"relative"}>
              <Grid gutter={20} justify="center" align="center">
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Flex justify="center" direction="column" wrap="wrap">
                    <Center>
                      <Image
                        src={
                          "https://i.pinimg.com/564x/c6/ad/81/c6ad815f01a76c92634b751bd67db271.jpg"
                        }
                      />
                    </Center>
                  </Flex>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Text fz={"h4"} fw={"bold"}>
                    เลขที่การสั่งซื้อ : {order_id}
                  </Text>
                  <Text fz={"h4"}>
                    ยอดเงินที่ต้องชำระ {totalAmount.toLocaleString()} บาท
                  </Text>
                  <Center mt={10}>
                    <Image
                      src={
                        form.values.img_preview === null
                          ? Api + "/public/uploadimg/noimage.png"
                          : form.values.img_preview
                      }
                      w={220}
                      h={220}
                      mb={10}
                    />
                  </Center>
                  <FileButton
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                  >
                    {(props) => (
                      <Button variant="outline" {...props} w={"100%"}>
                        แนบหลักฐานการโอนเงิน
                      </Button>
                    )}
                  </FileButton>
                  <Text c={"#999999"} fz={"14px"}>
                    ขนาดไฟล์: สูงสุด 1 MB ไฟล์ที่รองรับ: JPEG,JPG,PNG
                  </Text>
                  {/* <Textarea
                    label="Input label"
                    placeholder="Input placeholder"
                    withAsterisk
                  /> */}
                  <SimpleGrid cols={3}>
                    <Select
                      allowDeselect={false}
                      label="วัน"
                      data={Day}
                      onChange={setDaySelect}
                      value={DaySelect}
                      searchable
                      clearable
                      withAsterisk
                    />
                    <Select
                      allowDeselect={false}
                      label="เดือน"
                      data={Month}
                      onChange={setMonthSelect}
                      value={MonthSelect}
                      searchable
                      clearable
                      withAsterisk
                    />
                    <Select
                      allowDeselect={false}
                      label="ปี"
                      data={Year}
                      onChange={setYearSelect}
                      value={YearSelect}
                      searchable
                      clearable
                      withAsterisk
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={2}>
                    <Select
                      allowDeselect={false}
                      label="ชั่วโมง"
                      data={Hour}
                      onChange={setHourSelect}
                      value={HourSelect}
                      searchable
                      clearable
                      withAsterisk
                    />
                    <Select
                      allowDeselect={false}
                      label="นาที"
                      data={Minute}
                      onChange={setMinuteSelect}
                      value={MinuteSelect}
                      searchable
                      clearable
                      withAsterisk
                    />
                  </SimpleGrid>

                  <Flex pt={10} justify={"flex-start"} gap={5} pos={"relative"}>
                    <Button
                      loading={LoadingSubmit}
                      loaderProps={{ type: "dots" }}
                      fw={400}
                      color="green"
                      type="submit"
                      leftSection={<IconCash />}
                      w={"100%"}
                    >
                      ชำระเงิน
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>
            </Paper>
          </form>
        </>
      )}
    </>
  );
}
