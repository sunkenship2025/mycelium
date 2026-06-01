import { MyceliumBtn } from "../../components/lookup/ButtonTypes";
import { describe, beforeEach, it } from "mocha";
import { expect } from "../testUtilsv2";

suite("buttons tests", () => {
  describe(`canToggle tests:`, () => {
    describe(`GIVEN pressed button that is NOT allowed to be toggled`, () => {
      let myceliumBtn: MyceliumBtn;

      beforeEach(() => {
        myceliumBtn = new MyceliumBtn({
          pressed: true,
          canToggle: false,
          iconOff: "icon-off-val",
          iconOn: "icon-on-val",
          type: "horizontal",
          description: "test description",
          title: "title-val",
        });
      });

      describe(`WHEN toggle invoked.`, () => {
        beforeEach(() => {
          myceliumBtn.toggle();
        });

        it(`THEN pressed val stays the same.`, () => {
          expect(myceliumBtn.pressed).toEqual(true);
        });

        it(`THEN icon is set to on icon.`, () => {
          expect(myceliumBtn.iconPath.id).toEqual("icon-on-val");
        });
      });
    });

    describe(`GIVEN pressed button that is allowed to be toggled`, () => {
      let myceliumBtn: MyceliumBtn;

      beforeEach(() => {
        myceliumBtn = new MyceliumBtn({
          pressed: true,
          canToggle: true,
          iconOff: "icon-off-val",
          iconOn: "icon-on-val",
          type: "horizontal",
          description: "test description",
          title: "title-val",
        });
      });

      describe(`WHEN toggle invoked.`, () => {
        beforeEach(() => {
          myceliumBtn.toggle();
        });

        it(`THEN pressed val is flipped.`, () => {
          expect(myceliumBtn.pressed).toEqual(false);
        });

        it(`THEN icon is set to off icon.`, () => {
          expect(myceliumBtn.iconPath.id).toEqual("icon-off-val");
        });
      });
    });
  });
});
