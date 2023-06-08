import { Card, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DualAxes } from "@ant-design/plots";
import { getEventLogs } from "../api/cookstove_data";
import { DeviceEventsContext } from "../routes/devices/details";

export default function EventDetails() {
  const { event } = useContext(DeviceEventsContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventLogs = async () => {
      try {
        setLoading(true);
        const { data } = await getEventLogs(event.id);
        const rows = data.map((e) => {
          e.timestamp = new Date(e.timestamp).toLocaleTimeString();
          e.temperature = Number(e.temperature);
          e.weight = Number(e.weight);
          return e;
        });
        setData(rows);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchEventLogs();
  }, [event.id]);

  const config = {
    data: [data, data],
    xField: "timestamp",
    yField: ["temperature", "weight"],
  };

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack alignItems="end">
        <Typography variant="h6">Event logs</Typography>
      </Stack>
      <div style={{ position: "relative", width: "100%" }}>
        <DualAxes width="100%" loading={loading} {...config} />
      </div>
    </Card>
  );
}
