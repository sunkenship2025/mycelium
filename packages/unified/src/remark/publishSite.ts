import { NoteProps } from "@myceliumhq/common-all";
import Unified, { Transformer } from "unified";
import { Node } from "unist";
import visit from "unist-util-visit";
import { VFile } from "vfile";
import { MyceliumASTDest, WikiLinkNoteV4, MyceliumASTTypes } from "../types";
import { PublishUtils } from "../utils";
import { MDUtilsV5 } from "../utilsv5";

type PluginOpts = {
  noteIndex: NoteProps;
};

/**
 * Used when publishing
 * Rewrite index note
 */
function plugin(this: Unified.Processor, opts: PluginOpts): Transformer {
  const proc = this;
  const { dest, config } = MDUtilsV5.getProcData(proc);
  function transformer(tree: Node, _file: VFile) {
    if (dest !== MyceliumASTDest.HTML) {
      return;
    }
    visit(tree, (node, _idx, _parent) => {
      if (node.type === MyceliumASTTypes.WIKI_LINK) {
        const cnode = node as WikiLinkNoteV4;
        const value = cnode.value;
        const href = PublishUtils.getSiteUrl(config);
        if (value === opts.noteIndex.fname) {
          node.data!.hProperties = { href };
        }
      }
    });
    return tree;
  }
  return transformer;
}

export { plugin as publishSite };
export { PluginOpts as PublishSiteOpts };
