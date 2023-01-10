import { useState } from "react";
import { useFormik } from "formik";
import { updateDevice } from "../../api/devices";
import { Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

export default function UpdateDevice({ device }) {
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: device,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await updateDevice(values);
        setLoading(false);
        window.location.reload();
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (JSON.stringify(device) === JSON.stringify(formik.values))
      setChange(false);
    else setChange(true);
  }, [formik.values]);

  return (
    <Card sx={{ p: 2, mt: 4, width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5">Update Device</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="imei"
                name="imei"
                label="IMEI"
                required
                onChange={formik.handleChange}
                value={formik.values.imei}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                name="name"
                label="Device Name"
                required
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="serialnumber"
                name="serialNumber"
                label="Serial Number"
                required
                onChange={formik.handleChange}
                value={formik.values.serialNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="number"
                name="number"
                label="Number"
                required
                onChange={formik.handleChange}
                value={formik.values.number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="simID"
                name="simID"
                label="Sim ID"
                required
                onChange={formik.handleChange}
                value={formik.values.simID}
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
