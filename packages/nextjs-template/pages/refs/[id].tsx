import { MyceliumError, error2PlainObject } from "@myceliumhq/common-all";
import { MyceliumNote } from "@myceliumhq/common-frontend";
import _ from "lodash";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import React from "react";
import MyceliumCustomHead from "../../components/MyceliumCustomHead";
import { getNoteRefs, getRefBody } from "../../utils/build";
import { MyceliumCommonProps } from "../../utils/types";

type NotePageProps = InferGetStaticPropsType<typeof getStaticProps> &
  MyceliumCommonProps & {
    customHeadContent: string | null;
  };

export default function NoteRef({ body, customHeadContent }: NotePageProps) {
  return (
    <>
      {customHeadContent && <MyceliumCustomHead content={customHeadContent} />}
      <MyceliumNote noteContent={body} />
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const ids = getNoteRefs();
  return {
    paths: _.map(ids, (id) => {
      return { params: { id } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { params } = context;
  if (!params) {
    throw Error("params required");
  }
  const id = params["id"];
  if (!_.isString(id)) {
    throw Error("id required");
  }

  try {
    const body = await getRefBody(id);

    return {
      props: {
        body,
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(error2PlainObject(err as MyceliumError));
    throw err;
  }
};
