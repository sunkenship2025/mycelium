import {
  FuseEngine,
  getCleanThresholdValue,
  NoteIndexProps,
  NotePropsByIdDict,
} from "@myceliumhq/common-all";
import { NoteTestUtilsV4 } from "@myceliumhq/common-test-utils";
import Fuse from "fuse.js";

type TestData = {
  fname: string;
  updated: number;
  stub?: boolean;
};

async function testDataToNotePropsByIdDict(
  testData: TestData[]
): Promise<NotePropsByIdDict> {
  const dict: NotePropsByIdDict = {};

  for (const td of testData) {
    // eslint-disable-next-line no-await-in-loop
    const note = await NoteTestUtilsV4.createNote({
      fname: td.fname,
      vault: { fsPath: "/tmp/vault-path" },
      wsRoot: "/tmp",
      noWrite: true,
    });

    note.stub = td.stub;
    note.updated = td.updated;

    dict[note.id] = note;
  }

  return dict;
}

const testDataFromFNames = (fnames: string[]): TestData[] => {
  return fnames.map((fname) => ({ fname, updated: 1 }));
};

function assertHasFName(queryResult: NoteIndexProps[], fname: string) {
  expect(queryResult.some((qr) => qr.fname === fname)).toBeTruthy();
}

function assertDoesNotHaveFName(queryResult: NoteIndexProps[], fname: string) {
  expect(queryResult.some((qr) => qr.fname === fname)).toBeFalsy();
}

async function initializeFuseEngine(testData: TestData[]): Promise<FuseEngine> {
  const fuseEngine = new FuseEngine({ fuzzThreshold: 0.2 });
  const notePropsByIdDict: NotePropsByIdDict =
    await testDataToNotePropsByIdDict(testData);
  await fuseEngine.replaceNotesIndex(notePropsByIdDict);
  return fuseEngine;
}

const queryTestV1 = ({
  fuseEngine,
  qs,
  expectedFNames,
}: {
  fuseEngine: FuseEngine;
  qs: string;
  expectedFNames: string[];
}) => {
  const notes = fuseEngine.queryNote({ qs, originalQS: qs });

  expectedFNames.forEach((expectedFname) => {
    const wasFound = notes.some((n) => n.fname === expectedFname);
    if (!wasFound) {
      throw Error(`Did not find '${expectedFname}' when querying for '${qs}'`);
    }
  });
};

