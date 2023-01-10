import { Card, CircularProgress, Stack } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { Chart } from "react-google-charts";
import { getLogs } from "../../api/device_logs";

const { RangePicker } = DatePicker;

const emptyrow = [format(new Date(), "dd/mm/yyyy"), 0, 0];

export default function Graph({ deviceID }) {
  const [data, setData] = useState([emptyrow]);
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
        const rows = data.device.logs.map((e) => [
          format(new Date(e.timestamp), "dd/mm/yyyy"),
          Number(e.weight),
          Number(e.temperature),
        ]);
        if (data.device.logs.length === 0) setData([emptyrow]);
        else setData(rows);
        setLoading(false);
      } catch (error) {
        setData([emptyrow]);
        setLoading(false);
        console.log(error);
      }
    };
    fetchDeviceLogs();
  }, [dates]);

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack alignItems="end">
        <RangePicker onChange={(dates, dateStrings) => setDates(dateStrings)} />
      </Stack>
      <br />
      <Chart
        chartType="Line"
        data={[["Date", "Weight", "Temperature"], ...data]}
        width="100%"
        height="600px"
        loading={loading}
        loader={<CircularProgress />}
        options={{
          vAxis: {
            minValue: 0,
          },
        }}
        legendToggle
      />
    </Card>
  );
}
