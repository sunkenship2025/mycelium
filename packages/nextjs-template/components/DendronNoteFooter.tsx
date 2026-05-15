/* eslint-disable */
import { ConfigUtils, Time, GitUtils } from "@myceliumhq/common-all";
import { Row, Col, Typography } from "antd";
import _ from "lodash";
import React from "react";
import { useEngineAppSelector } from "../features/engine/hooks";
import { useMyceliumRouter, useNoteActive } from "../utils/hooks";

const { Text, Link } = Typography;

const ms2ShortDate = (ts: number) => {
  const dt = Time.DateTime.fromMillis(ts);
  return dt.toLocaleString(Time.DateTime.DATE_SHORT);
};

export function FooterText() {
  const myceliumRouter = useMyceliumRouter();
  const engine = useEngineAppSelector((state) => state.engine);
  const { noteActive } = useNoteActive(myceliumRouter.getActiveNoteId());
  const { config } = engine;

  // Sanity check
  if (!noteActive || !config) {
    return null;
  }

  const siteLastModified = ConfigUtils.getSiteLastModified(config);
  const githubConfig = ConfigUtils.getGithubConfig(config);

  const lastUpdated = ms2ShortDate(noteActive.updated);
  return (
    <Row>
      <Row>
        <Col sm={24} md={14}>
          {siteLastModified && (
            <Text type="secondary">
              Page last modified: {lastUpdated} {"   "}
            </Text>
          )}
        </Col>
        <Col sm={24} md={12}>
          {GitUtils.canShowGitLink({ config, note: noteActive }) && (
            <Link
              href={GitUtils.githubUrl({ note: noteActive, config })}
              target="_blank"
            >
              {githubConfig?.editLinkText}
            </Link>
          )}
        </Col>
      </Row>
      <Col sm={24} md={12} style={{ textAlign: "right" }}>
        <Text>
          {" "}
          🌱 with 💕 using{" "}
          <Link href="https://www.mycelium.so/" target="_blank">
            Mycelium 🌲
          </Link>
        </Text>
      </Col>
    </Row>
  );
}
