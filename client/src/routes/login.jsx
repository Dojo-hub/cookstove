import { ErrorMessage, useFormik } from "formik";
import { Container, Stack, Typography } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { login } from "../api/user";

const TextField = (props) => <MuiTextField fullWidth {...props} />;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);
        const { data } = await login(values);
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
        window.location.reload();
      } catch (error) {
        setLoading(false);
        setError(error.response.data.message);
        console.log(error);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4} alignItems="center" pt={4}>
          <Typography variant="h3">CookStove</Typography>
          <TextField
            id="email"
            name="email"
            type="text"
            label="Email"
            required
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {error.length > 0 && <Typography style={{ color: "red" }}>{error}</Typography>}
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
          >
            Login
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
