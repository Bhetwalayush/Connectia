// Login page - split-screen branding + form
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { LOGIN } from "../../graphql/mutations/authMutations";
import { useAuth } from "../../context/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN);
  const navigate = useNavigate();
  const location = useLocation();
  const { refetch } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });
      const response = data?.login;

      if (!response?.success) {
        setError(response?.message || "Unable to log in.");
        return;
      }

      await refetch();
      navigate(location.state?.from?.pathname || "/", { replace: true });
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
            Where your circle
            <br />
            actually shows up.
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Posts, messages, and a live room to talk — all in one place, all in
            real time.
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

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Log in to keep up with your circle.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

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

            <AuthButton disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
