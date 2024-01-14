
import { createContext, FC, useContext } from "react";
import { useLocalStorage, useRouteParams } from "../lib/hooks";

export interface InstrumentToRender {
  name: string;
  code: string;
  rendering?: boolean;
}

interface GlobalUserPref {
  instruments?: InstrumentToRender[];
  zoom?: number;
}

interface GlobalUserPrefs {
  [string: string]: GlobalUserPref;
}

interface GlobalUserPrefsContextValue {
  globalUserPrefs: GlobalUserPrefs;
  setGlobalUserPrefs: (globalUserPrefs: Record<string, GlobalUserPref>) => void;
}

const GlobalUserPrefsContext = createContext<GlobalUserPrefsContextValue>({
  globalUserPrefs: {},
  setGlobalUserPrefs: () => {},
});

export const useGlobalUserPrefs = () => useContext(GlobalUserPrefsContext);

interface GlobalUserPrefsProviderProps {
  children: React.ReactNode;
}

export const GlobalUserPrefsProvider: FC<GlobalUserPrefsProviderProps> = ({ children }) => {
  const [globalUserPrefs, setGlobalUserPrefs] = useLocalStorage("globalUserPrefs", {});

  return (
    <GlobalUserPrefsContext.Provider value={{ globalUserPrefs, setGlobalUserPrefs }}>
      {children}
    </GlobalUserPrefsContext.Provider>
  );
};

function updateInstrumentsToRender(
  prevGlobalUserPrefs: GlobalUserPrefs,
  newVal?: InstrumentToRender[],
  defaultVal?: InstrumentToRender[]
) {
  const prefs = { ...prevGlobalUserPrefs };
  const prefConfig = prefs["prefs"] || {};

  if (newVal === defaultVal) {
    delete prefConfig.instruments;
  } else {
    prefConfig.instruments = newVal;
    prefs["prefs"] = prefConfig;
  }
  if (Object.keys(prefConfig).length === 0) {
    delete prefs["prefs"];
  }
  return prefs;
}

function updateZoom(
  prevGlobalUserPrefs: GlobalUserPrefs,
  newVal: number,
  defaultVal: number
) {
  const prefs = { ...prevGlobalUserPrefs };
  const prefConfig = prefs["prefs"] || {};

  if (newVal === defaultVal) {
    delete prefConfig.zoom;
  } else {
    prefConfig.zoom = newVal;
    prefs["prefs"] = prefConfig;
  }
  if (Object.keys(prefConfig).length === 0) {
    delete prefs["prefs"];
  }
  return prefs;
}

export function useGlobalUser() {
  const { repo, branch } = useRouteParams();
  return `${repo}/${branch}globalUser`;
}

export function useGlobalUserPrefZoom(): [number, (newValue: number) => void] {
  const { globalUserPrefs, setGlobalUserPrefs } = useGlobalUserPrefs();
  const globalUserPrefsConfig = globalUserPrefs["prefs"] || {};

  const fieldValue = globalUserPrefsConfig.zoom || 1;
  const setFieldValue = (newValue: number) =>
    setGlobalUserPrefs(updateZoom(globalUserPrefs, newValue, 1));

  return [fieldValue, setFieldValue];
}

export function useGlobalUserPrefInstrumentsToRender(
  defaultValue?: InstrumentToRender[]
): [InstrumentToRender[], (newValue: InstrumentToRender[]) => void] {
  const { globalUserPrefs, setGlobalUserPrefs } = useGlobalUserPrefs();
  const globalUserPrefsConfig = globalUserPrefs["prefs"] || {};

  const defaultInstruments = [
    {name: "Lyrics", code: "l1", rendering: true},
    {name: "Notes", code: "l2", rendering: true},
    {name: "Gt.", code: "l3", rendering: true},
    {name: "Kb.", code: "l4", rendering: true},
    {name: "Ba.", code: "l5", rendering: true},
    {name: "Dr.", code: "l6", rendering: true},
    {name: "Alt.", code: "l7", rendering: true}
  ];

  let fieldValue = globalUserPrefsConfig.instruments
  if (fieldValue == null || fieldValue.length !== defaultInstruments.length) {
    fieldValue = defaultInstruments;
  }
  const setFieldValue = (newValue: InstrumentToRender[]) => {
    setGlobalUserPrefs(updateInstrumentsToRender(globalUserPrefs, newValue, defaultValue));
  }

  return [fieldValue, setFieldValue];
}
