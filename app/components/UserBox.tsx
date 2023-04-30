import { FiLogOut } from 'react-icons/fi';
import PrimaryButton from './PrimaryButton';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import Image from 'next/image';
import { useAuth } from '../auth/AuthProvider';

type UserBoxProps = {
  profile: ProfileViewDetailed | null;
};
const UserBox = ({ profile }: UserBoxProps) => {
  const { logout } = useAuth();

  return (
    <div className="w-[350px]">
      <div className="flex flex-col items-start bg-[#1D1E35] drop-shadow-2xl rounded-3xl p-6">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center mb-2">
            <span className="uppercase text-slate-400 text-sm w-full">
              Hey there!
            </span>
            <div className="w-full flex flex-row justify-end">
              {logout && (
                <PrimaryButton type="button" onClick={logout}>
                  <FiLogOut className="mr-2" />
                  Logout
                </PrimaryButton>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center border-b-2 pb-6 border-slate-600">
            <Image
              width={256}
              height={256}
              className="w-24 h-24 rounded-full mr-3 border-2 border-white]"
              alt="Profile avatar"
              src={profile ? profile.avatar! : '/placeholder_avatar.png'}
            />
            <div className="flex flex-col truncate w-full">
              <div className="text-xl font-bold truncate">
                {profile && profile.displayName}
              </div>
              <div className="truncate">@{profile && profile.handle}</div>
            </div>
          </div>
        </div>

        {/* Follower count section */}
        <div className="flex flex-row mt-6 gap-5 w-full justify-center">
          <div className="flex flex-col">
            <div className="font-black text-4xl">
              {profile && profile.followersCount}
            </div>
            <div className="uppercase">Followers</div>
          </div>
          <div className="flex flex-col">
            <div className="font-black text-4xl">
              {profile && profile.followsCount}
            </div>
            <div className="uppercase">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
