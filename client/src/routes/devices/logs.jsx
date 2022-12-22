import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getLogs } from "../../api/device_logs";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "serialNumber",
    headerName: "Serial Number",
    width: 150,
  },
  {
    field: "number",
    headerName: "Number",
    width: 110,
  },
  {
    field: "simID",
    headerName: "Sim ID",
    width: 160,
  },
  {
    field: "createdAt",
    headerName: "Date Created",
    width: 160,
    valueGetter: (params) => `${new Date(params.row.createdAt).toDateString()}`,
  },
];

export default function Logs({ deviceID }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeviceLogs = async () => {
      try {
        setLoading(true);
        const { data } = await getLogs(deviceID);
        setRows(data.device_logs);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchDeviceLogs();
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h4">Logs</Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}
