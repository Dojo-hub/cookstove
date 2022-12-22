import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { profile } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeviceModal from "../../components/DeviceModal";

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

export default function Devices() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const { data } = await profile();
        setRows(data.user.devices);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchDevices();
  }, [reload]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Devices</Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Device
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick={(params) =>
            navigate(`/devices/details/${params.id}?name=${params.row.name}`)
          }
        />
      </Box>
      <DeviceModal open={open} setOpen={setOpen} setReload={setReload} />
    </Box>
  );
}