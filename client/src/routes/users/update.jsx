import { useState } from "react";
import { useFormik } from "formik";
import { Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { updateUser } from "../../api/user";

export default function UpdateUser({ user }) {
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedFields, setUpdatedFields] = useState({});

  const formik = useFormik({
    initialValues: user,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await updateUser({ id: values.id, ...updatedFields });
        setLoading(false);
        window.location.reload();
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (JSON.stringify(user) === JSON.stringify(formik.values))
      setChange(false);
    else setChange(true);
  }, [formik.values]);

  return (
    <Card sx={{ p: 2, mt: 4, width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5">Update User</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="userName"
                name="userName"
                label="User Name"
                required
                onChange={handleChange}
                value={formik.values.userName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstname"
                name="firstName"
                label="First Name"
                required
                onChange={handleChange}
                value={formik.values.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastname"
                name="lastName"
                label="Last Name"
                required
                onChange={handleChange}
                value={formik.values.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                required
                onChange={handleChange}
                value={formik.values.email}
              />
            </Grid>
          </Grid>
          {error.length > 0 && (
            <Typography style={{ color: "red" }}>{error}</Typography>
          )}
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            disabled={!change}
          >
            Submit
          </LoadingButton>
        </Stack>
      </form>
    </Card>
  );
}
