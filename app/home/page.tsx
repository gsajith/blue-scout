import { LoginResponse, getMyProfile } from '@/helpers/bsky';
import UserBox from '../components/UserBox';
import { BskyAgent } from '@atproto/api';
import { useEffect, useState } from 'react';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import AppBox from '../components/AppBox';

type HomePageProps = {
  loginData: LoginResponse;
  agent: BskyAgent;
  logout: () => void;
};
const HomePage = ({ logout, loginData, agent }: HomePageProps) => {
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const response = await getMyProfile(agent, loginData.handle);
      if (response) {
        setProfile(response);
      }
    }
    fetchProfile();
  }, [agent, loginData]);

  return (
    <div className="flex flex-row flex-wrap container xs:min-w-full 2xs:min-w-full p-4">
      <UserBox logout={logout} profile={profile} />
      <AppBox />
    </div>
  );
};

export default HomePage;
