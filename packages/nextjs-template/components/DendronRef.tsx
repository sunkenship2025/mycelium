import Head from "next/head";
import { useIFrameHeightAdjuster } from "../hooks/useIFrameHeightAdjuster";

interface IMyceliumRefProps {
  body: string;
}

export function MyceliumRef(props: IMyceliumRefProps) {
  useIFrameHeightAdjuster();
  const { body } = props;

  return (
    <div>
      <Head>
        <base target="_top" />
      </Head>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
