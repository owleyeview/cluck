import Head from "next/head";
import { NextPage } from "next";

const SinglePostPage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Cluck User</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        {/* icon from https://icons8.com/icon/fpZlxwEzKKxH/chicken */}
      </Head>
      <main className="flex justify-center h-screen">
          <div>Post View</div>
      </main>
    </>
  );
}

export default SinglePostPage;