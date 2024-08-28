import axios from "axios";
import TT from "../../Api";
import { useEffect, useState } from "react";
import { Flex, Text, Paper, Skeleton } from "@mantine/core";

import { MDBDataTableV5 } from "mdbreact";

function DetailItems() {
  const [LoadingTable, setLoadingTable] = useState(false);
  const [TotalPrice, setTotalPrice] = useState(0);

  const column = [
    {
      label: "#",
      field: "num",
    },
    {
      label: "รายการ",
      field: "pname",
    },
    {
      label: "จำนวน",
      field: "qty",
    },
    {
      label: "ราคา (บาท)",
      field: "price",
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
    axios
      .post(TT + "Order/OrderDetail", {
        order_id: localStorage.getItem("order_id"),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          const totalPrice = data.reduce((acc, curr) => acc + curr.total, 0);
          setTotalPrice(totalPrice);
          setData({
            columns: column,
            rows: [
              ...data.map((i, key) => ({
                num: key + 1,
                pname: i.pname,
                qty: i.qty,
                price: i.total.toLocaleString() + " บาท",
              })),
            ],
          });
        }
        setLoadingTable(false);
      });
  };

  return (
    <>
      <Paper
        mt={"sm"}
        bg={"white"}
        radius={8}
        shadow="sm"
        p={10}
        style={{ borderRadius: "8px" }}
      >
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
              searchTop={false}
              searchBottom={false}
              data={Data}
              entries={3}
              entriesOptions={[3, 5, 10, 20]}
              entriesLabel="จำนวนรายการ"
            />
          </>
        )}
        <Text
          size="xl"
          fw={900}
          variant="gradient"
          gradient={{ from: "gray", to: "rgba(10, 10, 10, 1)", deg: 200 }}
        >
          ราคารวมทั้งหมด : {TotalPrice.toLocaleString()} บาท
        </Text>
      </Paper>
    </>
  );
}

export default DetailItems;
