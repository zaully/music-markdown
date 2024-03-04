import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import MarkdownIt from "markdown-it";
import MarkdownItMusic from "markdown-it-music";
import { FC, useEffect, useRef, useState } from "react";
import { useSnackbar } from "../../context/SnackbarProvider";
import { useYouTubeId } from "../../context/YouTubeIdProvider";
import { useContainerDimensions } from "../../lib/hooks";

const COLUMN_GAP = 20;

const DivColumns = styled("div")(({ theme }) => ({
  columnGap: `${COLUMN_GAP}px`,
  columnRuleWidth: "1px",
  columnRuleStyle: "dashed",
  columnRuleColor: theme.palette.text.secondary,
}));

interface MusicMarkdownRenderProps {
  source: string;
  width: number;
  columns: string;
  transpose: number;
  instrumentsConfig: InstrumentsConfig;
}

interface MarkdownItWithMMD extends MarkdownIt {
  setTranspose: (transpose: number) => void;
  setTheme: (theme: string) => void;
  setMaxWidth: (maxWidth: number) => void;
  setInstrumentsConfig: (instrumentsConfig: InstrumentsConfig) => void;
  meta: {
    youTubeId: string;
  };
}

const MusicMarkdownRender: FC<MusicMarkdownRenderProps> = ({
  source,
  width,
  columns,
  transpose,
  instrumentsConfig,
}) => {
  const theme = useTheme();
  const { setYouTubeId } = useYouTubeId();
  const [html, setHtml] = useState("");
  const { errorSnackbar } = useSnackbar();
  const handleClick = (e: any) => {
    switch (e.detail) {
      case 2:
        window.scrollBy({
          behavior: "smooth",
          top: window.innerHeight * 0.8
        })
        break;
    }
  };

  useEffect(() => {
    const md = new MarkdownIt({ html: true }).use(
      MarkdownItMusic
    ) as MarkdownItWithMMD;
    md.setTranspose(transpose);
    md.setTheme(theme.palette.mode);
    const columnsNumber: number = +columns.replace(/[^0-9]/g, '');
    md.setMaxWidth((width - COLUMN_GAP * (columnsNumber - 1)) / columnsNumber);
    md.setInstrumentsConfig(instrumentsConfig);
    try {
      setHtml(md.render(source));
      setYouTubeId(md.meta.youTubeId);
    } catch (err: any) {
      console.log(err);
      setHtml(`<pre>${source}</pre>`);
      errorSnackbar(err.message);
    }
  }, [
    setYouTubeId,
    source,
    width,
    columns,
    transpose,
    instrumentsConfig,
    theme.palette.mode,
    errorSnackbar,
  ]);

  // TODO: Replace this hack with an iframe.
  var script = /<script>([.\s\S]*)<\/script>/gm.exec(html);
  if (script) {
    // eslint-disable-next-line no-eval
    window.eval(script[1]);
  }

  const scrollDirection = columns.replace(/[0-9]/g, '');
  /* TODO: Replace this hack with an iframe. */
  if (scrollDirection.length == 0) {
    return (
      <div
        onClick={handleClick}
        className={`mmd-${theme.palette.mode}`}
        style={{
          flexDirection: "column",
          columnGap: "20px",
          display: "flex",
          alignContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "wrap",
          height: "100vh",
          scrollSnapType: "x mandatory",
          overflowX: "auto",
          overflowY: "hidden"
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <div
      onClick={handleClick}
      className={`mmd-${theme.palette.mode}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export interface InstrumentsConfig {
  instrumentsToRender: Set<string>;
  instrumentsSupported: Set<string>;
}

interface RenderProps {
  source: string;
  columns: string;
  zoom: number;
  transpose: number;
  instrumentsConfig: InstrumentsConfig;
}

export function Render(props: RenderProps) {
  const componentRef = useRef(null);
  const { zoom } = props;
  const { width } = useContainerDimensions(componentRef, zoom);

  const scrollDirection = props.columns.replace(/[0-9]/g, '');

  if (scrollDirection.length == 0) {
    return (
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          width: `${100 / zoom}%`,
        }}
      >
      <DivColumns ref={componentRef} style={{
        overflowY: "hidden",
        overflowX: "auto"
      }}>
        <MusicMarkdownRender width={width} {...props} />
      </DivColumns>
      </div>
    );
  }
  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "0 0",
        width: `${100 / zoom}%`,
      }}
    >
    <DivColumns ref={componentRef}>
      <MusicMarkdownRender width={width} {...props} />
    </DivColumns>
    </div>
  );
}
