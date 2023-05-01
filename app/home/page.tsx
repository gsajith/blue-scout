'use client';
import { useAuth } from '../auth/AuthProvider';
import AppPage from '../components/AppPage';
import Header from '../components/Header';
import UserBox from '../components/UserBox';

const HomePage = () => {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex flex-row items-center justify-center  ">
        <div className="lds-dual-ring mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center h-screen">
      <Header />
      <div className="flex flex-row flex-wrap container xs:min-w-full 2xs:min-w-full p-4">
        <UserBox />
        <AppPage />
      </div>
    </main>
  );
};

export default HomePage;
