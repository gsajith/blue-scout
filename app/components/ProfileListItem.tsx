import { getProfile } from '@/helpers/bsky';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import Image from 'next/image';
import { CSSProperties, useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

type ProfileListItemProps = {
  did: string;
  style: CSSProperties;
};

const ProfileListItem = ({ did, style }: ProfileListItemProps) => {
  const { agent } = useAuth();
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);
  useEffect(() => {
    async function getThisProfile() {
      const profile = await getProfile(agent!, did);
      if (profile) {
        setProfile(profile);
      } else {
        setProfile(null);
      }
    }
    if (agent) {
      getThisProfile();
    }
    return () => {};
  }, []);
  return (
    <div className="my-2 pr-4" style={style}>
      <div className="bg-[#262941] p-4 h-24 rounded-lg hover:bg-[#333654] focus:border-2 cursor-pointer border-slate-600 border">
        <div className="flex flex-row items-center pb-6 truncate">
          <Image
            width={64}
            height={64}
            className="w-16 h-16 rounded-full mr-3 border-2 border-white"
            alt="Profile avatar"
            src={
              profile && profile.avatar
                ? profile.avatar
                : '/placeholder_avatar.png'
            }
          />
          <div className="flex flex-col truncate w-full">
            <div className="text-xl font-bold truncate">
              {profile ? profile.displayName : 'Loading user...'}
            </div>
            <div className="truncate">
              @{profile ? profile.handle : '-------.bsky.social'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileListItem;
