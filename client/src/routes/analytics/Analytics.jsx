import { useEffect, useState } from "react";
import { DatePicker, notification } from "antd";
import dayjs from "dayjs";
import {
  Card,
  FormGroup,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { getAllEventsData } from "../../api/cookstove_data";
import Charts from "../../components/Charts";
const { RangePicker } = DatePicker;

const today = dayjs();
const threemonthsago = dayjs().subtract(3, "month");

const changeLabel = (groupBy) => {
  if (groupBy === "month") return "monthly";
  return "daily";
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([
    dayjs(threemonthsago).format("YYYY-MM-DD"),
    dayjs(today).format("YYYY-MM-DD"),
  ]);
  const [data, setData] = useState([]);
  const [groupBy, setGroupBy] = useState("month");

  useEffect(() => {
    const fetchCookstoveData = async () => {
      try {
        setLoading(true);
        const { data } = await getAllEventsData(
          `?startDate=${dates[0]}&endDate=${dates[1]}&groupBy=${groupBy}`
        );
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
  }, [dates, groupBy]);

  const handleClick = (e) => {
    setGroupBy(e.target.checked ? "month" : "day");
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Analytics</Typography>
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
          label={changeLabel(groupBy) + " data"}
        />
      </FormGroup>
      <Charts data={data} loading={loading} groupBy={groupBy} />
    </>
  );
}
