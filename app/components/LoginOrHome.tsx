'use client';
import { useAuth } from '../auth/AuthProvider';
import Header from './Header';
import HomePage from '../home/page';
import LoginPage from '../login/page';

const LoginOrHome = () => {
  const { authLoading, loginResponseData } = useAuth();

  const identifier = loginResponseData?.handle;
  return (
    <main className="flex flex-col items-center h-screen">
      <Header />
      {authLoading ? (
        <div className="flex flex-row items-center justify-center  ">
          <div className="lds-dual-ring mr-2" />
          Loading...
        </div>
      ) : identifier ? (
        <HomePage />
      ) : (
        <LoginPage />
      )}
    </main>
  );
};

export default LoginOrHome;
