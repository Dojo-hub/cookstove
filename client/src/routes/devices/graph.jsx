import { Card, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker, notification } from "antd";
import { DualAxes } from "@ant-design/plots";
import { getLogs } from "../../api/device_logs";

const { RangePicker } = DatePicker;

const today = dayjs();
const onedayago = dayjs().subtract(1, "week");

const openNotification = ({ message, description = "", type }) => {
  notification.open({
    type,
    message,
    description,
    duration: 2,
  });
};

export default function Graph({ deviceID }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([
    dayjs(onedayago).format("YYYY-MM-DD"),
    dayjs(today).format("YYYY-MM-DD"),
  ]);

  useEffect(() => {
    const fetchDeviceLogs = async () => {
      try {
        setLoading(true);
        const { data } = await getLogs(
          deviceID,
          `?startDate=${dates[0]}&endDate=${dates[1]}`
        );
        let rows = data.device.logs.map((e) => ({
          day: e.timestamp,
          weight: Number(e.weight),
          temperature: Number(e.temperature),
        }));
        rows = rows.sort((a, b) => new Date(b.day) - new Date(a.day));
        setData(rows);
        setLoading(false);
      } catch (error) {
        setData([]);
        setLoading(false);
        console.log(error);
      }
    };
    fetchDeviceLogs();
  }, [dates]);

  const config = {
    data: [data, data],
    xField: "day",
    yField: ["temperature", "weight"],
    yAxis: {
      temperature: {
        title: {
          text: "Temperature (°C)",
          style: {
            fill: "#000000",
            fontWeight: "bold",
          },
        },
        label: {
          formatter: (v) => Math.round(v * 100) / 100,
        },
      },
      weight: {
        title: {
          text: "Weight (kg)",
          style: {
            fill: "#000000",
            fontWeight: "bold",
          },
        },
        label: {
          formatter: (v) => Math.round(v * 1000) / 100,
        },
      },
    },
    xAxis: {
      type: "time",
      mask: dayjs(dates[1]).diff(dates[0], "day") < 2 ? "HH:mm" : "YYYY-MM-DD",
    },
  };

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Logs</Typography>
        <RangePicker
          defaultValue={[onedayago, today]}
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(dates, dateStrings) => {
            if (dayjs(dateStrings[1]).diff(dateStrings[0], "day") > 30) {
              openNotification({
                message: "Date range too large",
                description: "Date range should be less than a month.",
                type: "error",
              });
              return;
            }
            setDates(dateStrings);
          }}
        />
      </Stack>
      <br />
      <div style={{ position: "relative", width: "100%" }}>
        <DualAxes width="100%" loading={loading} {...config} />
      </div>
    </Card>
  );
}
