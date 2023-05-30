import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ onClick }) {
  const navigate = useNavigate();

  // if onclick is passed, use it, otherwise use navigate(-1)
  const handleClick = onClick ? onClick : () => navigate(-1);

  return (
    <IconButton onClick={handleClick}>
      <ArrowBackIcon />
    </IconButton>
  );
}
