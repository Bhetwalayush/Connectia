import { useQuery } from "@apollo/client/react";

import { GET_POSTS } from "../../graphql/queries/postQueries";

import PostCard from "../../components/post/PostCard";
import PostComposer from "../../components/post/PostComposer";

function Home() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-gray-600">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load posts.
      </div>
    );
  }
  return (
    <main className="mx-auto max-w-2xl space-y-4">
      <PostComposer />
      {data?.posts?.length ? (
        data.posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          No posts yet. Be the first to share something.
        </div>
      )}
    </main>
  );
}

export default Home;
