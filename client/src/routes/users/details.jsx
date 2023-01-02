import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteUser, getUser } from "../../api/user";
import { UserContext } from "../../App";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import UpdateUser from "./update";

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [email, setEmail] = useState("");

  const auth = useContext(UserContext);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const { data } = await getUser(id);
        if (!data.user) navigate("/users");
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

  const handleDelete = async () => {
    if (email !== user.email) {
      setDeleteError(true);
      return;
    }
    try {
      setDeleteBtnLoading(true);
      await deleteUser(id);
      navigate("/users");
    } catch (error) {
      setDeleteBtnLoading(false);
      console.log(error);
    }
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UpdateUser user={user} />
          </Grid>
          {auth.user.user.isSuperuser && (
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, mt: 4, width: "100%" }}>
                <Stack spacing={2}>
                  <Typography variant="h5" textAlign="center">
                    Delete User
                  </Typography>
                  <TextField
                    fullWidth
                    label="Enter user email to delete"
                    onChange={(e) => {
                      setDeleteError(false);
                      setEmail(e.target.value);
                    }}
                    error={deleteError}
                    helperText={deleteError ? "Enter correct user email" : ""}
                    value={email}
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
          )}
        </Grid>
      </TabPanel>
    </Fragment>
  );
}
