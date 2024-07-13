import styled from "@emotion/styled";
import LinearProgress from "@mui/material/LinearProgress";
import { useFileContent } from "../../context/GitHubApiProvider";
import {
  useTranspose,
} from "../../context/SongPrefsProvider";
import { useRouteParams } from "../../lib/hooks";
import { Render, InstrumentsConfig } from "./Render";
import { useGlobalUserPrefInstrumentsToRender, useGlobalUserPrefZoom, useGlobalUserPrefColumns } from "../../context/GlobalUserPrefProvider";
import DirectoryBreadcrumbs from "../DirectoryBreadcrumbs";
import { Height } from "@mui/icons-material";

const DivRoot = styled("div")({
  flexGrow: 1,
  padding: 8
});

export default function View() {
  const { repo, path, branch } = useRouteParams();
  const { loading, content } = useFileContent(repo, path, branch);
  const { transpose } = useTranspose();
  const [zoom] = useGlobalUserPrefZoom();
  const [columns] = useGlobalUserPrefColumns();
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
  const scrollDirection = columns.replace(/[0-9]/g, '');
  if (scrollDirection.length === 0) {
    return (
      <>
        <DirectoryBreadcrumbs />
        <DivRoot style={{height: `${window.innerHeight - 124}px`}}>
          <Render
            source={content}
            columns={columns}
            transpose={transpose}
            zoom={zoom}
            instrumentsConfig={config}
          />
        </DivRoot>
      </>
    );
  }

  return (
    <>
      <DirectoryBreadcrumbs />
      <DivRoot>
        <Render
          source={content}
          columns={columns}
          transpose={transpose}
          zoom={zoom}
          instrumentsConfig={config}
        />
      </DivRoot>
    </>
  );
}
