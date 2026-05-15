import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import MyceliumApp, { MyceliumAppProps } from "./components/MyceliumApp";
import { MyceliumComponent } from "./types";

function renderWithMyceliumApp(props: MyceliumAppProps) {
  return <MyceliumApp {...props} />;
}

/**
 * Render standalone react app
 * @param opts.padding: override default padding
 */
export function renderOnDOM(
  Component: MyceliumComponent,
  opts: MyceliumAppProps["opts"]
) {
  ReactDOM.render(
    <React.StrictMode>
      {renderWithMyceliumApp({ Component, opts })}
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
