import queryString from "query-string";
import { createContext, FC, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage, useRouteParams } from "../lib/hooks";

interface SongPref {
  columns: string;
  transpose: string;
  zoom?: number;
}

interface SongPrefs {
  [song: string]: SongPref;
}

interface SongPrefsContextValue {
  songPrefs: SongPrefs;
  setSongPrefs: (songPrefs: Record<string, SongPref>) => void;
}

const SongPrefsContext = createContext<SongPrefsContextValue>({
  songPrefs: {},
  setSongPrefs: () => {},
});

export const useSongPrefs = () => useContext(SongPrefsContext);

interface SongPrefsProviderProps {
  children: React.ReactNode;
}

export const SongPrefsProvider: FC<SongPrefsProviderProps> = ({ children }) => {
  const [songPrefs, setSongPrefs] = useLocalStorage("songPrefs", {});

  return (
    <SongPrefsContext.Provider value={{ songPrefs, setSongPrefs }}>
      {children}
    </SongPrefsContext.Provider>
  );
};

function update(
  prevSongPrefs: SongPrefs,
  song: string,
  field: "zoom",
  newVal: number,
  defaultVal: number
) {
  const songPrefs = { ...prevSongPrefs };
  const songPref = songPrefs[song] || {};

  if (newVal === defaultVal) {
    delete songPref[field];
  } else {
    songPref[field] = newVal;
    songPrefs[song] = songPref;
  }
  if (Object.keys(songPref).length === 0) {
    delete songPrefs[song];
  }
  return songPrefs;
}

function updateString(
  prevSongPrefs: SongPrefs,
  song: string,
  field: "transpose" | "columns",
  newVal: string,
  defaultVal: string
) {
  const songPrefs = { ...prevSongPrefs };
  const songPref = songPrefs[song] || {};

  if (newVal === defaultVal) {
    delete songPref[field];
  } else {
    songPref[field] = newVal;
    songPrefs[song] = songPref;
  }
  if (Object.keys(songPref).length === 0) {
    delete songPrefs[song];
  }
  return songPrefs;
}

export function useSong() {
  const { repo, branch, path } = useRouteParams();
  return `${repo}/${branch}/${path}`;
}

export function useSongPref(
  fieldName: "zoom",
  defaultValue: number
): [number, (newValue: number) => void] {
  const { songPrefs, setSongPrefs } = useSongPrefs();
  const song = useSong();
  const songPref = songPrefs[song] || {};

  const fieldValue = songPref[fieldName] || defaultValue;
  const setFieldValue = (newValue: number) =>
    setSongPrefs(update(songPrefs, song, fieldName, newValue, defaultValue));

  return [fieldValue, setFieldValue];
}

export function useSongPrefString(
  fieldName: "columns" | "transpose",
  defaultValue: string
): [string, (newValue: string) => void] {
  const { songPrefs, setSongPrefs } = useSongPrefs();
  const song = useSong();
  const songPref = songPrefs[song] || {};

  const fieldValue = songPref[fieldName] || defaultValue;
  const setFieldValue = (newValue: string) =>
    setSongPrefs(updateString(songPrefs, song, fieldName, newValue, defaultValue));

  return [fieldValue, setFieldValue];
}

export function useColumns() {
  const [columns, setColumns] = useSongPrefString("columns", "1");
  return { columns, setColumns };
}

function useTransposeQuery(): [string, (transpose: string) => void] {
  const { search } = useLocation();
  const history = useHistory();
  const params = queryString.parse(search);
  const transposeQuery = String(params["transpose"]);

  const setTransposeQuery = (transpose: string) => {
    params["transpose"] = String(transpose);
    history.replace({ search: queryString.stringify(params) });
  };

  return [transposeQuery, setTransposeQuery];
}

export function useTranspose() {
  const [transposeQuery, setTransposeQuery] = useTransposeQuery();
  const [transposePref, setTransposePref] = useSongPrefString("transpose", "0");

  const setTranspose = (transpose: string) => {
    setTransposeQuery(transpose);
    setTransposePref(transpose);
  };

  useEffect(() => {
    const transposeNumber: number = +transposeQuery.replace(/[^0-9-]/g, '');
    const transposeSharpFlatPref: string = transposeQuery.replace(/[0-9-]/g, '');
    if (Math.abs(transposeNumber) > 12 || (transposeSharpFlatPref !== '#' && transposeSharpFlatPref !== 'b' && transposeSharpFlatPref !== '')) {
      setTransposeQuery(transposePref);
    } else if (transposeQuery !== transposePref) {
      setTransposePref(transposeQuery);
    }
  }, [setTransposePref, setTransposeQuery, transposePref, transposeQuery]);

  return { transpose: transposePref, setTranspose };
}

export function useZoom() {
  const [zoom, setZoom] = useSongPref("zoom", 1);
  return { zoom, setZoom };
}
