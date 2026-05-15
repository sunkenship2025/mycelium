import * as React from "react";
import MyceliumSideBar from "./layout/MyceliumSidebar";
import { MyceliumCommonProps } from "../utils/types";
import { MyceliumContent } from "./layout/MyceliumContent";
import { MyceliumHeader } from "./layout/MyceliumHeader";
import { Layout } from "antd";

export default function MyceliumLayout(
  props: React.PropsWithChildren<MyceliumCommonProps>
) {
  return (
    <Layout
      style={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      <MyceliumHeader {...props} />
      <Layout
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <MyceliumSideBar {...props} />
        <MyceliumContent {...props} />
      </Layout>
    </Layout>
  );
}
