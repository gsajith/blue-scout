import React, { useState } from 'react';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';
import { useAuth } from '../auth/AuthProvider';

interface LoginBoxProps {
  title?: string;
}

const LoginBox: React.FC<LoginBoxProps> = ({
  title = 'Log in with Bluesky'
}) => {
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
    <div className="max-w-sm flex flex-col justify-center items-center bg-[#1D1E35]">
      {/* The title */}
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
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
        <PrimaryButton type="submit">Log in</PrimaryButton>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default LoginBox;
