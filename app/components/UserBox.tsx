'use client';
import { getMyProfile } from '@/helpers/bsky';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../auth/AuthProvider';
import PrimaryButton from './PrimaryButton';
import UserDetails from './UserDetails';

const UserBox = () => {
  const { agent, loginResponseData, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileViewDetailed | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchProfile() {
      const response = await getMyProfile(agent!, loginResponseData!.handle);
      if (response) {
        setProfile(response);
      }
    }
    if (agent && loginResponseData) {
      fetchProfile();
    } else {
      setProfile(undefined);
    }
  }, [agent, loginResponseData]);

  return (
    <div>
      <div
        className={
          'w-[350px] flex flex-col items-start bg-[#1D1E35] drop-shadow-2xl rounded-3xl px-10 py-10 ' +
          (loginResponseData && 'px-6')
        }
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center mb-3 w-full">
            {loginResponseData && (
              <span className="uppercase text-slate-400 text-sm w-full">
                Hey there!
              </span>
            )}
            {logout && (
              <div className="w-full flex flex-row justify-end">
                <PrimaryButton type="button" onClick={logout}>
                  <FiLogOut className="mr-2" />
                  Logout
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
        <UserDetails profile={profile} />
      </div>
    </div>
  );
};

export default UserBox;
