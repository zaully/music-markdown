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
  columns: number;
  transpose: number;
}

interface MarkdownItWithMMD extends MarkdownIt {
  setTranspose: (transpose: number) => void;
  setTheme: (theme: string) => void;
  setMaxWidth: (maxWidth: number) => void;
  meta: {
    youTubeId: string;
  };
}

const MusicMarkdownRender: FC<MusicMarkdownRenderProps> = ({
  source,
  width,
  columns,
  transpose,
}) => {
  const theme = useTheme();
  const { setYouTubeId } = useYouTubeId();
  const [html, setHtml] = useState("");
  const { errorSnackbar } = useSnackbar();
  var oldText: string | null = null
  var sectionHighlighted: HTMLHeadingElement | null = null
  const handleClick = (e: any) => {
    switch (e.detail) {
      case 2:
        const sectionScrollTo = findNextSectionForScroll()
        if (sectionScrollTo != null) {
          let scale = sectionScrollTo!.getBoundingClientRect().height / sectionScrollTo!.offsetHeight
          window.scrollTo({
            behavior: "smooth",
            top: sectionScrollTo!.offsetTop * scale,
          })
        }
        try {
          const anyWin: any = window
          if (anyWin.onscrollend != null) {
            return;
          }
          anyWin.onscrollend = (e: any) => {
            highlightNextSectionForScroll()
          }
        } catch {}
        break;
    }
  };
  const findNextSectionForScroll = () => {
    const sections = document.getElementsByTagName('h2');
    if (sections.length == 0) { return null; }
    let next = sections[0];
    let scale = sections[0].getBoundingClientRect().height / sections[0].offsetHeight;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop * scale + window.innerHeight / 4.0 > window.scrollY + window.innerHeight) {
        break;
      }
      next = sections[i];
    }
    return next;
  }
  const highlightNextSectionForScroll = () => {
    if (sectionHighlighted != null) {
      sectionHighlighted!.textContent = oldText;
    }
    const next = findNextSectionForScroll()
    if (next != null) {
      oldText = next!.textContent;
      next!.textContent = next!.textContent + " <======";
    }
    sectionHighlighted = next;
  }

  useEffect(() => {
    const md = new MarkdownIt({ html: true }).use(
      MarkdownItMusic
    ) as MarkdownItWithMMD;
    md.setTranspose(transpose);
    md.setTheme(theme.palette.mode);
    md.setMaxWidth((width - COLUMN_GAP * (columns - 1)) / columns);
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
    theme.palette.mode,
    errorSnackbar,
  ]);

  // TODO: Replace this hack with an iframe.
  var script = /<script>([.\s\S]*)<\/script>/gm.exec(html);
  if (script) {
    // eslint-disable-next-line no-eval
    window.eval(script[1]);
  }

  /* TODO: Replace this hack with an iframe. */
  return (
    <div
      onClick={handleClick}
      className={`mmd-${theme.palette.mode}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface RenderProps {
  source: string;
  columns: number;
  zoom: number;
  transpose: number;
}

export default function Render(props: RenderProps) {
  const componentRef = useRef(null);
  const { zoom } = props;
  const { width } = useContainerDimensions(componentRef, zoom);

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "0 0",
        width: `${100 / zoom}%`,
      }}
    >
      <DivColumns style={{ columns: props.columns }} ref={componentRef}>
        <MusicMarkdownRender width={width} {...props} />
      </DivColumns>
    </div>
  );
}
