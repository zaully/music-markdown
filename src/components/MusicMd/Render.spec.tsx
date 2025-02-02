import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { SnackbarProvider } from "../../context/SnackbarProvider";
import { YouTubeIdProvider } from "../../context/YouTubeIdProvider";
import Render from "./Render";

describe("Render", () => {
  it("renders without crashing", () => {
    render(
      <YouTubeIdProvider>
        <ThemeProvider theme={createTheme()}>
          <SnackbarProvider>
            <Render source="" columns={1} transpose={0} zoom={1} />
          </SnackbarProvider>
        </ThemeProvider>
      </YouTubeIdProvider>
    );
  });
});
