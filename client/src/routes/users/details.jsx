import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getUser } from "../../api/user";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import UpdateUser from "./update";
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
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

export default function details() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const { data } = await getUser(id);
        setUser(data.user);
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
      <Typography variant="h4">User: {searchParams.get("name")}</Typography>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="user tabs">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Settings" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Card sx={{ height: 200, maxWidth: 480, mt: 4 }}>
          {loading ? (
            <Loading />
          ) : (
            <Grid container p={4}>
              <Grid item xs={6}>
                <Typography fontWeight={600}>User Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{user.userName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>First Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{user.firstName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Last Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{user.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Email:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{user.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Created At:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {new Date(user.createdAt).toDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Card>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UpdateUser user={user} />
      </TabPanel>
    </Fragment>
  );
}
