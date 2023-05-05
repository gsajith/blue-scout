import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID, getProfile } from '@/helpers/bsky';
import { BLACKLIST_DIDS } from '@/helpers/blacklist';
import { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProfileListItem from '../ProfileListItem';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

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

  // ****************************** Blacklist building ******************************
  useEffect(() => {
    console.log(BLACKLIST_DIDS);
    async function getFollowerDetails() {
      const profiles: ProfileViewDetailed[] = [];
      for (var i = 0; i < followerDIDs.length; i++) {
        const profile = await getProfile(agent!, followerDIDs[i]);
        if (profile) {
          profiles.push(profile);
        }
      }
      // let outputString = '';
      // profiles
      //   .sort((a, b) => a.followsCount! - b.followsCount!)
      //   .forEach((profile) => {
      //     if (profile.followsCount! > 4000) {
      //       outputString += '"' + profile.did + '",';
      //       console.log('"' + profile.did + '",');
      //     }
      //   });
      // console.log(outputString);
    }
    if (agent && followerDIDs.length > 0) {
      getFollowerDetails();
    }
  }, [followerDIDs]);
  // ****************************** End blacklist building ******************************

  return (
    <div className="pt-8">
      <div className="mb-4">This is just a list of your followers: </div>
      <div className="max-h-[600px] overflow-x-hidden mt-2">
        <List
          className="list"
          height={400}
          itemCount={followerDIDs.length}
          itemSize={112}
          width={'100%'}
          itemKey={(index) => followerDIDs[index]}
        >
          {({ index, style }) => {
            return <ProfileListItem did={followerDIDs[index]} style={style} />;
          }}
        </List>
      </div>
    </div>
  );
};

export default TestAction;
