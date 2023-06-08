import * as React from "react";
import { Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { getDeviceEvents } from "../api/cookstove_data";
import { DeviceEventsContext } from "../routes/devices/details";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

export default function DeviceEventsTable({ deviceId }) {
  const { setEvent } = useContext(DeviceEventsContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 110,
      valueGetter: (params) => formatDate(params.row.startDate),
    },
    {
      field: "startDate",
      headerName: "Start Time",
      width: 110,
      valueGetter: (params) =>
        new Date(params.row.startDate).toLocaleTimeString(),
    },
    {
      field: "endDate",
      headerName: "End Time",
      width: 110,
      valueGetter: (params) =>
        new Date(params.row.endDate).toLocaleTimeString(),
    },
    {
      field: "duration",
      headerName: "Duration (hrs)",
      width: 110,
      valueGetter: (params) => (Number(params.row.duration) / 3600).toFixed(3),
    },
    {
      field: "averageTemperature",
      headerName: "Avg Temp (°C)",
      width: 90,
    },
    {
      field: "maximumTemperature",
      headerName: "Max Temp (°C)",
      width: 90,
    },
    {
      field: "totalFuelMass",
      headerName: "Total Fuel Mass (kg)",
      width: 110,
    },
    {
      field: "foodMass",
      headerName: "Food Mass (kg)",
      width: 110,
    },
    {
      field: "energyConsumption",
      headerName: "Energy Consumption (kJ)",
      width: 110,
    },
    {
      field: "power",
      headerName: "Power (W)",
      width: 110,
    },
    {
      field: "usefulEnergy",
      headerName: "Useful Energy (kJ)",
      width: 110,
    },
  ];

  useEffect(() => {
    const fetchDeviceEvents = async () => {
      try {
        setLoading(true);
        const { data } = await getDeviceEvents(deviceId);
        setRows(data.rows);
        setEvent(data.rows[0]);
        setCount(data.count);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchDeviceEvents();
  }, [reload, page]);

  return (
    <Box mt={2}>
      <Typography variant="h6">Cooking Events</Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          autoHeight
          rowCount={count}
          paginationMode="server"
          checkboxSelection
          disableSelectionOnClick
          onPageChange={(page, details) => setPage(page)}
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick={(params) => setEvent(params.row)}
        />
      </Box>
    </Box>
  );
}
