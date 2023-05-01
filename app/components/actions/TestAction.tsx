import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID, getProfile } from '@/helpers/bsky';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

const TestAction = () => {
  const { agent, loginResponseData } = useAuth();
  const [followerDIDs, setFollowerDIDs] = useState<string[]>([]);

  useEffect(() => {
    async function getFollowers() {
      const followers = await getFollowersDID(agent!, loginResponseData!.did);
      setFollowerDIDs(followers);
    }
    if (agent && loginResponseData) {
      getFollowers();
    }
  }, [agent, loginResponseData]);

  const ProfileListItem = ({ index, style }: any) => {
    const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);
    useEffect(() => {
      async function getThisProfile() {
        const profile = await getProfile(agent!, followerDIDs[index]);
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
  return (
    <div className="pt-8">
      <div className="max-h-[600px] overflow-x-hidden mt-2">
        <List
          className="list"
          height={400}
          itemCount={followerDIDs.length}
          itemSize={112}
          width={'100%'}
          itemKey={(index) => followerDIDs[index]}
        >
          {ProfileListItem}
        </List>
      </div>
    </div>
  );
};

export default TestAction;
