import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { getUsers } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import UserModal from "../../components/UserModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { UserContext } from "../../App";

export default function Users() {
  const navigate = useNavigate();
  const auth = useContext(UserContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [item, setItem] = useState();

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
      width: 120,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 120,
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
      valueGetter: (params) =>
        `${new Date(params.row.createdAt).toDateString()}`,
    },

    {
      field: "updatedAt",
      headerName: "Date Updated",
      width: 160,
      valueGetter: (params) =>
        `${new Date(params.row.updatedAt).toDateString()}`,
    },
    auth.user.user.isSuperuser && {
      field: "delete",
      headerName: "",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            setItem(params);
            setOpenDeleteModal(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

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
        <Typography variant="h4" mb={2}>
          Users
        </Typography>
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
          onCellClick={(params) => {
            if (params.field === "__check__") return;
            if (params.field === "delete") return;
            navigate(
              `/users/details/${params.id}?name=${params.row.firstName}%20${params.row.lastName}`
            );
          }}
        />
      </Box>
      <UserModal open={open} setOpen={setOpen} setReload={setReload} />
      <ConfirmDeleteModal
        open={openDeleteModal}
        setReload={setReload}
        setOpen={setOpenDeleteModal}
        item={item}
        type="User"
      />
    </Box>
  );
}
