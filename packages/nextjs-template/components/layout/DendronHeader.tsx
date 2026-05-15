import { MenuOutlined } from "@ant-design/icons";
import { Col, Layout, Row } from "antd";
import * as React from "react";
import { useMyceliumContext } from "../../context/useMyceliumContext";
import { MYCELIUM_STYLE_CONSTANTS } from "../../styles/constants";
import MyceliumLogoOrTitle from "../MyceliumLogoOrTitle";
import { MyceliumSearch } from "../MyceliumSearch";

const { Header } = Layout;
const { LAYOUT, HEADER } = MYCELIUM_STYLE_CONSTANTS;

export const MyceliumHeader: React.FC<any> = (props) => {
  const { isResponsive, isSidebarCollapsed, setIsSidebarCollapsed } =
    useMyceliumContext();
  return (
    <Header
      style={{
        position: "fixed",
        isolation: "isolate",
        zIndex: 1,
        width: "100%",
        borderBottom: "1px solid #d4dadf",
        height: HEADER.HEIGHT,
        padding: isResponsive ? 0 : `0 ${LAYOUT.PADDING}px 0 2px`,
      }}
    >
      <Row
        justify="center"
        style={{
          maxWidth: "992px",
          justifyContent: "space-between",
          margin: "0 auto",
        }}
      >
        <Col xs={20} sm={4} style={{ display: "flex" }}>
          <MyceliumLogoOrTitle />
        </Col>
        <Col xs={0} sm={20} md={20} lg={19} className="gutter-row">
          <MyceliumSearch {...props} />
        </Col>
        <Col
          xs={4}
          sm={4}
          md={0}
          lg={0}
          style={{
            display: isResponsive ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MenuOutlined
            style={{ fontSize: 24 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </Col>
      </Row>
    </Header>
  );
};
