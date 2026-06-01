import {
  MyceliumConfig,
  NoteTrait,
  OnCreateContext,
  onWillCreateProps,
  SetNameModifierResp,
} from "@myceliumhq/common-all";
import { MyceliumClientUtilsV2 } from "../clientUtils";
import { IMyceliumExtension } from "../myceliumExtensionInterface";

export class MeetingNote implements NoteTrait {
  id: string = "meetingNote";
  getTemplateType: any;

  _config: MyceliumConfig;
  _ext: IMyceliumExtension;
  _noConfirm: boolean = false;

  constructor(
    config: MyceliumConfig,
    ext: IMyceliumExtension,
    noConfirm?: boolean
  ) {
    this._config = config;
    this._ext = ext;
    this._noConfirm = noConfirm ?? this._noConfirm;
  }

  get OnWillCreate(): onWillCreateProps {
    const promptUserForModification = !this._noConfirm;
    return {
      setNameModifier(this, _opts: OnCreateContext): SetNameModifierResp {
        const name = MyceliumClientUtilsV2.getMeetingNoteName();

        return { name, promptUserForModification };
      },
    };
  }
}
