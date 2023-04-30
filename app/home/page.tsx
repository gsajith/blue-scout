'use client';
import AppPage from '../components/AppPage';
import Header from '../components/Header';
import UserBox from '../components/UserBox';

const HomePage = () => {
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