describe("Fuse utility function tests", () => {
  describe(`getCleanThresholdValue`, () => {
    it("WHEN val is specified but too small THEN use fallback", () => {
      expect(getCleanThresholdValue(-1)).toEqual(0.2);
    });

    it("WHEN val is specified but too large THEN use fallback", () => {
      expect(getCleanThresholdValue(1.1)).toEqual(0.2);
    });

    it("WHEN val is within range THEN use the configured value", () => {
      expect(getCleanThresholdValue(0.1234)).toEqual(0.1234);
    });
  });

  describe(`doesContainSpecialQueryChars`, () => {
    test.each([
      // Fuse doesn't treat * specially but we map * to ' ' hence we treat it as special character.
      ["dev*ts", true],
      ["dev vs", true],
      ["^vs", true],
      ["vs$", true],
      ["vs$", true],
      ["dev|vs", true],
      ["!vs", true],
      ["=vs", true],
      ["'vs", true],
      ["dev-vs", false],
      ["dev_vs", false],
    ])(
      `WHEN input="%s" THEN result is expected to be %s`,
      (input: string, expected: boolean) => {
        expect(FuseEngine.doesContainSpecialQueryChars(input)).toEqual(
          expected
        );
      }
    );
  });

  describe("formatQueryForFuse", () => {
    test.each([
      ["dev*vs", "dev vs"],
      ["dev*vs*ts", "dev vs ts"],
    ])(
      'WHEN input="%s" THEN output is "%s"',
      (input: string, expected: string) => {
        expect(FuseEngine.formatQueryForFuse({ qs: input })).toEqual(expected);
      }
    );
  });

  describe("Fuse.sortResults", () => {
    function createIndexItem(opts: {
      fname: string;
      updated: number;
      stub?: boolean;
    }): NoteIndexProps {
      return {
        id: opts.fname,
        updated: opts.updated,
        title: opts.fname,
        fname: opts.fname,
        vault: { fsPath: "vault-path" },
        stub: opts.stub,
      };
    }

    const createFoundItem = (opts: {
      score: number;
      fname: string;
      updated: number;
      stub?: boolean;
    }) => {
      return {
        item: createIndexItem(opts),
        score: opts.score,
        matches: [],
        refIndex: 1,
      };
    };

    const assertContainsFName = (
      results: Fuse.FuseResult<NoteIndexProps>[],
      fname: string
    ) => {
      expect(results.some((res) => res.item.fname === fname)).toBeTruthy();
    };

    describe("WHEN sorting fuse results with originalQS match", () => {
      let sortedResults: Fuse.FuseResult<NoteIndexProps>[];

      beforeAll(() => {
        sortedResults = FuseEngine.sortResults({
          results: [
            createFoundItem({ fname: "match.a1.hi-1", updated: 2, score: 0.1 }),
            createFoundItem({ fname: "match.a1.hi-2", updated: 2, score: 0.1 }),
            createFoundItem({ fname: "match.a1", updated: 3, score: 0.2 }),
          ],
          originalQS: "match.a1",
        });
      });

      it("THEN originalQS match should come first even when score is lower", () => {
        expect(sortedResults[0].item.fname).toEqual("match.a1");
      });

      it(`THEN keep all other results`, () => {
        expect(sortedResults.length).toEqual(3);
        assertContainsFName(sortedResults, "match.a1.hi-1");
        assertContainsFName(sortedResults, "match.a1.hi-2");
        assertContainsFName(sortedResults, "match.a1");
      });
    });

    describe("WHEN sorting fuse results with same score, one result having closer hamming distance", () => {
      let sortedResults: Fuse.FuseResult<NoteIndexProps>[];

      beforeAll(() => {
        sortedResults = FuseEngine.sortResults({
          results: [
            createFoundItem({ fname: "match.a1", updated: 2, score: 0.1 }),
            createFoundItem({ fname: "match.hi-2.a1", updated: 3, score: 0.1 }),
          ],
          originalQS: "match.a",
        });
      });

      it("THEN match with closer hamming distance should come first even when its updated date is older", () => {
        expect(sortedResults[0].item.fname).toEqual("match.a1");
      });

      it(`THEN keep all other results`, () => {
        expect(sortedResults.length).toEqual(2);
        assertContainsFName(sortedResults, "match.a1");
        assertContainsFName(sortedResults, "match.hi-2.a1");
      });
    });

    describe("WHEN sorting fuse results", () => {
      let sortResults: Fuse.FuseResult<NoteIndexProps>[];

      beforeAll(() => {
        sortResults = FuseEngine.sortResults({
          results: [
            createFoundItem({ fname: "match-a1", updated: 2, score: 0.1 }),
            createFoundItem({ fname: "match-a2", updated: 3, score: 0.1 }),
            // Stubs are going to have a latest update time but should come
            // after real matches in search results (when stubs have matching score with real result).
            createFoundItem({
              fname: "stub-a2",
              updated: 999,
              score: 0.1,
              stub: true,
            }),
            createFoundItem({ fname: "best-match", updated: 1, score: 0.01 }),
            createFoundItem({ fname: "worst-match", updated: 1, score: 0.99 }),
          ],
          originalQS: `match`,
        });
      });

      it("THEN best matched score should be first, regardless of update time", () => {
        expect(sortResults[0].item.fname).toEqual("best-match");
      });

      it("WHEN two items have the same score THEN the more recently updated comes first", () => {
        expect(sortResults[1].item.fname).toEqual("match-a2");
        expect(sortResults[2].item.fname).toEqual("match-a1");
      });

      it("WHEN stub has same score as a match THEN it comes after the real match", () => {
        expect(sortResults[2].item.fname).toEqual("match-a1");
        expect(sortResults[3].item.fname).toEqual("stub-a2");
      });

      it("WHEN item has worst match score THEN it comes last", () => {
        expect(sortResults[sortResults.length - 1].item.fname).toEqual(
          "worst-match"
        );
      });
    });
  });
});

