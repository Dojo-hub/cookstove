import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate(-1)}>
      <ArrowBackIcon />
    </IconButton>
  );
}
