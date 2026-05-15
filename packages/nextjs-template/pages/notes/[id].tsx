import { MyceliumError, error2PlainObject } from "@myceliumhq/common-all";
import _ from "lodash";
import { GetStaticPaths, GetStaticProps } from "next";
import { prepChildrenForCollection } from "../../components/MyceliumCollection";
import MyceliumNotePage, {
  MyceliumNotePageProps,
} from "../../components/MyceliumNotePage";
import {
  MyceliumNotePageParams,
  getConfig,
  getCustomHead,
  getNoteBody,
  getNoteMeta,
  getNotePaths,
  getNotes,
} from "../../utils/build";

export default MyceliumNotePage;

export const getStaticPaths: GetStaticPaths<MyceliumNotePageParams> =
  getNotePaths;

export const getStaticProps: GetStaticProps<
  MyceliumNotePageProps,
  MyceliumNotePageParams
> = async ({ params }) => {
  if (!params) {
    throw Error("params required");
  }

  const { id } = params;

  if (!_.isString(id)) {
    throw Error("id required");
  }

  try {
    const [body, note] = await Promise.all([getNoteBody(id), getNoteMeta(id)]);
    const noteData = getNotes();
    const customHeadContent: string | null = await getCustomHead();
    const { notes, noteIndex } = noteData;
    const collectionChildren = note.custom?.has_collection
      ? prepChildrenForCollection(note, notes)
      : null;
    const props: MyceliumNotePageProps = {
      note,
      body,
      noteIndex,
      collectionChildren,
      customHeadContent,
      config: await getConfig(),
    };

    return {
      props,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(error2PlainObject(err as MyceliumError));
    throw err;
  }
};
