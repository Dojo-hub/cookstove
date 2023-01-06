import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getUsers } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import UserModal from "../../components/UserModal";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "userName",
    headerName: "Name",
    width: 150,
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 110,
  },
  {
    field: "createdAt",
    headerName: "Date Created",
    width: 160,
    valueGetter: (params) => `${new Date(params.row.createdAt).toDateString()}`,
  },

  {
    field: "updatedAt",
    headerName: "Date Updated",
    width: 160,
    valueGetter: (params) => `${new Date(params.row.updatedAt).toDateString()}`,
  },
];

export default function Users() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await getUsers(`?page=${page}`);
        setRows(data.users.rows);
        setCount(data.users.count);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
  }, [reload, page]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Users</Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          autoHeight
          paginationMode="server"
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          rowCount={count}
          onPageChange={(page, details) => setPage(page)}
          onRowClick={(params) =>
            navigate(`/users/details/${params.id}?name=${params.row.firstName}%20${params.row.lastName}`)
          }
        />
      </Box>
      <UserModal open={open} setOpen={setOpen} setReload={setReload} />
    </Box>
  );
}
