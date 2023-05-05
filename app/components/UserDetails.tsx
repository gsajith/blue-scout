import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import Image from 'next/image';
import LoginBox from './LoginBox';

type UserDetailsProps = {
  profile?: ProfileViewDetailed;
  showLogin?: boolean;
  fullWidth?: boolean;
};
const UserDetails = ({ profile, fullWidth = false }: UserDetailsProps) => {
  if (!profile) {
    return <LoginBox title={'Log in with Bluesky to get full features'} />;
  }

  return (
    <>
      <div
        className={
          'flex flex-row items-center border-b-2 pb-6 border-slate-600 truncate w-full' +
          (fullWidth ? ' max-w-screen-2xl' : ' max-w-xs')
        }
      >
        <Image
          width={256}
          height={256}
          className="w-20 h-20 rounded-full mr-3 border-2 border-white"
          alt="Profile avatar"
          src={
            profile && profile.avatar
              ? profile.avatar
              : '/placeholder_avatar.png'
          }
        />
        <div className="flex flex-col truncate w-full">
          <div className="text-xl font-bold truncate">
            {profile ? profile.displayName : 'Anonymous user'}
          </div>
          <div className="truncate">
            @{profile ? profile.handle : '-------.bsky.social'}
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
    </>
  );
};

export default UserDetails;
