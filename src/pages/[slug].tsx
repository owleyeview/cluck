import Head from "next/head";
import { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { DehydratedState } from "@tanstack/react-query";

const ProfilePage: NextPage<{username: string }> = ({username}) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  
  if (!data) return <div>404</div>;


  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <main className="flex justify-center h-screen">
          <div>{data.username}</div>
      </main>
    </>
  );
};

// satisfying the type checker to enable my manual Stringify below
type ExtendedDehydratedState = DehydratedState & { json: any };

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("slug is not a string");
  
  const username = slug.replace("@", "");
  
  // fetching the data and hydrating via server side props
  await ssg.profile.getUserByUsername.prefetch({ username });

  const dehydratedState = ssg.dehydrate() as ExtendedDehydratedState;
  
  // manually stringifying the data
  dehydratedState.json.queries[0].state.data = JSON.stringify(dehydratedState.json.queries[0].state.data);

  return {
    props: {
      trpcState: dehydratedState,  
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
}

export default ProfilePage;