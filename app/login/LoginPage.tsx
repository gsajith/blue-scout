'use client';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import PrimaryButton from '../components/PrimaryButton';
import TextInput from '../components/textInput';
import SecurityInfo from '../components/SecurityInfo';

const LoginPage = () => {
  const { agent, setLoginResponseData } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<null | string>(null);

  const login = (username: string, password: string) => {
    setError(null);
    if (agent !== null && setLoginResponseData !== null) {
      agent
        .login({
          identifier: username,
          password: password
        })
        .then((response) => {
          if (response.success) {
            setLoginResponseData({
              ...response.data,
              refreshJwt: '' // removing this for security reasons
            });
          } else {
            // Error
            setLoginResponseData(null);
            setError('Error');
          }
        })
        .catch((err) => {
          // Error
          setLoginResponseData(null);
          setError(err.message);
        });
    } else {
      setError('Unable to find Bluesky connection');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 pb-8">
      <div className="container max-w-sm flex flex-col justify-center p-10 items-center rounded-3xl bg-[#1D1E35] shadow-2xl">
        {/* The title */}
        <h1 className="text-2xl font-bold mb-6">Login with Bluesky</h1>
        {/* The login form */}
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
        >
          <TextInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton type="submit">Login</PrimaryButton>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {/* Security policy section */}
      <SecurityInfo />
    </div>
  );
};

export default LoginPage;
