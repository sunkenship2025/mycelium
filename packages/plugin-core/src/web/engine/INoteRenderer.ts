import { RenderNoteOpts, RenderNoteResp } from "@myceliumhq/common-all";

/**
 * Extracted from DEngine
 */
export interface INoteRenderer {
  renderNote(opts: RenderNoteOpts): Promise<RenderNoteResp>;
}
