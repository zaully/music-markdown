import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { Stack, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/system";
import { useTheme } from "../../context/ThemeProvider";

export default function ThemeMenuItem() {
  const { themeName, setThemeName } = useTheme();

  return (
    <Box>
      <Typography variant="subtitle1">Theme</Typography>
      <ToggleButtonGroup
        value={themeName}
        fullWidth
        exclusive
        onChange={(event, newThemeName) => setThemeName(newThemeName)}
      >
        <ToggleButton size="small" value="light">
          <Stack spacing={1} direction="row">
            <LightModeIcon />
            <Typography variant="button">Light</Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton size="small" value="system">
          <Stack spacing={1} direction="row">
            <SettingsBrightnessIcon />
            <Typography variant="button">System</Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton size="small" value="dark">
          <Stack spacing={1} direction="row">
            <DarkModeIcon />
            <Typography variant="button">Dark</Typography>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
