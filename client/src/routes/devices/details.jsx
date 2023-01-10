import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { notification } from "antd";
import { deleteDevice, getOne } from "../../api/devices";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import Graph from "./graph";
import Logs from "./logs";
import UpdateDevice from "./update";

const TextField = (props) => <MuiTextField fullWidth {...props} />;

const openNotification = ({ message, description = "", type }) => {
  notification.open({
    type,
    message,
    description,
    duration: 4,
  });
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `device-tab-${index}`,
    "aria-controls": `device-tabpanel-${index}`,
  };
}

export default function details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [deviceName, setDeviceName] = useState("");
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const { data } = await getOne(id);
        setDevice(data.device);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchDevice();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = async () => {
    if (deviceName !== device.name) {
      setDeleteError(true);
      return;
    }
    try {
      setDeleteBtnLoading(true);
      await deleteDevice(id);
      openNotification({
        message: "Device deleted successfuly",
        type: "success",
      });
      navigate("/devices");
    } catch (error) {
      setDeleteBtnLoading(false);
      openNotification({ message: "Device not deleted", type: "error" });
      console.log(error);
    }
  };

  return (
    <Fragment>
      <BackButton />
      <Typography variant="h4">Device: {searchParams.get("name")}</Typography>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="device tabs">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Logs" {...a11yProps(1)} />
          <Tab label="Graphs" {...a11yProps(2)} />
          <Tab label="Settings" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Card sx={{ height: 200, maxWidth: 480, mt: 4 }}>
          {loading ? (
            <Loading />
          ) : (
            <Grid container p={4}>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{device.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>IMEI:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{device.imei}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Serial Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{device.serialNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{device.number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Sim ID:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{device.simID}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Created At:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {new Date(device.createdAt).toDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Card>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Logs deviceID={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Graph deviceID={id} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UpdateDevice device={device} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, mt: 4, width: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h5" textAlign="center">
                  Delete Device
                </Typography>
                <TextField
                  fullWidth
                  label="Enter device name to delete"
                  onChange={(e) => {
                    setDeleteError(false);
                    setDeviceName(e.target.value);
                  }}
                  error={deleteError}
                  helperText={deleteError ? "Enter correct device name" : ""}
                  value={deviceName}
                />
                <LoadingButton
                  loading={deleteBtnLoading}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Fragment>
  );
}
