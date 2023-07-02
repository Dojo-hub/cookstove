import {
  Avatar,
  Grid,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import MuiSkeleton from "@mui/material/Skeleton";
import PeopleIcon from "@mui/icons-material/People";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import { useContext, useEffect, useState } from "react";
import { getPlatformStats } from "../../api/stats";
import CookstoveData from "../../components/CookstoveData";
import Profile from "../profile";
import { UserContext } from "../../App";

const Card = (props) => <MuiCard sx={{ p: 4, cursor: "pointer" }} {...props} />;
const Skeleton = () => <MuiSkeleton height={56} width={240} />;

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        setLoading(true);
        const { data } = await getPlatformStats();
        setData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPlatformStats();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null); // close the menu
  };

  return (
    <div style={{ marginTop: "-8px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <div>
          <Typography variant="h4" fontWeight={700}>
            Hello, {user.user.firstName}
          </Typography>
          <Typography color="gray">{new Date().toDateString()}</Typography>
        </div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar
            {...stringAvatar(`${user.user.firstName} ${user.user.lastName}`)}
          />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Profile />
        </Menu>
      </Stack>
      <Typography variant="h5" mb={2}>
        Platform Statistics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card onClick={() => navigate("/devices")}>
            <Stack direction="row" spacing={4} alignItems="center">
              <DevicesOtherIcon sx={{ fontSize: "6em" }} />
              <div>
                {loading ? (
                  <Skeleton />
                ) : (
                  <Typography variant="h3">{data.deviceCount}</Typography>
                )}
                <Typography variant="h5" color="gray">
                  Devices
                </Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card onClick={() => navigate("/users")}>
            <Stack direction="row" spacing={4} alignItems="center">
              <PeopleIcon sx={{ fontSize: "6em" }} />
              <div>
                {loading ? (
                  <Skeleton />
                ) : (
                  <Typography variant="h3">{data.userCount}</Typography>
                )}
                <Typography variant="h5" color="gray">
                  Users
                </Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
        <CookstoveData />
      </Grid>
    </div>
  );
}
