import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import MuiTextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Stack } from "@mui/material";
import { addUser } from "../api/user";

const TextField = (props) => <MuiTextField fullWidth {...props} />;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 8,
  py: 4,
};

export default function UserModal({ open, setOpen, setReload }) {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await addUser(values);
        handleClose();
        setReload((state) => state + 1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="device-crud"
        aria-describedby="add-or-update-device"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4} alignItems="center">
              <Typography variant="h5">Add User</Typography>
              <TextField
                id="username"
                name="userName"
                label="User Name"
                onChange={formik.handleChange}
                value={formik.values.userName}
              />
              <TextField
                id="firstname"
                name="firstName"
                label="First Name"
                required
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
              <TextField
                id="lastname"
                name="lastName"
                label="Last Name"
                required
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                required
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <TextField
                id="password"
                name="password"
                label="Password"
                type="passwords"
                required
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {error.length > 0 && (
                <Typography style={{ color: "red" }}>{error}</Typography>
              )}
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                type="submit"
              >
                Submit
              </LoadingButton>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
