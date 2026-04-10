import { DStore } from "@myceliumhq/common-all";
import { DLogger } from "@myceliumhq/common-server";

export class ParserBase {
  constructor(public opts: { store: DStore; logger: DLogger }) {}

  get logger() {
    return this.opts.logger;
  }
}
