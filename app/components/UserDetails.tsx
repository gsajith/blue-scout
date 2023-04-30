import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import Image from 'next/image';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'next/navigation';

type UserDetailsProps = {
  profile?: ProfileViewDetailed;
  showLogin?: boolean;
  fullWidth?: boolean;
};
const UserDetails = ({
  profile,
  showLogin = true,
  fullWidth = false
}: UserDetailsProps) => {
  const router = useRouter();
  return (
    <>
      <div
        className={'truncate' + (fullWidth ? ' max-w-screen-2xl' : ' max-w-xs')}
      >
        <div className="flex flex-row items-center border-b-2 pb-6 border-slate-600 truncate">
          <Image
            width={256}
            height={256}
            className="w-20 h-20 rounded-full mr-3 border-2 border-white]"
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
      </div>

      {profile && (
        <>
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
      )}
      {showLogin && !profile && (
        <div className="pt-4 pl-4 flex justify-end w-full">
          <PrimaryButton onClick={() => router.push('/login')}>
            Log in with Bluesky
          </PrimaryButton>
        </div>
      )}
    </>
  );
};

export default UserDetails;