describe("Fuse Engine tests with dummy data", () => {
  const DATA_1: TestData[] = [
    { fname: "note-1", updated: 2 },
    { fname: "note-2", updated: 3 },
    { fname: "note-3", updated: 4 },
    { fname: "user.tim.test", updated: 1 },
    { fname: "parent.new-note-1", updated: 1 },
    { fname: "some.note.name.with.big-o", updated: 1 },
  ];

  describe(`GIVEN engine with notes: '${DATA_1.map((n) => n.fname)}'`, () => {
    let fuseEngine: FuseEngine;
    beforeAll(async () => {
      fuseEngine = await initializeFuseEngine(DATA_1);
    });

    describe('WHEN querying for "note"', () => {
      let queryResult: NoteIndexProps[];
      beforeAll(() => {
        queryResult = fuseEngine.queryNote({ qs: "note", originalQS: "note" });
      });

      it("THEN include note-1", () => {
        assertHasFName(queryResult, "note-1");
      });

      it("THEN include note-2", () => {
        assertHasFName(queryResult, "note-1");
      });

      it("THEN notes with same matching score should be ordered by update time", () => {
        expect(queryResult[0].fname).toEqual("note-3");
        expect(queryResult[1].fname).toEqual("note-2");
        expect(queryResult[2].fname).toEqual("note-1");
      });

      it('THEN include "parent.new-note-1"', () => {
        assertHasFName(queryResult, "parent.new-note-1");
      });

      it('THEN exclude "user.tim.test"', () => {
        assertDoesNotHaveFName(queryResult, "user.tim.test");
      });
    });

    describe('WHEN querying for "NOTE" (case mismatch)', () => {
      let queryResult: NoteIndexProps[];
      beforeAll(() => {
        queryResult = fuseEngine.queryNote({ qs: "NOTE", originalQS: "NOTE" });
      });

      it("THEN include note-1", () => {
        assertHasFName(queryResult, "note-1");
      });

      it("THEN include note-2", () => {
        assertHasFName(queryResult, "note-1");
      });

      it("THEN notes with same matching score should be ordered by update time", () => {
        expect(queryResult[0].fname).toEqual("note-3");
        expect(queryResult[1].fname).toEqual("note-2");
        expect(queryResult[2].fname).toEqual("note-1");
      });

      it('THEN include "parent.new-note-1"', () => {
        assertHasFName(queryResult, "parent.new-note-1");
      });

      it('THEN exclude "user.tim.test"', () => {
        assertDoesNotHaveFName(queryResult, "user.tim.test");
      });
    });

    describe('WHEN querying for "note-1"', () => {
      let queryResults: NoteIndexProps[];

      beforeAll(() => {
        queryResults = fuseEngine.queryNote({
          qs: "note-1",
          originalQS: "note-1",
        });
      });

      it('THEN exact match "note-1" comes first', () => {
        expect(queryResults.length).toBeTruthy();
        expect(queryResults[0].fname).toEqual("note-1");
      });

      it('THEN string which contains exact match "parent.new-note-1" comes second', () => {
        expect(queryResults[1].fname).toEqual("parent.new-note-1");
      });

      it("THEN string with same size but not exact match is excluded.", () => {
        assertDoesNotHaveFName(queryResults, "note-2");
      });
    });

    describe(`WHEN querying for 'big o'`, () => {
      let queryResults: NoteIndexProps[];

      beforeAll(() => {
        queryResults = fuseEngine.queryNote({
          qs: "big o",
          originalQS: "big o",
        });
      });

      it(`THEN should match 'some.note.name.with.big-o'`, () => {
        assertHasFName(queryResults, "some.note.name.with.big-o");
      });
    });

    describe(`WHEN querying for full length word`, () => {
      it("AND case matches THEN should get the note", () => {
        const queryResults = fuseEngine.queryNote({
          qs: "some.note.name.with.big-o",
          originalQS: "some.note.name.with.big-o",
        });
        assertHasFName(queryResults, "some.note.name.with.big-o");
      });

      it("AND case does NOT match THEN should get the note", () => {
        const queryResults = fuseEngine.queryNote({
          qs: "SOME.note.NAME.with.big-o",
          originalQS: "SOME.note.NAME.with.big-o",
        });
        assertHasFName(queryResults, "some.note.name.with.big-o");
      });
    });
  });
});

