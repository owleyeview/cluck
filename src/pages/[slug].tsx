import Head from "next/head";
import Image from "next/image";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { DehydratedState } from "@tanstack/react-query";
import { PageLayout } from "~/components/layout";

const ProfilePage: NextPage<{username: string }> = ({username}) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username!}</title>
      </Head>
<PageLayout>
    <div className="relative h-36 bg-slate-600">
      <Image 
        src={data.profileImageUrl}          
        alt={`@${data.username!}'s profile picture`}
        width={128}
        height={128}
        className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
      />
      
    </div>
    <div className="h-[64px]"></div>
    <div className="p-4 text-2xl">{`@${data.username!}`}</div>
    <div className="w-full border-b border-slate-400" />
</PageLayout>    
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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