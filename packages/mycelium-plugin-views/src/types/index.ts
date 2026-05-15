import {
  engineSlice,
  ideSlice,
  WorkspaceProps,
} from "@myceliumhq/common-frontend";

export type { WorkspaceProps };

export type MyceliumComponent = React.FunctionComponent<MyceliumProps>;

export type MyceliumProps = {
  engine: engineSlice.EngineState;
  ide: ideSlice.IDEState;
  workspace: WorkspaceProps;
  isSidePanel?: boolean;
};
