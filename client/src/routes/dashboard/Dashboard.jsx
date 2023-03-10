import { Grid, Stack, Typography } from "@mui/material";
import MuiCard from "@mui/material/Card";
import MuiSkeleton from "@mui/material/Skeleton";
import PeopleIcon from "@mui/icons-material/People";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import { useEffect, useState } from "react";
import { getPlatformStats } from "../../api/stats";

const Card = (props) => <MuiCard sx={{ p: 4 }} {...props} />;
const Skeleton = () => <MuiSkeleton height={56} width={240} />;

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Typography variant="h4" mb={4}>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack direction="row" spacing={4} alignItems="center">
              <DevicesOtherIcon sx={{ fontSize: "6em" }} />
              <div>
                {loading ? (
                  <Skeleton />
                ) : (
                  <Typography variant="h3">{data.deviceCount}</Typography>
                )}
                <Typography variant="h5">Devices</Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack direction="row" spacing={4} alignItems="center">
              <PeopleIcon sx={{ fontSize: "6em" }} />
              <div>
                {loading ? (
                  <Skeleton />
                ) : (
                  <Typography variant="h3">{data.userCount}</Typography>
                )}
                <Typography variant="h5">Users</Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
