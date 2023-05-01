import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID } from '@/helpers/bsky';
import { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProfileListItem from '../ProfileListItem';

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
          {({ index, style }) => {
            return <ProfileListItem did={followerDIDs[index]} style={style} />;
          }}
        </List>
      </div>
    </div>
  );
};

export default TestAction;
