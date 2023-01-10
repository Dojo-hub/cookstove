import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getLogs } from "../../api/device_logs";

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    valueGetter: (params) => `${new Date(params.row.timestamp).toDateString()}`,
  },
  {
    field: "time",
    headerName: "Time",
    width: 150,
    valueGetter: (params) => `${formatAMPM(new Date(params.row.timestamp))}`,
  },
  {
    field: "weight",
    headerName: "Weight(kg)",
    width: 110,
  },
  {
    field: "temperature",
    headerName: "Temperature",
    width: 160,
  },
  {
    field: "latitude",
    headerName: "Latitude",
    width: 160,
  },
  {
    field: "longitude",
    headerName: "Longitude",
    width: 160,
  },
];

export default function Logs({ deviceID }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchDeviceLogs = async () => {
      try {
        setLoading(true);
        const { data } = await getLogs(deviceID, `?page=${page}`);
        setRows(data.device.logs);
        setCount(data.logcount);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchDeviceLogs();
  }, [page]);

  return (
    <Box mt={4}>
      <Typography variant="h4">Logs</Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={100}
          autoHeight
          rowsPerPageOptions={[100]}
          paginationMode="server"
          rowCount={count}
          checkboxSelection
          onPageChange={(page, details) => setPage(page)}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}
