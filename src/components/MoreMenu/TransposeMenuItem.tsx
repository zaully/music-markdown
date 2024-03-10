import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { Button, Divider, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranspose } from "../../context/SongPrefsProvider";

export default function TransposeMenuItem() {
  const { transpose, setTranspose } = useTranspose();

  function updateTransposeSharpFlatPref(sharpFlatPref: any) {
    setTranspose(transpose.replace(/[^0-9-]/g, '') + sharpFlatPref)
  }

  function updateTransposeNumber(transposeNumber: any) {
    setTranspose(transposeNumber + transpose.replace(/[0-9-]/g, ''))
  }

  return (
    <Box>
      <Typography variant="subtitle1">Transpose</Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <ToggleButtonGroup
          fullWidth={false}
          value={transpose.replace(/[0-9-]/g, '')}
          exclusive
          onChange={(_, sharpFlatPref) => updateTransposeSharpFlatPref(sharpFlatPref)}
        >
          {["#", 'b'].map((pref) => (
            <ToggleButton size="small" sx={{width: 50}} value={pref} key={pref} style={{textTransform: 'none'}}>
              {pref}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <IconButton
          aria-label="Transpose down"
          color="primary"
          onClick={() => updateTransposeNumber(+transpose.replace(/[^0-9-]/g, '') - 1)}
        >
          <ArrowCircleDownIcon />
        </IconButton>
        <Typography variant="body1">{transpose.replace(/[^0-9-]/g, '')}</Typography>
        <IconButton
          aria-label="Transpose up"
          color="primary"
          onClick={() => updateTransposeNumber(+transpose.replace(/[^0-9-]/g, '') + 1)}
        >
          <ArrowCircleUpIcon />
        </IconButton>
        <Divider orientation="vertical" />
        <Button
          variant="outlined"
          startIcon={<SettingsBackupRestoreIcon />}
          onClick={() => setTranspose("0")}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
}
