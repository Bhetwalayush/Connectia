import { useQuery } from "@apollo/client/react";

import { GET_POSTS } from "../../graphql/queries/postQueries";

import PostCard from "../../components/post/PostCard";

function Home() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Failed to load posts.</div>;
  }
  return (
    <main className="space-y-4">
      {data?.posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}

export default Home;
