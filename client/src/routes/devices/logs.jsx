import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getLogs } from "../../api/device_logs";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    valueGetter: (params) => `${new Date(params.row.timestamp).toLocaleDateString()}`,
  },
  {
    field: "time",
    headerName: "Time",
    width: 150,
    valueGetter: (params) => `${new Date(params.row.timestamp).toLocaleTimeString()}`,
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
  const [loading, setLoading] = useState(false);
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
          pageSize={50}
          autoHeight
          rowsPerPageOptions={[50]}
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
