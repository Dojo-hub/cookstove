import { Grid, Typography } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useContext } from "react";
import { UserContext } from "../App";

const Card = (props) => <MuiCard sx={{ p: 2 }} {...props} />;

export default function Profile() {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      <br />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h5">Personal Details</Typography>
            <br />
            <Typography>First Name: {user.user.firstName}</Typography>
            <Typography>Last Name: {user.user.lastName}</Typography>
            <Typography>Email: {user.user.email}</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
