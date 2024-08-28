import {
  Container,
  Flex,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Text,
  Group,
  Button,
} from "@mantine/core";
import {
  IconClock,
  IconDeviceAnalytics,
  IconListCheck,
  IconCash,
} from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mantine/charts";
import TT from "../../Api";

function Home() {
  const [Checkyear, setCheckyears] = useState("");
  const [CountData, setCountData] = useState([]);

  const FetchData = (params) => {
    // const now = new Date();
    // var year = "";
    // const monthNow = now.getUTCMonth() + 1;
    // if (monthNow > 9) {
    //   year = now.getFullYear() + 544;
    // } else {
    //   setCheckyears();
    //   year = now.getFullYear() + 543;
    // }
    axios.get(TT + "Device/CountInfo").then((res) => {
      const data = res.data;
      if (data.length !== 0) {
        setCountData(data);
      }
    });
  };

  //   const [DataBar, setDataBar] = useState([]);
  //   const FetchBar = (params) => {
  //     axios.get(BB + "Report/Bar").then((res) => {
  //       axios.get(BB + "Report/BarLabel").then((rerere) => {
  //         const dataatt = rerere.data;
  //         setBarLabel(dataatt);
  //         setDataBar(res.data);
  //       });
  //     });
  //   };

  //   const [BarLabel, setBarLabel] = useState([]);

  useEffect(() => {
    FetchData();
    // FetchBar();
  }, []);

  return (
    <>
      <Container fluid pt={0} p={{ base: "0px", sm: 10, md: 20, lg: 30 }}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 4 }} gap={10}>
          {Array.isArray(CountData) &&
            CountData.map((i, n) => (
              <Paper
                c={
                  n === 0
                    ? ""
                    : n === 1
                    ? "yellow"
                    : n === 2
                    ? "violet"
                    : "teal"
                }
                mih={90}
                p={15}
                shadow="sm"
                key={n}
              >
                <Text fw={500} fz={23}>
                  {i.label}
                </Text>
                <Flex align={"center"} justify={"space-between"}>
                  {n === 0 ? (
                    <IconDeviceAnalytics stroke={2} size={35} />
                  ) : n === 1 ? (
                    <IconClock stroke={2} size={35} />
                  ) : n === 2 ? (
                    <IconCash stroke={2} size={35} />
                  ) : (
                    <IconListCheck stroke={2} size={35} />
                  )}
                  <Text fz={35}>{i.value}</Text>
                </Flex>
              </Paper>
            ))}
        </SimpleGrid>
        {window.location.pathname === "/equipmentcheck/home" ? (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {/* {DataBar.map((i) => console.log(i))} */}
            {DataBar.map((i) => (
              <Paper key={i} mt={25} shadow="sm" p={10}>
                <BarChart
                  data={Array(i)}
                  // type="percent"
                  h={500}
                  withLegend
                  dataKey="subname"
                  // orientation={{base:'vertical',md:"vertical"}}
                  orientation="horizontal"
                  yAxisProps={{ domain: [0, 50] }}
                  unit=" รายการ"
                  strokeDasharray="10 10"
                  tooltipAnimationDuration={400}
                  series={BarLabel}
                />{" "}
              </Paper>
            ))}
            {/* <BarChart
                data={DataBar.slice(0, 1)}
                // type="percent"
                h={500}
                withLegend
                dataKey="subname"
                // orientation={{base:'vertical',md:"vertical"}}
                orientation="horizontal"
                yAxisProps={{ domain: [0, 50] }}
                unit=" รายการ"
                strokeDasharray="10 10"
                tooltipAnimationDuration={400}
                series={BarLabel}
              /> */}
          </SimpleGrid>
        ) : (
          ""
        )}
      </Container>
    </>
  );
}

export default Home;
