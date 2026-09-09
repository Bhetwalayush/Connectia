// Edit profile page - update username/bio, and change password
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../context/useAuth";
import { GET_CURRENT_USER } from "../../graphql/queries/userQueries";
import {
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from "../../graphql/mutations/userMutations";

function EditProfile() {
  const { user, refetch } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [updateProfile, { loading: savingProfile }] = useMutation(
    UPDATE_PROFILE,
    { refetchQueries: [{ query: GET_CURRENT_USER }] },
  );

  const [changePassword, { loading: savingPassword }] =
    useMutation(CHANGE_PASSWORD);

  const initial = (username || user?.username || "?").charAt(0).toUpperCase();
  const bioLength = bio.length;
  const isDirty =
    username.trim() !== (user?.username || "") ||
    bio.trim() !== (user?.bio || "");

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    try {
      const { data } = await updateProfile({
        variables: {
          input: {
            username: username.trim(),
            bio: bio.trim(),
          },
        },
      });

      if (!data?.updateProfile?.success) {
        setProfileError(
          data?.updateProfile?.message || "Could not update profile.",
        );
        return;
      }

      setProfileMessage("Profile updated.");
      await refetch();
    } catch {
      setProfileError("Could not update profile. Please try again.");
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    try {
      const { data } = await changePassword({
        variables: {
          input: {
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
        },
      });

      if (!data?.changePassword?.success) {
        setPasswordError(
          data?.changePassword?.message || "Could not change password.",
        );
        return;
      }

      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPasswordError("Could not change password. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16">
      {/* Header banner, matching Profile.jsx's visual language */}
      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-400" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700">
              {initial}
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            Edit profile
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Update your public profile and account security
          </p>
        </div>
      </section>

      {/* Profile info card */}
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">
          Public profile
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          This is how others will see you across Connectia
        </p>

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400">
                @
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                maxLength={50}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-7 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Bio</label>
              <span
                className={`text-xs ${
                  bioLength > 280 ? "text-red-500" : "text-slate-400"
                }`}
              >
                {bioLength}/280
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Tell people a little about yourself..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              {profileMessage && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {profileMessage}
                </p>
              )}
              {profileError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {profileError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={savingProfile || !isDirty}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Password card */}
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">
          Change password
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Choose a strong password you don't use elsewhere
        </p>

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              {passwordMessage && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {passwordMessage}
                </p>
              )}
              {passwordError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {passwordError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditProfile;
