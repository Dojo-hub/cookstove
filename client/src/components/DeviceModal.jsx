import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import MuiTextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Stack } from "@mui/material";
import { addDevice } from "../api/devices";

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

export default function DeviceModal({ open, setOpen, setReload }) {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      serialNumber: "",
      number: "",
      simID: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await addDevice(values);
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
              <Typography variant="h5">Add Device</Typography>
              <TextField
                id="name"
                name="name"
                label="Device Name"
                required
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                id="serialnumber"
                name="serialNumber"
                label="Serial Number"
                required
                onChange={formik.handleChange}
                value={formik.values.serialNumber}
              />
              <TextField
                id="number"
                name="number"
                label="Number"
                required
                onChange={formik.handleChange}
                value={formik.values.number}
              />
              <TextField
                id="simID"
                name="simID"
                label="Sim ID"
                required
                onChange={formik.handleChange}
                value={formik.values.simID}
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
