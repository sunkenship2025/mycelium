import React from "react";
import Sider from "antd/lib/layout/Sider";
import { useMyceliumContext } from "../../context/useMyceliumContext";
import { MYCELIUM_STYLE_CONSTANTS } from "../../styles/constants";
import { MyceliumSearch } from "../MyceliumSearch";
import MyceliumTreeMenu from "../MyceliumTreeMenu";

const { LAYOUT, HEADER, SIDER } = MYCELIUM_STYLE_CONSTANTS;

export const MyceliumSideBar: React.FC<any> = (props) => {
  const {
    isResponsive,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setResponsive,
  } = useMyceliumContext();
  return (
    <div
      className="site-layout-sidebar"
      style={{
        flex: "0 0 auto",
        width: `calc(max((100% - ${LAYOUT.BREAKPOINTS.lg}) / 2, 0px) + ${
          // eslint-disable-next-line no-nested-ternary
          isResponsive
            ? isSidebarCollapsed
              ? SIDER.COLLAPSED_WIDTH
              : "100%"
            : SIDER.WIDTH
        }px)`,
        minWidth: isResponsive || isSidebarCollapsed ? 0 : SIDER.WIDTH,
        paddingLeft: `calc((100% - ${LAYOUT.BREAKPOINTS.lg}) / 2)`,
      }}
    >
      <Sider
        width={isResponsive ? "100%" : SIDER.WIDTH}
        collapsible
        collapsed={isSidebarCollapsed && isResponsive}
        collapsedWidth={SIDER.COLLAPSED_WIDTH}
        onCollapse={(collapsed) => {
          setIsSidebarCollapsed(collapsed);
        }}
        breakpoint="sm"
        onBreakpoint={(broken) => {
          setResponsive(broken);
        }}
        style={{
          position: "fixed",
          overflow: "auto",
          height: `calc(100vh - ${HEADER.HEIGHT}px)`,
          backgroundColor: `transparent`,
        }}
        trigger={null}
      >
        {isResponsive && (
          <div style={{ padding: 16 }}>
            <MyceliumSearch {...props} />
          </div>
        )}
        <MyceliumTreeMenu
          {...props}
          collapsed={isSidebarCollapsed && isResponsive}
          setCollapsed={setIsSidebarCollapsed}
        />
      </Sider>
    </div>
  );
};

export default MyceliumSideBar;
