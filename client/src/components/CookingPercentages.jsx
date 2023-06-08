import * as React from "react";
import { Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, Modal, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Stack } from "@mui/system";
import { notification } from "antd";
import {
  getMonthlyCookingPercentages,
  updateMonthlyCookingPercentages,
} from "../api/devices";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

export default function CookingPercentages({ deviceID }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [item, setItem] = useState({});
  const [maxLoad, setMaxLoad] = useState(0);

  const columns = [
    {
      field: "month",
      headerName: "Name",
      width: 120,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 120,
      valueGetter: (params) => formatDate(params.row.startDate),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 120,
      valueGetter: (params) => formatDate(params.row.endDate),
    },
    {
      field: "fullLoad",
      headerName: "Time Portion (Full Load)",
      width: 150,
      valueGetter: (params) => `${params.row.fullLoad}%`,
    },
    {
      field: "twoThirdsLoad",
      headerName: "Time Portion (2/3 Load)",
      width: 150,
      valueGetter: (params) => `${params.row.twoThirdsLoad}%`,
    },
    {
      field: "halfLoad",
      headerName: "Time Portion (1/2 Load)",
      width: 110,
      valueGetter: (params) => `${params.row.halfLoad}%`,
    },
    {
      field: "cookingLoad",
      headerName: "Cooking Load",
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2">
          {Number(params.row.fullLoad) * maxLoad +
            Number(params.row.twoThirdsLoad) * maxLoad * 0.667 +
            Number(params.row.halfLoad) * 0.5 * maxLoad}
        </Typography>
      ),
    },
    {
      field: "Edit",
      headerName: "",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            setItem(params);
            setOpenEditModal(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchMonthlyPercentages = async () => {
      try {
        setLoading(true);
        const { data } = await getMonthlyCookingPercentages(deviceID);
        setMaxLoad(Number(data.device.maximumCookingLoad || 0));
        setRows(data.device.monthlyCookingPercentages);
        setCount(data.count);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchMonthlyPercentages();
  }, [reload, page]);

  return (
    <Box mt={2}>
      <Typography variant="h6">Monthly Cooking Percentages</Typography>
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
        />
      </Box>
      {!loading && (
        <EditModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          item={item}
          setReload={setReload}
        />
      )}
    </Box>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

const openNotification = ({ message, description = "", type }) => {
  notification.open({
    type,
    message,
    description,
    duration: 2,
  });
};

const EditModal = ({ open, setOpen, item, setReload }) => {
  const [data, setData] = useState(
    item.row || {
      fullLoad: 0,
      twoThirdsLoad: 0,
      halfLoad: 0,
      month: "",
    }
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!item.row) return;
    setData(item.row);
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      Number(data.fullLoad) +
        Number(data.twoThirdsLoad) +
        Number(data.halfLoad) >
      100
    ) {
      openNotification({
        message: "Error",
        description: "Sum of percentages should be less than or eaqual to 100",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      await updateMonthlyCookingPercentages(data.id, data);
      setLoading(false);
      setReload((prev) => prev + 1);
      handleClose();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card sx={style}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} p={2}>
            <Typography variant="h6">Edit Monthly Time Portions</Typography>
            <TextField
              label="Name"
              name="month"
              variant="outlined"
              fullWidth
              value={data.month}
              disabled
              onChange={handleChange}
            />
            <TextField
              type="number"
              label="Full Load (%)"
              variant="outlined"
              name="fullLoad"
              fullWidth
              required
              value={data.fullLoad}
              onChange={handleChange}
            />
            <TextField
              type="number"
              label="2/3 Load (%)"
              variant="outlined"
              name="twoThirdsLoad"
              fullWidth
              required
              value={data.twoThirdsLoad}
              onChange={handleChange}
            />
            <TextField
              type="number"
              label="1/2 Load (%)"
              variant="outlined"
              name="halfLoad"
              fullWidth
              required
              value={data.halfLoad}
              onChange={handleChange}
            />
            <LoadingButton
              loading={loading}
              variant="contained"
              fullWidth
              type="submit"
            >
              Submit
            </LoadingButton>
          </Stack>
        </form>
      </Card>
    </Modal>
  );
};
