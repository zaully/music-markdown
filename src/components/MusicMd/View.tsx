import styled from "@emotion/styled";
import LinearProgress from "@mui/material/LinearProgress";
import { useFileContent } from "../../context/GitHubApiProvider";
import {
  useColumns,
  useTranspose,
} from "../../context/SongPrefsProvider";
import { useRouteParams } from "../../lib/hooks";
import { Render, InstrumentsConfig } from "./Render";
import { useGlobalUserPrefInstrumentsToRender, useGlobalUserPrefZoom } from "../../context/GlobalUserPrefProvider";

const DivRoot = styled("div")({
  flexGrow: 1,
  padding: 8,
});

export default function View() {
  const { repo, path, branch } = useRouteParams();
  const { loading, content } = useFileContent(repo, path, branch);
  const { columns } = useColumns();
  const { transpose } = useTranspose();
  const [zoom] = useGlobalUserPrefZoom();
  const [instruments] = useGlobalUserPrefInstrumentsToRender();

  if (loading) {
    return <LinearProgress />;
  }

  const rendering = new Set<string>()
  const supported = new Set<string>()
  for (const instrument of instruments) {
    if (instrument.rendering) {
      rendering.add(instrument.code);
    }
    supported.add(instrument.code);
  }

  const config: InstrumentsConfig = {
    instrumentsToRender: rendering,
    instrumentsSupported: supported
  }

  return (
    <DivRoot>
      <Render
        source={content}
        columns={columns}
        transpose={transpose}
        zoom={zoom}
        instrumentsConfig={config}
      />
    </DivRoot>
  );
}
