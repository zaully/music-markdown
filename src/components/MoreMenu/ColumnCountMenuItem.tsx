import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/system";
import { useColumns } from "../../context/SongPrefsProvider";

export default function ColumnCountMenuItem() {
  const { columns, setColumns } = useColumns();

  return (
    <Box>
      <Typography variant="subtitle1">Columns</Typography>
      <ToggleButtonGroup
        fullWidth
        value={columns}
        exclusive
        onChange={(_, newColumns) => setColumns(newColumns)}
      >
        {["1v", '1', '2', '3', '4'].map((columnCount) => (
          <ToggleButton size="small" value={columnCount} key={columnCount}>
            {columnCount}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
