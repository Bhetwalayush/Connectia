// Login page - User authentication with email/password
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
  // Execute login mutation and handle response
  const [login, { loading }] = useMutation(LOGIN);
  const navigate = useNavigate();
  const location = useLocation();
  const { refetch } = useAuth();

  // Handle login form submission
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
    <div
      className="
min-h-screen
flex
items-center
justify-center
"
    >
      <form
        onSubmit={handleSubmit}
        className="
bg-white
p-8
rounded-xl
shadow
w-96
space-y-4
"
      >
        <h1
          className="
text-3xl
font-bold
text-center
"
        >
          Login
        </h1>

        {error && (
          <p
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </AuthButton>
        <Link to="/register" className="text-blue-600">
          Create account
        </Link>
      </form>
    </div>
  );
}

export default Login;
