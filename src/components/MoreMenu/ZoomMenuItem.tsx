import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {
  Button,
  Divider,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalUserPrefZoom } from "../../context/GlobalUserPrefProvider";

const marks = [
  { value: -2, label: "25%" },
  { value: -1, label: "50%" },
  { value: 0, label: "100%" },
  { value: 1, label: "200%" },
  { value: 2, label: "400%" },
];

function valueLabelFormat(value: number) {
  return `${Math.round(value * 100)}%`;
}

function calculateValue(value: number) {
  return 2 ** value;
}

export default function ZoomMenuItem() {
  const [zoom, setZoom] = useGlobalUserPrefZoom();

  return (
    <Box>
      <Typography variant="subtitle1">Zoom</Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          aria-label="Zoom out"
          color="primary"
          onClick={() => setZoom(Math.max(0.25, zoom - 0.05))}
        >
          <ArrowCircleDownIcon />
        </IconButton>
        <Typography aria-label="Zoom amount" variant="body1">
          {valueLabelFormat(zoom)}
        </Typography>
        <IconButton
          aria-label="Zoom in"
          color="primary"
          onClick={() => setZoom(Math.min(4, zoom + 0.05))}
        >
          <ArrowCircleUpIcon />
        </IconButton>
        <Divider orientation="vertical" />
        <Button
          aria-label="Zoom reset"
          variant="outlined"
          startIcon={<SettingsBackupRestoreIcon />}
          onClick={() => setZoom(1)}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
}
