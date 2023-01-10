import { Card, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker, notification } from "antd";
import { DualAxes } from "@ant-design/plots";
import { getLogs } from "../../api/device_logs";

const { RangePicker } = DatePicker;

const today = dayjs();
const onemonthago = dayjs().subtract(1, "month");

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
    dayjs(onemonthago).format("YYYY-MM-DD"),
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
        const rows = data.device.logs.map((e) => ({
          day: e.timestamp,
          weight: Number(e.weight),
          temperature: Number(e.temperature),
        }));
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
    xAxis: {
      type: "time",
    },
  };

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack alignItems="end">
        <RangePicker
          defaultValue={[onemonthago, today]}
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
