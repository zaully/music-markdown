import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/system";
import { useGlobalUserPrefInstrumentsToRender } from "../../context/GlobalUserPrefProvider";

export default function InstrumentsToRenderMenuItem() {
    const [instruments, setInstrumentsToRender] = useGlobalUserPrefInstrumentsToRender();

    return (
      <Box>
        <Typography variant="subtitle1">Instruments Displayed</Typography>
        <ToggleButtonGroup
          fullWidth
          value={instruments.filter((instrument) => {
            return instrument.rendering;
          })}
          onChange={(_, newColumns) => {
            const config: Record<string, boolean> = {};
            for (let i = 0; i < newColumns.length; i++) {
                config[newColumns[i].name] = true;
            }
            for (let i = 0; i < instruments.length; i++) {
              if (config[instruments[i].name] === true) {
                instruments[i].rendering = true;
              } else {
                instruments[i].rendering = false;
              }
            }
            setInstrumentsToRender(instruments);
          }}
        >
        {instruments.filter((instrument) => {return instrument.rendering !== undefined}).map((instrument) => (
          <ToggleButton value={instrument} key={instrument.name} sx={{width: 1/instruments.length}}>
            {instrument.name}
          </ToggleButton>
        ))}
        </ToggleButtonGroup>
      </Box>
    );

}
