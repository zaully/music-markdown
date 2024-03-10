import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { SnackbarProvider } from "../../context/SnackbarProvider";
import { YouTubeIdProvider } from "../../context/YouTubeIdProvider";
import { Render, InstrumentsConfig } from "./Render";

describe("Render", () => {
  it("renders without crashing", () => {
    const config: InstrumentsConfig = {
      instrumentsToRender: new Set<string>(),
      instrumentsSupported: new Set<string>()
    }
    render(
      <YouTubeIdProvider>
        <ThemeProvider theme={createTheme()}>
          <SnackbarProvider>
            <Render source="" columns={"1v"} transpose={'0'} zoom={1} instrumentsConfig={config} />
          </SnackbarProvider>
        </ThemeProvider>
      </YouTubeIdProvider>
    );
  });
});
