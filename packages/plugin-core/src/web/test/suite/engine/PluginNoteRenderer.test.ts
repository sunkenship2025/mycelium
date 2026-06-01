import {
  MyceliumConfig,
  MyceliumPublishingConfig,
  DVault,
  NoteProps,
} from "@myceliumhq/common-all";
import assert from "assert";
import { container } from "tsyringe";
import { MyceliumEngineV3Web } from "../../../engine/MyceliumEngineV3Web";
import { PluginNoteRenderer } from "../../../engine/PluginNoteRenderer";
import { setupTestEngineContainer } from "../../helpers/setupTestEngineContainer";

async function initializeTest(): Promise<PluginNoteRenderer> {
  const pubConfig: MyceliumPublishingConfig = {
    copyAssets: false,
    siteHierarchies: [],
    enableSiteLastModified: false,
    siteRootDir: "",
    enableFrontmatterTags: false,
    enableHashesForFMTags: false,
    writeStubs: false,
    seo: {
      title: undefined,
      description: undefined,
      author: undefined,
      twitter: undefined,
      image: undefined,
    },
    github: {
      cname: undefined,
      enableEditLink: false,
      editLinkText: undefined,
      editBranch: undefined,
      editViewMode: undefined,
      editRepository: undefined,
    },
    enablePrettyLinks: false,
  };

  const config: MyceliumConfig = {
    version: 5,
    publishing: pubConfig,
  } as MyceliumConfig;

  await setupTestEngineContainer();

  const engine = container.resolve(MyceliumEngineV3Web);

  await engine.init();

  return new PluginNoteRenderer(config, engine, []);
}

suite("GIVEN a PluginNoteRenderer", () => {
  test("WHEN a basic note is rendered THEN the right HTML is returned", async () => {
    const renderer = await initializeTest();

    const vault: DVault = {
      fsPath: "foo",
    };

    const testNote: NoteProps = {
      fname: "foo",
      id: "foo",
      title: "foo",
      desc: "foo",
      links: [],
      anchors: {},
      type: "note",
      updated: 1,
      created: 1,
      parent: "root",
      children: [],
      data: "test_data",
      body: "this is the body",
      vault,
    } as NoteProps;

    const result = await renderer.renderNote({ id: "foo", note: testNote });
    assert.strictEqual(
      result.data,
      '<h1 id="foo">foo</h1>\n<p>this is the body</p>'
    );
  });

  test("WHEN a wikilink is rendered THEN the HTML contains the proper link info", async () => {
    const renderer = await initializeTest();

    const vault: DVault = {
      fsPath: "foo",
    };

    const testNote: NoteProps = {
      fname: "foo",
      id: "foo",
      title: "foo",
      desc: "foo",
      links: [],
      anchors: {},
      type: "note",
      updated: 1,
      created: 1,
      parent: "root",
      children: [],
      data: "test_data",
      body: "[[bar]]",
      vault,
    } as NoteProps;

    const result = await renderer.renderNote({ id: "foo", note: testNote });
    assert(result.data?.includes(`<a href="bar.html">Bar</a>`));
  });
});
