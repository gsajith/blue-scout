'use client';
import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowsDID } from '@/helpers/bsky';
import { useEffect, useState } from 'react';
import ProfileListItem from '../ProfileListItem';
import { FixedSizeList as List } from 'react-window';
import ProgressBar from '../ProgressBar';
import { BLACKLIST_DIDS } from '@/helpers/blacklist';

// People that are most followed by the people you're following.
const YourInfluences = () => {
  const { agent, loginResponseData } = useAuth();
  const [followingDIDs, setFollowingDIDs] = useState<string[]>([]);
  const [resultCounter, setResultCounter] = useState<
    Map<string, { followsDIDs: string[] }>
  >(new Map());

  const [progress, setProgress] = useState(0);

  // TODO: Stop all API requests when user leaves this page
  // TODO: Remove yourself from this list
  // TODO: Show if you follow them or not?
  // TODO: Show if they follow you or not?

  // Get all of my following
  useEffect(() => {
    async function fetchFollowing() {
      const response = await getFollowsDID({
        agent: agent!,
        identifier: loginResponseData!.did,
        bypassDB: true
      });
      if (response) {
        console.log('Got my follows', response);
        setFollowingDIDs(response);
      }
    }
    fetchFollowing();
  }, [agent, loginResponseData]);

  // For each of my following, get all the people they follow
  useEffect(() => {
    async function fetchFollowingFollows() {
      if (followingDIDs.length > 0) {
        for (let i = 0; i < followingDIDs.length; i++) {
          setProgress(i + 1);
          if (BLACKLIST_DIDS.indexOf(followingDIDs[i]) < 0) {
            console.log('getting', followingDIDs[i]);
            const result = await getFollowsDID({
              agent: agent!,
              identifier: followingDIDs[i]
            });
            if (result) {
              setResultCounter((oldMap) => {
                const newMap = new Map(oldMap);
                result.forEach((followDID) => {
                  newMap.set(followDID, {
                    followsDIDs: oldMap.has(followDID)
                      ? [
                          ...oldMap.get(followDID)!.followsDIDs,
                          followingDIDs[i]
                        ]
                      : [followingDIDs[i]]
                  });
                });
                return newMap;
              });
              await new Promise((r) => setTimeout(r, 50));
            }
          }
        }
      }
    }
    fetchFollowingFollows();

    return () => {
      setResultCounter(new Map());
      setProgress(0);
    };
  }, [followingDIDs]);

  const sortedTrimmedResults = Array.from(resultCounter, ([key, value]) => ({
    key,
    value
  })).sort((a, b) =>
    a.value.followsDIDs.length < b.value.followsDIDs.length ? 1 : -1
  );

  return (
    <div>
      <div className="max-h-[610px] overflow-y-scroll overflow-x-hidden mt-2">
        <div className="flex flex-col p-6 bg-[#151729] mr-4 rounded-xl mb-6 mt-2">
          <span className="font-black mb-1">Your influences</span>
          <span className="font-light">
            People that are most followed by the people you're following.
          </span>
          <div className="mt-3">
            <ProgressBar
              min={progress}
              max={followingDIDs.length}
              message={
                progress < followingDIDs.length
                  ? 'Scanning your follows...'
                  : 'Done scanning your follows.'
              }
            />
          </div>
        </div>
        <div className="flex flex-row justify-between ml-4 mr-8 mb-3 font-bold">
          <div>User</div>
          <div className="text-right"># of your follows who follow them</div>
        </div>
        <List
          className="list"
          height={400}
          itemCount={sortedTrimmedResults.length}
          itemSize={120}
          width={'100%'}
          itemKey={(index) => sortedTrimmedResults[index].key}
        >
          {({ index, style }) => {
            return (
              <ProfileListItem
                did={sortedTrimmedResults[index].key}
                style={style}
              >
                <span className="font-bold text-white rounded-2xl bg-fuchsia-400 py-1 px-2">
                  {sortedTrimmedResults[index].value.followsDIDs.length}
                </span>
              </ProfileListItem>
            );
          }}
        </List>
      </div>
    </div>
  );
};

export default YourInfluences;
