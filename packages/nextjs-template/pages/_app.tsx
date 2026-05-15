import {
  ConfigUtils,
  CONSTANTS,
  MyceliumConfig,
  NoteProps,
  Theme,
} from "@myceliumhq/common-all";
import {
  batch,
  createLogger,
  ideSlice,
  Provider,
  setLogLevel,
} from "@myceliumhq/common-frontend";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { useMyceliumGATracking } from "../components/MyceliumGATracking";
import MyceliumLayout from "../components/MyceliumLayout";
import { MyceliumRef } from "../components/MyceliumRef";
import MyceliumProvider from "../context/MyceliumProvider";
import { combinedStore, useCombinedDispatch } from "../features";
import { browserEngineSlice } from "../features/engine";
import { useIFrameHeightAdjuster } from "../hooks/useIFrameHeightAdjuster";
import "../public/assets-mycelium/css/light.css";
import "../styles/scss/main-nextjs.scss";
import { getLogLevel } from "../utils/etc";
import { fetchConfig, fetchNotes, fetchTreeMenu } from "../utils/fetchers";
import { useMyceliumRouter } from "../utils/hooks";
import { getAssetUrl } from "../utils/links";
import { NoteData } from "../utils/types";

const themes: { [key in Theme]: string } = {
  dark: getAssetUrl(`/assets-mycelium/css/dark.css`),
  light: getAssetUrl(`/assets-mycelium/css/light.css`),
  custom: getAssetUrl(`/themes/${CONSTANTS.CUSTOM_THEME_CSS}`),
};

type PageProps = {
  noteIndex: NoteProps;
  config: MyceliumConfig;
  body?: string;
  note?: NoteProps;
};

function AppContainer(appProps: AppProps & { pageProps: PageProps }) {
  const { config } = appProps.pageProps;
  const logger = createLogger("AppContainer");
  useEffect(() => {
    const logLevel = getLogLevel();
    setLogLevel(logLevel);
  }, []);

  const router = useRouter();

  const defaultTheme = ConfigUtils.getPublishing(config).theme || Theme.LIGHT;
  logger.info({ ctx: "enter", defaultTheme });
  const body = appProps.pageProps.body ?? "";
  if (router.pathname === "/refs/[id]") {
    return (
      <Provider store={combinedStore}>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={defaultTheme}>
          <MyceliumRef body={body} />
        </ThemeSwitcherProvider>
      </Provider>
    );
  }

  return (
    <Provider store={combinedStore}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={defaultTheme}>
        <MyceliumApp {...appProps} />
      </ThemeSwitcherProvider>
    </Provider>
  );
}

function MyceliumApp({
  Component,
  pageProps,
}: AppProps & { pageProps: PageProps }) {
  const [noteData, setNoteData] = useState<NoteData>();
  const logger = createLogger("App");
  const myceliumRouter = useMyceliumRouter();
  const dispatch = useCombinedDispatch();
  useMyceliumGATracking();
  useIFrameHeightAdjuster();

  useEffect(() => {
    (async () => {
      const data = await fetchTreeMenu();
      dispatch(ideSlice.actions.setTree(data));
      logger.info({ ctx: "fetchTree:got-data", data });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      logger.info({ ctx: "fetchNotes:pre" });
      const data = await fetchNotes();
      logger.info({ ctx: "fetchNotes:got-data" });
      setNoteData(data);
      batch(() => {
        dispatch(browserEngineSlice.actions.setNotes(data.notes));
        dispatch(browserEngineSlice.actions.setNoteIndex(data.noteIndex));
      });
      const config = await fetchConfig();
      logger.info({ ctx: "fetchConfig:got-data" });
      dispatch(browserEngineSlice.actions.setConfig(config));
    })();
  }, []);

  logger.info({ ctx: "render" });

  return (
    // @ts-ignore
    <MyceliumProvider>
      <MyceliumLayout
        {...noteData}
        noteIndex={pageProps.noteIndex}
        myceliumRouter={myceliumRouter}
        note={pageProps.note}
      >
        <Head>
          <link rel="icon" href={getAssetUrl("/favicon.ico")} />
        </Head>
        <Component
          {...pageProps}
          notes={noteData}
          myceliumRouter={myceliumRouter}
        />
      </MyceliumLayout>
    </MyceliumProvider>
  );
}

export default AppContainer;
