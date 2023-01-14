import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MuiTextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Stack } from "@mui/material";
import { notification } from "antd";
import { deleteDevice } from "../api/devices";
import { deleteUser } from "../api/user";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const TextField = (props) => <MuiTextField fullWidth {...props} />;

const openNotification = ({ message, description = "", type }) => {
  notification.open({
    type,
    message,
    description,
    duration: 4,
  });
};

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

export default function ConfirmDeleteModal({ open, setOpen, setReload, item, type }) {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if(type === "Device")
      await deleteDevice(item.id);
      else await deleteUser(item.id);
      openNotification({
        message: `${type} deleted successfully.`,
        type: "success",
      });
      setLoading(false);
      setReload((state) => state + 1);
      handleClose();
    } catch (error) {
      setLoading(false);
      let description = "";
      if (error.response.data.message)
        description = error.response.data.message;
      openNotification({
        message: `${type} not deleted.`,
        description,
        type: "error",
      });
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="device-delete"
        aria-describedby="delete-device"
      >
        <Box sx={style}>
          <Stack spacing={2} alignItems="center">
            <CancelOutlinedIcon sx={{ fontSize: "5em" }} />
            <Typography variant="h5">Delete {type}</Typography>
            <Typography>{type} will be permanently deleted.</Typography>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={handleDelete}
                loading={loading}
              >
                Delete
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
