import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import MuiTextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { notification } from "antd";
import { addDevice } from "../api/devices";
import BackButton from "./BackButton";

const TextField = (props) => (
  <Grid item xs={6}>
    <MuiTextField fullWidth {...props} />
  </Grid>
);

const openNotification = ({ message, description = "", type }) => {
  notification.open({
    type,
    message,
    description,
    duration: 4,
  });
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 800,
  width: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 8,
  py: 4,
};

const fields = [
  { label: "Name", name: "name" },
  { label: "Serial Number", name: "serialNumber" },
  { label: "Number", name: "number" },
  { label: "SIM ID", name: "simID" },
  { label: "IMEI", name: "imei" },
  { label: "Country", name: "country" },
  { label: "Region", name: "region" },
  { label: "Stove Efficiency (%)", name: "stoveEfficiency", type: "number" },
  {
    label: "Maximum Cooking Load (kg)",
    name: "maximumCookingLoad",
    type: "number",
  },
  { label: "GPS Longitude", name: "longitude", type: "number" },
  { label: "GPS Latitude", name: "latitude", type: "number" },
  { label: "Altitude (m)", name: "altitude", type: "number" },
  {
    label: "Site Type",
    name: "siteType",
    type: "select",
    options: [
      "School",
      "Prison",
      "Health center",
      "Residential",
      "Restaurant",
      "Hotel",
      "Business",
      "Others",
    ],
  },
  {
    label: "Stove/Saucepan Cooking Capacity (L or kg)",
    name: "cookingCapacity",
  },
  {
    label: "Build",
    name: "build",
    type: "select",
    options: ["Mobile", "Fixed"],
  },
  {
    label: "Saucepan Type",
    name: "saucepanType",
    type: "select",
    options: ["Aluminium", "Stainless Steel"],
  },
  {
    label: "Fuel",
    name: "fuel",
    type: "select",
    options: [
      "Firewood",
      "Charcoal",
      "LPG",
      "Natural gas",
      "Biogas",
      "Electric",
      "Others",
    ],
  },
  {
    label: "Fuel Moisture Content (%)",
    name: "fuelMoistureContent",
    type: "number",
  },
  { label: "Fuel Caloric Value", name: "fuelCaloricValue", type: "number" },
  {
    label: "Baseline Traditional Stove Efficiency (%)",
    name: "baselineEfficiency",
    type: "number",
  },
];

export default function DeviceModal({ open, setOpen, setReload }) {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(0);

  const formik = useFormik({
    initialValues: {
      name: "",
      serialNumber: "",
      number: "",
      simID: "",
      imei: "",
      country: "",
      region: "",
      stoveEfficiency: "",
      maximumCookingLoad: "",
      longitude: "",
      latitude: "",
      altitude: "",
      siteType: "",
      cookingCapacity: "",
      build: "",
      saucepanType: "",
      fuel: "",
      fuelMoistureContent: "",
      fuelCalorificValue: "",
      baselineEfficiency: "",
    },
    onSubmit: async (values) => {
      if (page === 0) return setPage(1);
      try {
        setLoading(true);
        await addDevice(values);
        openNotification({
          message: "Device added successfully.",
          type: "success",
        });
        formik.resetForm();
        setLoading(false);
        handleClose();
        setReload((state) => state + 1);
      } catch (error) {
        setLoading(false);
        let description = "";
        if (error.response.data.message)
          description = error.response.data.message;
        openNotification({
          message: "Device not added.",
          description,
          type: "error",
        });
        console.log(error);
      }
    },
  });

  const View = React.useMemo(() => {
    const renderField = (field) => {
      if (field.type === "select") {
        return (
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id={field.name}>{field.label}</InputLabel>
              <Select
                labelId={field.name}
                id={field.name}
                name={field.name}
                label={field.label}
                required
                onChange={formik.handleChange}
                value={formik.values[field.name]}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      }
      return (
        <TextField
          type={field.type === "number" ? "number" : "text"}
          key={field.name}
          id={field.name}
          name={field.name}
          label={field.label}
          required
          onChange={formik.handleChange}
          value={formik.values[field.name]}
        />
      );
    };
    return () => (
      <Grid container my={1} spacing={4}>
        {fields.map((field, index) => {
          if ((page === 0 && index < 10) || (page !== 0 && index >= 10)) {
            return renderField(field);
          }
          return null;
        })}
      </Grid>
    );
  }, [formik, page]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="device-crud"
        aria-describedby="add-or-update-device"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Typography textAlign="center" variant="h5">
              Add Device
            </Typography>
            {page > 0 && (
              <BackButton onClick={() => setPage((state) => state - 1)} />
            )}
            {View()}
            <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
              {error.length > 0 && (
                <Typography style={{ color: "red" }}>{error}</Typography>
              )}
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
              >
                {page === 1 ? "Submit" : "Next"}
              </LoadingButton>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
