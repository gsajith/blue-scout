import { LoginResponse } from "@/helpers/bsky";
import { BskyAgent } from "@atproto/api";
import { useState } from "react";
import SecurityInfo from "../components/securityInfo";

type LoginPageProps = {
  setLoginResponseData: (data: LoginResponse | null) => void;
  agent: BskyAgent;
}

const LoginPage = ({ setLoginResponseData, agent }:LoginPageProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<null | string>(null);

  const login = (username: string, password: string) => {
  setError(null);
  agent
    .login({
      identifier: username,
      password: password,
    })
    .then((response) => {
      if (response.success) {
        setLoginResponseData({
          ...response.data,
          refreshJwt: "", // removing this for security reasons
        });
      } else {
        // Error
        setLoginResponseData(null);
        setError("Error");
      }
    })
    .catch((err) => {
      // Error
      setLoginResponseData(null);
      setError(err.message);
    });
  };

  return (
        <div className="flex flex-col items-center justify-center min-h-screen">
      {/* An offset equal to the security info (ish) */}
      <div className="h-32" />
      {/* The title */}
      <h1 className="text-3xl font-bold mb-6">Login with Bluesky</h1>
      {/* The login form */}
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password);
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 dark:border-slate-700 p-2 rounded mb-4 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 dark:border-slate-700 p-2 rounded mb-4 text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {/* Security policy section */}
      <SecurityInfo />
    </div>
  )
}

export default LoginPage;
