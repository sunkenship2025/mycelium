import React from "react";
import { Divider } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { MyceliumBreadCrumb } from "../MyceliumBreadCrumb";
import { FooterText } from "../MyceliumNoteFooter";
import { MYCELIUM_STYLE_CONSTANTS } from "../../styles/constants";
import { useMyceliumContext } from "../../context/useMyceliumContext";

const { LAYOUT } = MYCELIUM_STYLE_CONSTANTS;

export const MyceliumContent: React.FC<any> = (props) => {
  const { isResponsive, isSidebarCollapsed } = useMyceliumContext();
  return (
    <Content
      className="side-layout-main"
      style={{
        maxWidth: "1200px",
        minWidth: 0,
        display: !isSidebarCollapsed && isResponsive ? "none" : "block",
      }}
    >
      <div style={{ padding: `0 ${LAYOUT.PADDING}px` }}>
        <MyceliumBreadCrumb {...props} />
        <div className="main-content" role="main">
          {props.children}
        </div>
      </div>
      <Divider />
      <Footer
        style={{
          padding: `0 ${LAYOUT.PADDING}px ${LAYOUT.PADDING}px`,
        }}
      >
        <FooterText />
      </Footer>
    </Content>
  );
};
