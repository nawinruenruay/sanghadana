import {
  Button,
  Flex,
  TextInput,
  SimpleGrid,
  Select,
  Group,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconAlertCircle } from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Api } from "../../Api";
import { Notifications } from "@mantine/notifications";
import { useUser } from "../../components/UserContext";

interface AddItemsProps {
  closeWithSuccess: () => void;
  close: () => void;
}

interface Items {
  value: string;
  label: string;
}

// อีเมล
export function AddEmail({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const { FetchUser } = useUser();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "กรุณากรอกอีเมลที่ถูกต้อง",
    },
  });

  const FetchData = async () => {
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        form.setValues({
          email: userData.email,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "user/index/3", {
        userid: atob(id),
        email: v.email,
        typeadd: "email",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          closeWithSuccess();
        }
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <TextInput
          label="อีเมล (ที่ใช้งานได้จริง)"
          placeholder="กรอกอีเมล"
          {...form.getInputProps("email")}
          withAsterisk
        />
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

// หมายเลขโทรศัพท์
export function Addphone({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const { FetchUser } = useUser();

  const form = useForm({
    initialValues: {
      phone: "",
    },
    validate: {
      phone: (value: any) => {
        const isNumeric = /^\d+$/.test(value);
        if (!isNumeric) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        } else if (value.length < 10) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        } else if (value.length > 10) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        }
        return null;
      },
    },
  });

  const FetchData = async () => {
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        form.setValues({
          phone: userData.phone,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "user/index/3", {
        userid: atob(id),
        phone: v.phone,
        typeadd: "phone",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          closeWithSuccess();
        }
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <TextInput
          label="หมายเลขโทรศัพท์"
          placeholder="กรอกหมายเลขโทรศัพท์"
          {...form.getInputProps("phone")}
          withAsterisk
        />
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

// วันเกิด
export function AddBirthday({ closeWithSuccess, close }: AddItemsProps) {
  const { FetchUser } = useUser();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [Day, setDay] = useState<any[]>([]);
  const [Month, setMonth] = useState<any[]>([]);
  const [Year, setYear] = useState<any[]>([]);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const [BD_day, setBD_day] = useState<any>("");
  const [BD_month, setBD_month] = useState<any>("");
  const [BD_year, setBD_year] = useState<any>("");

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
  };

  const FetchData = async () => {
    try {
      const data = await FetchUser(id);
      if (data.status === 200) {
        const userData = data.data.data[0];
        const b = userData.birthday;
        setBD_day(b.split("-")[2]);
        const bm1 = b.split("-")[1].split(0)[1];
        const bm2 = b.split("-")[1].split(0)[0];
        setBD_month(bm1 !== undefined ? bm1 : bm2);
        setBD_year((parseInt(b.split("-")[0]) + 543).toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Submit = () => {
    setLoadingSubmit(true);
    if (!BD_day || !BD_month || !BD_year) {
      Notifications.show({
        title: "เพิ่มวันเกิดไม่สำเร็จ",
        message: "กรุณาเลือกวันเกิดที่ถูกต้อง",
        autoClose: 2000,
        color: "red",
        icon: <IconAlertCircle />,
      });
      setLoadingSubmit(false);
      return;
    } else {
      axios
        .post(Api + "user/index/3", {
          userid: atob(id),
          birthday: BD_year - 543 + "-" + BD_month + "-" + BD_day,
          typeadd: "birthday",
        })
        .then((res) => {
          if (res.data === 200) {
            setLoadingSubmit(false);
            closeWithSuccess();
          }
        });
    }
  };

  useEffect(() => {
    FetchDate();
    FetchData();
  }, []);

  return (
    <>
      <SimpleGrid cols={3}>
        <Select
          allowDeselect={false}
          onChange={setBD_day}
          value={BD_day}
          label="วัน"
          data={Day}
          searchable
          clearable
        />
        <Select
          allowDeselect={false}
          label="เดือน"
          onChange={setBD_month}
          value={BD_month}
          data={Month}
          searchable
          clearable
        />
        <Select
          allowDeselect={false}
          label="ปี"
          onChange={setBD_year}
          value={BD_year}
          data={Year}
          searchable
          clearable
        />
      </SimpleGrid>
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
          onClick={Submit}
          fw={400}
          color="green"
          leftSection={<IconDeviceFloppy />}
        >
          บันทึก
        </Button>
      </Flex>
    </>
  );
}

// ที่อยู่
export function AddAddress({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const [Province, setProvince] = useState<Items[]>([]);
  const [Amphure, setAmphure] = useState<Items[]>([]);
  const [Tambon, setTambon] = useState<Items[]>([]);
  const [Zipcode, setZipcode] = useState<Items[]>([]);

  const form = useForm({
    initialValues: {
      address: "",
      ad_name: "",
      ad_phone: "",
      ad_province: "",
      ad_amphure: "",
      ad_tambon: "",
      zip_code: "",
    },
    validate: {
      address: (v) =>
        v.length < 10 ? "บ้านเลขที่,ซอย,หมู่,ถนน,แขวง/ตำบล" : null,
      ad_name: (v) => (v.length < 6 ? "กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง" : null),
      ad_phone: (v) => {
        const isNumeric = /^\d+$/.test(v);
        if (!isNumeric || v.length !== 10) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        }
        return null;
      },
      ad_province: (v) => (v.length < 1 ? "กรุณาเลือกจังหวัด" : null),
      ad_amphure: (v) => (v.length < 1 ? "กรุณาเลือกอำเภอ" : null),
      ad_tambon: (v) => (v.length < 1 ? "กรุณาเลือกตำบล" : null),
      zip_code: (v) => (v.length < 1 ? "กรุณาเลือกรหัสไปรษณีย์" : null),
    },
  });

  //จังหวัด
  const FetchProvince = () => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data.map((i: any) => ({
            value: i.id.toString(),
            label: i.name_th,
          }));
          setProvince(data);
        }
      });
  };

  // อำเภอ
  const FetchAmphure = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.province_id.toString() === v)
            .map((i: any) => ({
              value: i.id.toString(),
              label: i.name_th,
            }));
          setAmphure(data);
        }
      });
  };

  //ตำบล
  const FetchTambon = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.amphure_id.toString() === v)
            .map((i: any) => ({
              value: i.id.toString(),
              label: i.name_th,
            }));
          setTambon(data);
        }
      });
  };

  // รหัสไปรษณีย์
  const Fetchzipcode = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.id.toString() === v)
            .map((i: any) => ({
              value: i.zip_code.toString(),
              label: i.zip_code.toString(),
            }));
          setZipcode(data);
        }
      });
  };

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    const selectedProvince =
      Province.find((i) => i.value === v.ad_province)?.label || "";
    const selectedAmphure =
      Amphure.find((i) => i.value === v.ad_amphure)?.label || "";
    const selectedTambon =
      Tambon.find((i) => i.value === v.ad_tambon)?.label || "";
    axios
      .post(Api + "user/index/3", {
        userid: atob(id),
        address: v.address,
        ad_name: v.ad_name,
        ad_phone: v.ad_phone,
        ad_province: selectedProvince,
        ad_amphure: selectedAmphure,
        ad_tambon: selectedTambon,
        zip_code: v.zip_code,
        typeadd: "address",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          closeWithSuccess();
        }
      });
  };

  useEffect(() => {
    FetchProvince();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <Flex gap={5}>
          <TextInput
            label="ชื่อ-นามสกุล"
            withAsterisk
            placeholder="ชื่อ-นามสกุล"
            w={"100%"}
            {...form.getInputProps("ad_name")}
          />
          <TextInput
            label="หมายเลขโทรศัพท์"
            withAsterisk
            placeholder="หมายเลขโทรศัพท์"
            w={"100%"}
            {...form.getInputProps("ad_phone")}
          />
        </Flex>
        <Group gap={5}>
          <Select
            clearable
            withAsterisk
            allowDeselect={false}
            data={Province}
            {...form.getInputProps("ad_province")}
            placeholder="จังหวัด"
            label="จังหวัด"
            onChange={(v) => {
              if (v) {
                form.setFieldValue("ad_province", v);
                FetchAmphure(v);
              }
            }}
            searchable
          />
          <Select
            clearable
            withAsterisk
            allowDeselect={false}
            data={Amphure}
            {...form.getInputProps("ad_amphure")}
            onChange={(v) => {
              if (v) {
                form.setFieldValue("ad_amphure", v);
                FetchTambon(v);
                Fetchzipcode(v);
              }
            }}
            label="เขต/อำเภอ"
            placeholder="เขต/อำเภอ"
            searchable
          />
          <Select
            clearable
            withAsterisk
            allowDeselect={false}
            data={Tambon}
            {...form.getInputProps("ad_tambon")}
            onChange={(v) => {
              if (v) {
                form.setFieldValue("ad_tambon", v);
                Fetchzipcode(v);
              }
            }}
            label="แขวง/ตำบล"
            placeholder="แขวง/ตำบล"
            searchable
          />
          <Select
            clearable
            withAsterisk
            allowDeselect={false}
            data={Zipcode}
            {...form.getInputProps("zip_code")}
            placeholder="รหัสไปรษณีย์"
            label="รหัสไปรษณีย์"
            searchable
          />
        </Group>
        <Textarea
          label="บ้านเลขที่,ซอย,หมู่,ถนน,แขวง/ตำบล"
          placeholder="บ้านเลขที่,ซอย,หมู่,ถนน,แขวง/ตำบล"
          withAsterisk
          maxRows={3}
          rows={3}
          {...form.getInputProps("address")}
        />

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
