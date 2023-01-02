import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import MuiTextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5">User Details</Typography>
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
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  name="password"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              {error.length > 0 && (
                <Typography style={{ color: "red" }}>{error}</Typography>
              )}
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                type="submit"
              >
                Add
              </LoadingButton>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
