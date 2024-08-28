import React, { useEffect, useState } from "react";
import {
  Flex,
  Paper,
  Skeleton,
  Container,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import axios from "axios";
import { MDBDataTableV5 } from "mdbreact";

import TT from "../../Api";

function UserPage() {
  const [OverLayLoad, setOverLayLoad] = useState(false);
  const [LoadingTable, setLoadingTable] = useState(false);

  const column = [
    {
      label: "#",
      field: "num",
    },
    {
      label: "ชื่อ-นามสกุล",
      field: "name",
    },
    {
      label: "อีเมล",
      field: "email",
    },
    {
      label: "หมายเลขโทรศัพท์",
      field: "phone",
    },
    {
      label: "ที่อยู่",
      field: "address",
    },
    {
      label: "ตำบล",
      field: "ad_tambon",
    },
    {
      label: "อำเภอ",
      field: "ad_amphure",
    },
    {
      label: "จังหวัด",
      field: "ad_province",
    },
    {
      label: "รหัสไปรษณีย์",
      field: "zip_code",
    },
  ];

  const [Data, setData] = useState({
    columns: column,
    rows: [],
  });

  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = () => {
    setLoadingTable(true);
    axios.get(TT + "user/index").then((res) => {
      const data = res.data.data.data;
      if (data.length !== 0) {
        setData({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              num: key + 1,
              name: i.name,
              email: i.email,
              phone: i.phone,
              address: i.address,
              ad_tambon: i.ad_tambon,
              ad_amphure: i.ad_amphure,
              ad_province: i.ad_province,
              zip_code: i.zip_code,
            })),
          ],
        });
      }
      setLoadingTable(false);
    });
  };

  return (
    <>
      <Container pt={10} fluid p={{ base: "0px", sm: 10, md: 20, lg: 30 }}>
        <Flex justify={"space-between"} align={"center"} py={5}>
          <Text c={"var(--main-text)"} fz={18} fw={500}>
            รายชื่อผู้ใช้ทั้งหมด
          </Text>
        </Flex>
        <Paper
          mt={"sm"}
          bg={"white"}
          radius={8}
          shadow="sm"
          style={{ borderRadius: "8px" }}
        >
          <LoadingOverlay
            loaderProps={{ type: "dots" }}
            visible={OverLayLoad}
          />
          {LoadingTable === true ? (
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={20} />
              <Skeleton w={"60%"} h={10} />
              <Skeleton w={"50%"} h={10} />
              <Skeleton w={"30%"} h={10} />
            </Flex>
          ) : (
            <>
              <MDBDataTableV5
                barReverse={true}
                responsive
                searchLabel="ค้นหา..."
                searchTop={true}
                searchBottom={false}
                data={Data}
                noRecordsFoundLabel="ไม่พบรายการ"
                entries={3}
                entriesOptions={[3, 5, 10, 20, 25, 50, 100]}
                infoLabel={["แสดงรายการที่", "ถึง", "จาก", "รายการ"]}
                entriesLabel="จำนวนรายการ"
              />
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default UserPage;
