import { SignIn, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {

  // currently rendering this on every keypress
  // possible TODO
  // use Zod and React Hook Form to validate input 
  // manage input state on client side

  const { user } = useUser();

  const [emoji, setEmoji] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      setEmoji("");
      await ctx.posts.getAll.refetch();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
        setEmoji("");
      } else {
        toast.error("Invalid input.  Emojis only!");
        setEmoji("");
      }
    }
  });

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis"
        className="bg-transparent flex-grow outline-none"
        type="text"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (emoji !== "") {
              mutate({ content: emoji });
            }
          }
        }}
      />
      {emoji !== "" && !isPosting && (
        <button onClick={() => mutate({ content: emoji })} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  )
}


const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery(); //tRPC hook to run the query on the server

  if (postsLoading) return <div><LoadingPage /></div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}


export default function Home() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  // tRPC hook to run the query on the server
  // fetching now to cache the data for later
  const { data } = api.posts.getAll.useQuery();

  // return empty div if user is not loaded
  if (!userLoaded) return <div />;

  return (

    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex flex-grow gap-3">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>

      <Feed />

    </PageLayout>

  );
}
