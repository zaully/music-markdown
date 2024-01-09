import styled from "@emotion/styled";
import LinearProgress from "@mui/material/LinearProgress";
import { useFileContent } from "../../context/GitHubApiProvider";
import {
  useColumns,
  useTranspose,
} from "../../context/SongPrefsProvider";
import { useRouteParams } from "../../lib/hooks";
import Render from "./Render";
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

  const toRender = new Set<string>()
  for (let i = 0; i < instruments.length; i++) {
    if (instruments[i].rendering) {
      toRender.add(instruments[i].code);
    }
  }

  return (
    <DivRoot>
      <Render
        source={content}
        columns={columns}
        transpose={transpose}
        zoom={zoom}
        instruments={toRender}
      />
    </DivRoot>
  );
}
