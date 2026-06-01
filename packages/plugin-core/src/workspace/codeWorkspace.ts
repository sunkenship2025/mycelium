import { DWorkspaceV2, WorkspaceType } from "@myceliumhq/common-all";
import { MyceliumBaseWorkspace } from "./baseWorkspace";

export class MyceliumCodeWorkspace
  extends MyceliumBaseWorkspace
  implements DWorkspaceV2
{
  public type = WorkspaceType.CODE;
}
