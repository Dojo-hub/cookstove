import { Avatar, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../App";

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

export default function Profile() {
  const { user } = useContext(UserContext);
  return (
    <Stack alignItems="center" p={2}>
      <Avatar
        {...stringAvatar(`${user.user.firstName} ${user.user.lastName}`)}
      />
      <Typography variant="h5">
        {user.user.firstName} {user.user.lastName}
      </Typography>
      <Typography>{user.user.email}</Typography>
    </Stack>
  );
}
