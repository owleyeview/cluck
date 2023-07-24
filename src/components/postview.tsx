import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  return (
  <div key={post.id} className="flex gap-3 p-3 border-b border-slate-400"> 
    <Image 
      src={author.profileImageUrl}  
      className="h-12 w-12 rounded-full" 
      alt={`@${author.username}'s profile picture`}
      width={56}
      height={56}
    />
    <div className="flex flex-col">
      <div className="flex gap-1 text-slate-400">
        {/* using a Link component from Next.js instead of an <a> tag because 
        it prevents the routing from triggering a whole browser refresh
        , instead immediatly loading the next page */}
        <Link href={`/@${author.username}`}>
          <span>{`@${author.username} ·`}</span>
        </Link>
        <Link href={`/post/${post.id}`}>
          <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
        </Link>
      </div>
      <span className="text-2xl">
        {post.content}
      </span>
    </div>
  </div>
  )
}