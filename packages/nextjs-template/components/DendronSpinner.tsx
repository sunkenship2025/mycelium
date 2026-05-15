import { Spin } from "antd";
import React from "react";

/**
 * Normal Spinner. Will add custom logic in the future
 * @param props
 * @returns
 */
export default function MyceliumSpinner() {
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpinner(true);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);
  if (showSpinner) {
    return <Spin />;
  }
  return null;
}
