'use client';
import { getMyProfile } from '@/helpers/bsky';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import AppBox from '../components/AppBox';
import UserBox from '../components/UserBox';

const HomePage = () => {
  const { agent, loginResponseData } = useAuth();
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const response = await getMyProfile(agent!, loginResponseData!.handle);
      if (response) {
        setProfile(response);
      }
    }
    fetchProfile();
  }, [agent, loginResponseData]);

  return (
    <div className="flex flex-row flex-wrap container xs:min-w-full 2xs:min-w-full p-4">
      <UserBox profile={profile} />
      <AppBox />
    </div>
  );
};

export default HomePage;
