import {
  ConfigUtils,
  MyceliumConfig,
  LookupNoteTypeEnum,
  NoteTrait,
  NoteUtils,
  OnCreateContext,
  onCreateProps,
  SetNameModifierResp,
} from "@myceliumhq/common-all";
import { MyceliumClientUtilsV2 } from "../clientUtils";

export class JournalNote implements NoteTrait {
  id: string = "journalNote";
  getTemplateType: any;

  _config: MyceliumConfig;

  constructor(config: MyceliumConfig) {
    this._config = config;
  }

  get OnWillCreate() {
    const config = this._config;

    return {
      setNameModifier(this, _opts: OnCreateContext): SetNameModifierResp {
        const journalConfig = ConfigUtils.getJournal(config);
        const dailyJournalDomain = journalConfig.dailyDomain;
        const { noteName: fname } = MyceliumClientUtilsV2.genNoteName(
          LookupNoteTypeEnum.journal,
          {
            overrides: { domain: dailyJournalDomain },
          }
        );

        return { name: fname, promptUserForModification: false };
      },
    };
  }

  get OnCreate(): onCreateProps {
    const config = this._config;

    return {
      setTitle(opts: OnCreateContext): string {
        const journalConfig = ConfigUtils.getJournal(config);
        const journalName = journalConfig.name;
        const title = NoteUtils.genJournalNoteTitle({
          fname: opts.currentNoteName!,
          journalName,
        });

        return title;
      },
    };
  }
}
