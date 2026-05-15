/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { ConfigUtils, MyceliumConfig, NoteProps } from "@myceliumhq/common-all";
import {
  createLogger,
  MyceliumNote,
  LoadingStatus,
} from "@myceliumhq/common-frontend";
import { Col, Row } from "antd";
import _ from "lodash";
import React from "react";
import { MyceliumCollectionItem } from "../components/MyceliumCollection";
import MyceliumCustomHead from "../components/MyceliumCustomHead";
import MyceliumSEO from "../components/MyceliumSEO";
import MyceliumSpinner from "../components/MyceliumSpinner";
import { MyceliumTOC } from "../components/MyceliumTOC";
import { useCombinedDispatch } from "../features";
import { browserEngineSlice } from "../features/engine";
import { MYCELIUM_STYLE_CONSTANTS } from "../styles/constants";
import { useMyceliumRouter } from "../utils/hooks";
import { MermaidScript } from "./MermaidScript";
import { MyceliumNoteGiscusWidget } from "./MyceliumNoteGiscusWidget";

const { HEADER } = MYCELIUM_STYLE_CONSTANTS;

export type MyceliumNotePageProps = {
  // `InferGetStaticPropsType` doesn't get right types for some reason, hence the manual override here
  customHeadContent: string | null;
  noteIndex: NoteProps;
  note: NoteProps;
  body: string;
  collectionChildren: NoteProps[] | null;
  config: MyceliumConfig;
};
let BannerAlert: any | undefined;

export default function Note({
  note,
  body,
  collectionChildren,
  noteIndex,
  customHeadContent,
  config,
}: MyceliumNotePageProps) {
  const logger = createLogger("Note");
  const { getActiveNoteId } = useMyceliumRouter();
  const [bodyFromState, setBody] = React.useState<string | undefined>(
    undefined
  );
  let id = getActiveNoteId();
  if (id === "root") {
    id = noteIndex.id;
  }

  React.useEffect(() => {
    const BannerFile =
      ConfigUtils.getPublishing(config).siteBanner === "custom"
        ? "BannerAlert.tsx"
        : "NoOp";
    logger.info({ ctx: "loading banner", BannerFile });
    BannerAlert = require(`../custom/${BannerFile}`).default;
  }, []);

  // --- Hooks
  const dispatch = useCombinedDispatch();
  logger.info({ ctx: "enter", id });

  // setup body
  React.useEffect(() => {
    logger.info({ ctx: "updateNoteBody:enter", id });
    if (_.isUndefined(id)) {
      logger.info({ ctx: "updateNoteBody:exit", id, state: "id undefined" });
      return;
    }
    // loaded page statically
    if (id === note.id) {
      dispatch(
        browserEngineSlice.actions.setLoadingStatus(LoadingStatus.FULFILLED)
      );
      logger.info({ ctx: "updateNoteBody:exit", id, state: "id = note.id" });
      return;
    }
    logger.info({ ctx: "updateNoteBody:fetch:pre", id });
    // otherwise, dynamically fetch page
    fetch(`/data/notes/${id}.html`).then(async (resp) => {
      logger.info({ ctx: "updateNoteBody:fetch:post", id });
      const contents = await resp.text();
      setBody(contents);
      dispatch(
        browserEngineSlice.actions.setLoadingStatus(LoadingStatus.FULFILLED)
      );
    });
  }, [id]);

  const noteBody = id === note.id ? body : bodyFromState;

  if (_.isUndefined(noteBody)) {
    return <MyceliumSpinner />;
  }

  const maybeCollection =
    note.custom?.has_collection && !_.isNull(collectionChildren)
      ? collectionChildren.map((child: NoteProps) => (
          <MyceliumCollectionItem
            key={child.id}
            note={child}
            noteIndex={noteIndex}
          />
        ))
      : null;

  return (
    <>
      <MermaidScript noteBody={noteBody} />
      <MyceliumSEO note={note} config={config} />
      {customHeadContent && <MyceliumCustomHead content={customHeadContent} />}
      <Row>
        <Col span={24}>
          <Row gutter={20}>
            <Col xs={24} md={18}>
              {BannerAlert && <BannerAlert />}
              <MyceliumNote noteContent={noteBody} />
              {maybeCollection}
              <MyceliumNoteGiscusWidget note={note} config={config} />
            </Col>
            <Col xs={0} md={6}>
              <MyceliumTOC note={note} offsetTop={HEADER.HEIGHT} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
