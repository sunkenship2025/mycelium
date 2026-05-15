import { MyceliumComponent } from "../types";
import MyceliumGraphPanel from "./MyceliumGraphPanel";

/**
 * Wrapper component around MyceliumGraphPanel
 * @param props
 * @returns MyceliumGraphPanel component with ide.isSidePanel set to true
 */
const MyceliumSideGraphPanel: MyceliumComponent = (props) => {
  props = {
    ...props,
    isSidePanel: true,
  };
  return <MyceliumGraphPanel {...props} />;
};
export default MyceliumSideGraphPanel;
