import { useEffect, useState } from "react";
import { DatePicker, notification } from "antd";
import dayjs from "dayjs";
import { Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PowerIcon from "@mui/icons-material/Power";
import { getCookstoveData } from "../api/cookstove_data";

const { RangePicker } = DatePicker;

const today = dayjs();
const threemonthsago = dayjs().subtract(3, "month");

const items = [
  {
    id: 1,
    icon: <RestaurantMenuIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative food mass",
    key: "sumFoodMass",
    symbol: "kg",
  },
  {
    id: 2,
    icon: <WhatshotIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative fuel mass",
    key: "sumFuelMass",
    symbol: "kg",
  },
  {
    id: 3,
    icon: <ElectricMeterIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative stove energy consumption",
    key: "sumEnergyConsumption",
    symbol: "kWh",
  },
  {
    id: 4,
    icon: <ElectricMeterIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative useful stove energy consumption",
    key: "sumUsefulEnergy",
    symbol: "kWh",
  },
  {
    id: 5,
    icon: <AccessTimeIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative cooking duration",
    key: "sumDuration",
    symbol: "h",
  },
  {
    id: 6,
    icon: <EnergySavingsLeafIcon sx={{ fontSize: "6em" }} />,
    title: "Cumulative energy savings",
    key: "sumEnergySavings",
    symbol: "kWh",
  },
  {
    id: 7,
    icon: <DeviceThermostatIcon sx={{ fontSize: "6em" }} />,
    title: "Maximum temperature",
    key: "maxTemperature",
    symbol: "°C",
  },
  {
    id: 8,
    icon: <DeviceThermostatIcon sx={{ fontSize: "6em" }} />,
    title: "Average temperature",
    key: "avgTemperature",
    symbol: "°C",
  },
  {
    id: 9,
    icon: <ElectricMeterIcon sx={{ fontSize: "6em" }} />,
    title: "Average stove energy consumption per cooking event",
    key: "avgEnergyConsumption",
    symbol: "kWh",
  },
  {
    id: 10,
    icon: <ElectricMeterIcon sx={{ fontSize: "6em" }} />,
    title: "Average useful stove energy per cooking event",
    key: "avgUsefulEnergy",
    symbol: "kWh",
  },
  {
    id: 11,
    icon: <PowerIcon sx={{ fontSize: "6em" }} />,
    title: "Average stove power per cooking event",
    key: "avgPower",
    symbol: "kW",
  },
];

const Item = ({ icon, loading, symbol, title, value }) => (
  <Grid item xs={12} md={6}>
    <Card sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        {icon}
        <div>
          {loading ? (
            <Skeleton />
          ) : (
            <Typography variant="h4">
              {value} {symbol}
            </Typography>
          )}
          <Typography ml={1 / 2} variant="h6" color="gray">
            {title}
          </Typography>
        </div>
      </Stack>
    </Card>
  </Grid>
);

export default function CookstoveData({ deviceId }) {
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([
    dayjs(threemonthsago).format("YYYY-MM-DD"),
    dayjs(today).format("YYYY-MM-DD"),
  ]);
  const [data, setData] = useState(items);

  useEffect(() => {
    const fetchCookstoveData = async () => {
      try {
        setLoading(true);
        let query = `?startDate=${dates[0]}&endDate=${dates[1]}`;
        if (deviceId) query = `${query}&deviceId=${deviceId}`;
        const { data } = await getCookstoveData(query);
        setData((state) =>
          state.map((item) => {
            if (item.key === "sumDuration") item.value = data[item.key] / 3600;
            else item.value = data[item.key];
            // set precision to 2 decimal places
            item.value = Math.round(item.value * 100) / 100;
            return item;
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchCookstoveData();
  }, [dates]);

  return (
    <>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center">
          <RangePicker
            defaultValue={[threemonthsago, today]}
            allowClear={false}
            value={[dayjs(dates[0]), dayjs(dates[1])]}
            onChange={(dates, dateStrings) => {
              setDates(dateStrings);
            }}
          />
        </Stack>
      </Grid>
      {data.map((item) => (
        <Item
          key={item.id}
          icon={item.icon}
          loading={loading}
          symbol={item.symbol}
          title={item.title}
          value={item.value}
        />
      ))}
    </>
  );
}