describe("FuseEngine tests with extracted data.", () => {
  describe('GIVEN engine with notes containing "dev" extracted from mycelium.mycelium-site/vault ', () => {
    const DATA_FILES_WITH_DEV: TestData[] = testDataFromFNames([
      "mycelium.contribute.dev",
      "mycelium.contribute.first-dev",
      "mycelium.dev.api",
      "mycelium.dev.api.seeds",
      "mycelium.dev.arch",
      "mycelium.dev.cook",
      "mycelium.dev.debug",
      "mycelium.dev.design.commands",
      "mycelium.dev.design.commands.rename",
      "mycelium.dev.design.engine",
      "mycelium.dev.design.files-vs-folders",
      "mycelium.dev.design.lookup",
      "mycelium.dev.design",
      "mycelium.dev.design.pods",
      "mycelium.dev.design.publishing",
      "mycelium.dev.design.remark",
      "mycelium.dev.design.seeds",
      "mycelium.dev.errors",
      "mycelium.dev.issues",
      "mycelium.dev",
      "mycelium.dev.pull-request",
      "mycelium.dev.qa.build-repo",
      "mycelium.dev.qa",
      "mycelium.dev.qa.notes",
      "mycelium.dev.qa.perf",
      "mycelium.dev.qa.sop",
      "mycelium.dev.qa.verdaccio",
      "mycelium.dev.qa.windows",
      "mycelium.dev.ref.kevins-setup",
      "mycelium.dev.ref.lifecylce",
      "mycelium.dev.ref",
      "mycelium.dev.ref.vscode",
      "mycelium.dev.ref.web-dev",
      "mycelium.dev.remote",
      "mycelium.dev.setup.common",
      "mycelium.dev.setup",
      "mycelium.dev.style",
      "mycelium.dev.tools",
      "mycelium.dev.triage.bots",
      "mycelium.dev.triage",
      "mycelium.dev.triage.process",
      "mycelium.dev.troubleshooting",
      "mycelium.dev.windows",
      "mycelium.topic.pod.dev",
      "pkg.common-all.dev",
      "pkg.mycelium-api-server.dev",
      "pkg.mycelium-cli.dev",
      "pkg.mycelium-engine.dev.cook",
      "pkg.mycelium-engine.dev",
      "pkg.mycelium-markdown.dev",
      "pkg.mycelium-next-server.dev",
      "pkg.mycelium-next-server.dev.remote",
      "pkg.mycelium-next-server.t.preview.dev",
      "pkg.mycelium-plugin.dev",
      "pkg.devto-pod",
      "pkg.nextjs-template.dev",
    ]);

    let fuseEngine: FuseEngine;
    beforeAll(async () => {
      fuseEngine = await initializeFuseEngine(
        DATA_FILES_WITH_DEV.concat({
          fname: "mycelium.dev.i-am-a-stub",
          updated: 1,
          stub: true,
        })
      );
    });

    describe(`AND using default query parameters`, () => {
      test.each([
        [
          "dev*vs",
          ["mycelium.dev.design.files-vs-folders", "mycelium.dev.ref.vscode"],
        ],
        [
          "dev vs",
          ["mycelium.dev.design.files-vs-folders", "mycelium.dev.ref.vscode"],
        ],
        [
          "vs dev",
          ["mycelium.dev.design.files-vs-folders", "mycelium.dev.ref.vscode"],
        ],
        ["devapi", ["mycelium.dev.api", "mycelium.dev.api.seeds"]],
        ["mycelium rename", ["mycelium.dev.design.commands.rename"]],
        ["rename mycelium", ["mycelium.dev.design.commands.rename"]],
        [
          "mycelium.dev design.commands.rename",
          ["mycelium.dev.design.commands.rename"],
        ],
        [
          "^mycelium.dev.design.commands.rename",
          ["mycelium.dev.design.commands.rename"],
        ],
        [
          "mycelium.dev.design.commands.rename$",
          ["mycelium.dev.design.commands.rename"],
        ],
        [
          "=mycelium.dev.design.commands.rename",
          ["mycelium.dev.design.commands.rename"],
        ],
        [
          "mycelium.dev.design.commands.rename !git",
          ["mycelium.dev.design.commands.rename"],
        ],
        [
          "'mycelium.dev.design 'commands.rename",
          ["mycelium.dev.design.commands.rename"],
        ],
      ])(
        "WHEN query for '%s' THEN results to contain %s",
        (qs: string, expectedFNames: string[]) => {
          queryTestV1({
            fuseEngine,
            qs,
            expectedFNames,
          });
        }
      );
    });

    describe(`WHEN querying for 'mycelium.dev' AND onlyDirectChildren is set.'`, () => {
      let notes: NoteIndexProps[];

      beforeEach(() => {
        notes = fuseEngine.queryNote({
          qs: "mycelium.dev.",
          originalQS: "mycelium.dev.",
          onlyDirectChildren: true,
        });
      });

      it(`THEN match direct child 'mycelium.dev.design'`, () => {
        assertHasFName(notes, "mycelium.dev.design");
      });

      it(`THEN do NOT match grandchild 'mycelium.dev.design.commands'`, () => {
        assertDoesNotHaveFName(notes, "mycelium.dev.design.commands");
      });

      it(`THEN do NOT match stub child 'mycelium.dev.i-am-a-stub'`, () => {
        assertDoesNotHaveFName(notes, "mycelium.dev.i-am-a-stub");
      });
    });
  });
});
