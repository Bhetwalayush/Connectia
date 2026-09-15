// Home page - Main feed displaying all posts from users, infinite scroll
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_POSTS } from "../../graphql/queries/postQueries";

import PostCard from "../../components/post/PostCard";
import PostComposer from "../../components/post/PostComposer";

const PAGE_SIZE = 20;

function Home() {
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: { limit: PAGE_SIZE, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const posts = data?.posts ?? [];

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    fetchMore({
      variables: { limit: PAGE_SIZE, offset: posts.length },
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult?.posts?.length) {
          setHasMore(false);
          return previous;
        }

        if (fetchMoreResult.posts.length < PAGE_SIZE) {
          setHasMore(false);
        }

        // Dedupe in case a post shifted position due to edits/likes
        // between page loads (classic offset-pagination edge case)
        const existingIds = new Set(previous.posts.map((post) => post.id));
        const newPosts = fetchMoreResult.posts.filter(
          (post) => !existingIds.has(post.id),
        );

        return {
          posts: [...previous.posts, ...newPosts],
        };
      },
    }).finally(() => {
      setLoadingMore(false);
    });
  }, [fetchMore, loadingMore, hasMore, posts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  if (loading && !data) {
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
      {posts.length ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          No posts yet. Be the first to share something.
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="space-y-4">
          <div className="h-36 animate-pulse rounded-xl border bg-white" />
          <div className="h-36 animate-pulse rounded-xl border bg-white" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-4 text-center text-sm text-gray-400">
          You're all caught up.
        </p>
      )}
    </main>
  );
}

export default Home;
