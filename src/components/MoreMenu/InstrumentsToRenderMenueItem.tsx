import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/system";
import { useGlobalUserPrefInstrumentsToRender, InstrumentToRender } from "../../context/GlobalUserPrefProvider";

const itemCountPerLine = 4

export default function InstrumentsToRenderMenuItem() {
    const [instruments, setInstrumentsToRender] = useGlobalUserPrefInstrumentsToRender();

    let buttonGroupConfig: InstrumentToRender[][] = []
    let rows = 0;
    while (instruments.length > rows * itemCountPerLine) {
      if (instruments.length > (rows + 1) * itemCountPerLine) {
        const test = instruments.slice(rows * itemCountPerLine, (rows + 1) * itemCountPerLine);
        buttonGroupConfig.push(test)
      } else {
        buttonGroupConfig.push(instruments.slice(rows * itemCountPerLine, undefined))
      }
      rows++;
    }

    function updateFunction(newColumns: any, index: number) {
      const config: Record<string, boolean> = {};
      for (let i = 0; i < newColumns.length; i++) {
          config[newColumns[i].name] = true;
      }
      for (let i = 0; i < buttonGroupConfig[index].length; i++) {
        if (config[buttonGroupConfig[index][i].name] === true) {
          buttonGroupConfig[index][i].rendering = true;
        } else {
          buttonGroupConfig[index][i].rendering = false;
        }
      }
      setInstrumentsToRender(instruments);
    }

    return (
      <Box>
        <Typography variant="subtitle1">Instruments Displayed</Typography>
        {buttonGroupConfig.map((config, index) => (
            <ToggleButtonGroup
              fullWidth
              value={config.filter((instrument) => instrument.rendering)}
              onChange={(_, newColumns) => {updateFunction(newColumns, index)}}
            >
              {config.map((instrument)=>(
                <ToggleButton size="small" value={instrument} key={instrument.name} sx={{width: 1/itemCountPerLine}}>
                  {instrument.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
        ))}
      </Box>
    );

}
