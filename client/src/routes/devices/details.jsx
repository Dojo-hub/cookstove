import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createContext, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { notification } from "antd";
import { deleteDevice, getOne } from "../../api/devices";
import Loading from "../../components/Loading";
import Graph from "./graph";
import Logs from "./logs";
import UpdateDevice from "./update";
import CookingPercentages from "../../components/CookingPercentages";
import DeviceEventsChart from "../../components/DeviceEventsCharts";
import DeviceEventsTable from "../../components/DeviceEventsTable";
import EventDetails from "../../components/EventDetails";
import CookstoveData from "../../components/CookstoveData";

const TextField = (props) => <MuiTextField fullWidth {...props} />;

export const DeviceEventsContext = createContext();
export const DeviceContext = createContext();

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

const Item = ({ label, value }) => (
  <>
    <Grid item xs={6}>
      <Typography fontWeight={600}>{label}:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{value}</Typography>
    </Grid>
  </>
);

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
  const [value, setValue] = useState(parseInt(searchParams.get("tab")) || 0);
  const [deviceName, setDeviceName] = useState("");
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [event, setEvent] = useState({});

  useEffect(() => {
    if (searchParams.get("tab")) {
      setValue(parseInt(searchParams.get("tab")));
    }
  }, [searchParams.get("tab")]);

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
    setSearchParams({ name: searchParams.get("name"), tab: newValue });
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
    <DeviceContext.Provider value={{ device, setDevice }}>
      <IconButton onClick={() => navigate("/devices")}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4">Device: {searchParams.get("name")}</Typography>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="device tabs">
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Details" {...a11yProps(1)} />
          <Tab label="Logs" {...a11yProps(2)} />
          <Tab label="Graphs" {...a11yProps(3)} />
          <Tab label="Settings" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid mt={1} container spacing={3}>
          <CookstoveData deviceId={id} />
        </Grid>
        <DeviceEventsContext.Provider value={{ event, setEvent }}>
          <DeviceEventsTable deviceId={id} />
          <EventDetails />
        </DeviceEventsContext.Provider>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card sx={{ mt: 4 }}>
          {loading ? (
            <Loading />
          ) : (
            <Grid container p={4}>
              <Item label="Name" value={device.name} />
              <Item label="IMEI" value={device.imei} />
              <Item label="Serial Number" value={device.serialNumber} />
              <Item label="Number" value={device.number} />
              <Item label="Sim ID" value={device.simID} />
              <Item label="Country" value={device.country} />
              <Item label="Region" value={device.region} />
              <Item
                label="Stove efficiency (%)"
                value={device.stoveEfficiency}
              />
              <Item
                label="Maximum cooking load (kg)"
                value={device.maximumCookingLoad}
              />
              <Item label="GPS Longitude" value={device.longitude} />
              <Item label="GPS latitude" value={device.latitude} />
              <Item label="Altitude (m)" value={device.altitude} />
              <Item label="Site type" value={device.siteType} />
              <Item
                label="Stove/saucepan cooking capacity (L or kg)"
                value={device.cookingCapacity}
              />
              <Item label="Build" value={device.build} />
              <Item label="Saucepan type" value={device.saucepanType} />
              <Item label="Fuel" value={device.fuel} />
              <Item
                label="Fuel moisture content (%)"
                value={device.fuelMoistureContent}
              />
              <Item
                label="Fuel caloric value"
                value={device.fuelCaloricValue}
              />
              <Item
                label="Baseline traditional stove efficiency (%)"
                value={device.baselineEfficiency}
              />
              <Item
                label="Created At"
                value={new Date(device.createdAt).toDateString()}
              />
            </Grid>
          )}
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Logs deviceID={id} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DeviceEventsChart id={id} />
        <Graph deviceID={id} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UpdateDevice />
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
          <Grid item xs={12}>
            <CookingPercentages deviceID={id} />
          </Grid>
        </Grid>
      </TabPanel>
    </DeviceContext.Provider>
  );
}
