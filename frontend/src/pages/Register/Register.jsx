// Register page - split-screen branding + form
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import { validateEmail, validatePassword } from "../../utils/validators";
import { REGISTER } from "../../graphql/mutations/authMutations";
import ProfilePicture from "../../components/common/ProfilePicture";
import ImageUploadButton from "../../components/common/ImageUploadButton";
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [register, { loading }] = useMutation(REGISTER);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username) {
      setError("Username is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await register({
        variables: {
          input: {
            username,
            email,
            password,
            profilePictureUrl: profilePictureUrl || null,
          },
        },
      });

      if (!data?.register?.success) {
        setError(data?.register?.message || "Unable to create your account.");
        return;
      }

      navigate("/login", {
        replace: true,
        state: { message: "Account created. Please log in." },
      });
    } catch {
      setError("Unable to connect to Connectia. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Connectia"
            className="h-10 w-10 rounded-xl"
          />
          <span className="text-xl font-bold">Connectia</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Join the conversation
            <br />
            that never stops.
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Share posts, chat live, and stay close to the people who matter.
          </p>
        </div>

        <p className="relative text-sm text-indigo-200">
          &copy; {new Date().getFullYear()} Connectia. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img
              src="/logo.png"
              alt="Connectia"
              className="h-9 w-9 rounded-xl"
            />
            <span className="text-lg font-bold text-slate-900">Connectia</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            It only takes a minute to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-center">
              <div className="relative">
                <ProfilePicture src={profilePictureUrl} size="xl" />
                <ImageUploadButton
                  onUploaded={setProfilePictureUrl}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </ImageUploadButton>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Username
              </label>
              <InputField
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <InputField
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>

            <AuthButton disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
