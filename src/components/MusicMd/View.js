import LinearProgress from "@mui/material/LinearProgress";
import makeStyles from "@mui/styles/makeStyles";
import { useParams } from "react-router-dom";
import { useContents } from "../../context/GitHubApiProvider";
import {
  useColumns,
  useTranspose,
  useZoom,
} from "../../context/SongPrefsProvider";
import Render from "./Render";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: 8,
  },
});

export default function View({ location }) {
  const classes = useStyles();
  const { repo, path, branch } = useParams();
  const { loading, content } = useContents(repo, path, branch);
  const { columns } = useColumns();
  const { transpose } = useTranspose();
  const { zoom } = useZoom();

  // const params = queryString.parse(location.search);
  // const transpose = Number(params[TRANSPOSE_QUERY_KEY]) || 0;

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      <Render
        source={content}
        columns={columns}
        transpose={transpose}
        zoom={zoom}
      />
    </div>
  );
}