import { useContext, useMemo, useState } from "react";
import { useFormik } from "formik";
import { updateDevice } from "../../api/devices";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSearchParams } from "react-router-dom";
import { DeviceContext } from "./details";

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

const TextField = (props) => (
  <Grid item xs={6}>
    <MuiTextField fullWidth {...props} />
  </Grid>
);

export default function UpdateDevice() {
  const { device, setDevice } = useContext(DeviceContext);

  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatedFields, setUpdatedFields] = useState({});

  const formik = useFormik({
    initialValues: device,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { data } = await updateDevice(values);
        setLoading(false);
        setDevice(data.device);
        setSearchParams({ name: searchParams.get("name"), tab: 1 });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
    setUpdatedFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (device) {
      formik.setValues((prevValues) => ({
        ...prevValues,
        ...device,
      }));
    }
  }, [device]);

  useEffect(() => {
    if (JSON.stringify(device) === JSON.stringify(formik.values))
      setChange(false);
    else setChange(true);
  }, [formik.values]);

  const View = useMemo(() => {
    const renderField = (field) => {
      if (field.type === "select") {
        return (
          <Grid item xs={6} key={field.name}>
            <FormControl fullWidth>
              <InputLabel id={field.name}>{field.label}</InputLabel>
              <Select
                labelId={field.name}
                id={field.name}
                name={field.name}
                label={field.label}
                required
                onChange={handleChange}
                value={formik.values[field.name] || ""}
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
          onChange={handleChange}
          value={formik.values[field.name] || ""}
        />
      );
    };
    return () => (
      <Grid container my={1} spacing={4}>
        {fields.map((field) => {
          return renderField(field);
        })}
      </Grid>
    );
  }, [formik]);

  return (
    <Card sx={{ p: 2, mt: 4, width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Typography textAlign="center" variant="h5">
          Update Device
        </Typography>
        {View()}
        <Stack spacing={2} alignItems="center">
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
