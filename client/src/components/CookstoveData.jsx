import { useEffect, useState } from "react";
import { DatePicker, notification } from "antd";
import dayjs from "dayjs";
import { Card, Stack, Typography } from "@mui/material";
import { getCookstoveData } from "../api/cookstove_data";

const { RangePicker } = DatePicker;

const today = dayjs();
const threemonthsago = dayjs().subtract(3, "month");

const items = [
  {
    id: 1,
    icon: (
      <img src="https://img.icons8.com/ios/25/000000/food.png" alt="food" />
    ),
    title: "Cumulative food mass",
    key: "sumFoodMass",
    symbol: "kg",
  },
  {
    id: 2,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/gas-industry.png"
        alt="fuel"
      />
    ),
    title: "Cumulative fuel mass",
    key: "sumFuelMass",
    symbol: "kg",
  },
  {
    id: 3,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/energy-meter.png"
        alt="energy"
      />
    ),
    title: "Cumulative stove energy consumption",
    key: "sumEnergyConsumption",
    symbol: "kWh",
  },
  {
    id: 4,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/energy-meter.png"
        alt="energy"
      />
    ),
    title: "Cumulative useful stove energy consumption",
    key: "sumUsefulEnergy",
    symbol: "kWh",
  },
  {
    id: 5,
    icon: (
      <img src="https://img.icons8.com/ios/25/000000/clock.png" alt="clock" />
    ),
    title: "Cumulative cooking duration in hours",
    key: "sumDuration",
    symbol: "h",
  },
  {
    id: 6,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/flash-on.png"
        alt="energy saving"
      />
    ),
    title: "Cumulative energy savings",
    key: "sumEnergySavings",
    symbol: "kWh",
  },
  {
    id: 7,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/temperature.png"
        alt="temperature"
      />
    ),
    title: "Maximum temperature",
    key: "maxTemperature",
    symbol: "°C",
  },
  {
    id: 8,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/temperature.png"
        alt="temperature"
      />
    ),
    title: "Average temperature",
    key: "avgTemperature",
    symbol: "°C",
  },
  {
    id: 9,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/energy-meter.png"
        alt="energy"
      />
    ),
    title: "Average stove energy consumption per cooking event",
    key: "avgEnergyConsumption",
    symbol: "kWh",
  },
  {
    id: 10,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/energy-meter.png"
        alt="energy"
      />
    ),
    title: "Average useful stove energy per cooking event",
    key: "avgUsefulEnergy",
    symbol: "kWh",
  },
  {
    id: 11,
    icon: (
      <img
        src="https://img.icons8.com/ios/25/000000/energy-meter.png"
        alt="energy"
      />
    ),
    title: "Average stove power per cooking event",
    key: "avgPower",
    symbol: "kW",
  },
];

const Item = ({ icon, symbol, title, value }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Stack direction="row" alignItems="center">
      {icon}
      <Typography ml={1 / 2} variant="body1">
        {title}
      </Typography>
    </Stack>
    <Typography variant="body2">
      {value}
      {symbol}
    </Typography>
  </Stack>
);

export default function CookstoveData() {
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
        const { data } = await getCookstoveData(
          `?startDate=${dates[0]}&endDate=${dates[1]}`
        );
        setData((state) =>
          state.map((item) => {
            item.value = data[item.key];
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
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Cookstove Data</Typography>
        <RangePicker
          defaultValue={[threemonthsago, today]}
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(dates, dateStrings) => {
            setDates(dateStrings);
          }}
        />
      </Stack>
      <br />
      {!loading && (
        <Stack spacing={2}>
          {data.map((item) => (
            <Item
              key={item.id}
              icon={item.icon}
              symbol={item.symbol}
              title={item.title}
              value={item.value}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}
