import { MyceliumUserSpecial } from "./types";
import { DVault } from "./types/DVault";

export class DUser {
  public username: string;
  constructor(username: string) {
    this.username = username;
  }

  static createAnonymous() {
    return new DUser(MyceliumUserSpecial.anonymous);
  }

  canPushVault(vault: DVault) {
    if (vault.noAutoPush) {
      return false;
    }
    if (!vault.userPermission) {
      return true;
    }
    if (
      vault.userPermission.write[0] === MyceliumUserSpecial.everyone ||
      vault.userPermission.write.includes(this.username)
    ) {
      return true;
    }
    return false;
  }
}
