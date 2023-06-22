import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Charts from "./Charts";
import { getAllEventsData } from "../api/cookstove_data";

const { RangePicker } = DatePicker;

const today = dayjs();
const threemonthsago = dayjs().subtract(3, "month");

export default function DeviceEventsChart({ id }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([
    dayjs(threemonthsago).format("YYYY-MM-DD"),
    dayjs(today).format("YYYY-MM-DD"),
  ]);
  const [groupBy, setGroupBy] = useState("month");

  useEffect(() => {
    const fetchCookstoveData = async () => {
      try {
        setLoading(true);
        const { data } = await getAllEventsData(
          `?startDate=${dates[0]}&endDate=${dates[1]}&groupBy=${groupBy}&deviceId=${id}`
        );
        // change all the fields that can be numbers into numbers
        data.forEach((item) => {
          for (const key in item) {
            if (key !== "day" && key !== "month") item[key] = Number(item[key]);
            if (key === "avgDuration" || key === "sumDuration")
              item[key] = Math.round((item[key] / 3600) * 100) / 100;
          }
        });
        setData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchCookstoveData();
  }, [dates, groupBy, id]);

  const handleClick = (e) => {
    setGroupBy(e.target.checked ? "month" : "day");
  };

  return (
    <>
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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={groupBy == "month"} onClick={handleClick} />
          }
          label={groupBy}
        />
      </FormGroup>
      <Charts data={data} loading={loading} groupBy={groupBy} />
    </>
  );
}
