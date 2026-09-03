import { useQuery } from "@apollo/client/react";
import { Link, useParams, useNavigate } from "react-router-dom";

import FollowButton from "../../components/profile/FollowButton";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import PostCard from "../../components/post/PostCard";
import { useAuth } from "../../context/useAuth";
import { GET_POSTS_BY_USER } from "../../graphql/queries/postQueries";
import { GET_PROFILE } from "../../graphql/queries/userQueries";

function Profile() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const profileId = Number(userId || currentUser?.id);
  const isValidProfileId = Number.isInteger(profileId) && profileId > 0;

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery(GET_PROFILE, {
    variables: { userId: profileId },
    skip: !isValidProfileId,
  });
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_USER, {
    variables: { userId: profileId },
    skip: !isValidProfileId,
  });

  if (!isValidProfileId || profileLoading) return <ProfileSkeleton />;

  if (profileError || !profileData?.user) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h1 className="text-lg font-semibold">Profile unavailable</h1>
        <p className="mt-1 text-sm">This user could not be found or loaded.</p>
      </section>
    );
  }

  const profile = profileData.user;
  const isOwnProfile = String(profile.id) === String(currentUser?.id);
  const initial = profile.username.charAt(0).toUpperCase();

  async function refreshProfile() {
    await Promise.all([refetchProfile(), refetchPosts()]);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-cyan-400" />
        <div className="px-6 pb-6">
          <div className="-mt-11 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700">
            {initial}
          </div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.username}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>
            {isOwnProfile ? (
              <Link
                to="/edit-profile"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit profile
              </Link>
            ) : (
              <div className="flex gap-2">
                {/* <FollowButton
                  userId={profile.id}
                  isFollowing={profile.isFollowing}
                  onToggled={refreshProfile}
                /> */}
                <FollowButton
                  userId={profile.id}
                  isFollowing={profile.isFollowing}
                  followsYou={profile.followsYou}
                  onToggled={refreshProfile}
                />
                <button
                  type="button"
                  onClick={() => navigate(`/messages/new?userId=${profile.id}`)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Message
                </button>
              </div>
            )}
          </div>
          <dl className="mt-6 flex gap-8 text-sm">
            <div>
              <dt className="text-slate-500">Followers</dt>
              <dd className="font-semibold text-slate-900">
                {profile.followersCount}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Following</dt>
              <dd className="font-semibold text-slate-900">
                {profile.followingCount}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="profile-posts-heading" className="space-y-4">
        <h2
          id="profile-posts-heading"
          className="text-lg font-bold text-slate-900"
        >
          Posts
        </h2>
        {postsLoading && (
          <div className="animate-pulse space-y-4" aria-busy="true">
            <div className="h-36 rounded-2xl border bg-white" />
            <div className="h-36 rounded-2xl border bg-white" />
          </div>
        )}
        {postsError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load posts for this profile.
          </p>
        )}
        {!postsLoading && !postsError && !postsData?.postsByUser?.length && (
          <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
            No posts yet.
          </p>
        )}
        {postsData?.postsByUser?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}

export default Profile;
