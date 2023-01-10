import { Card, CircularProgress, Stack } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { DualAxes } from "@ant-design/plots";
import { getLogs } from "../../api/device_logs";

const { RangePicker } = DatePicker;

export default function Graph({ deviceID }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

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
        <RangePicker onChange={(dates, dateStrings) => setDates(dateStrings)} />
      </Stack>
      <br />
      <DualAxes width="100%" loading={loading} {...config} />
    </Card>
  );
}
