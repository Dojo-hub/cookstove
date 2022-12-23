import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getOne } from "../../api/devices";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import Logs from "./logs";
import UpdateDevice from "./update";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);

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

  return (
    <Fragment>
      <BackButton />
      <Typography variant="h4">Device: {searchParams.get("name")}</Typography>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="device tabs">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Logs" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
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
        <UpdateDevice device={device} />
      </TabPanel>
    </Fragment>
  );
}
