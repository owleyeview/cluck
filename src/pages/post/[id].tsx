import Head from "next/head";
import Image from "next/image";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { DehydratedState } from "@tanstack/react-query";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

// satisfying the type checker to enable my manual Stringify below
type ExtendedDehydratedState = DehydratedState & { json: any };

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") {
    return {
      notFound: true,
    }
  }

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
}

export default SinglePostPage;