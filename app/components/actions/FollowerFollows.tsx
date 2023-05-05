'use client';
import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID, getFollowsDID } from '@/helpers/bsky';
import { useEffect, useState } from 'react';
import ProfileListItem from '../ProfileListItem';
import { FixedSizeList as List } from 'react-window';
import ProgressBar from '../ProgressBar';
import { BLACKLIST_DIDS } from '@/helpers/blacklist';

const FollowerFollows = () => {
  const { agent, loginResponseData } = useAuth();
  const [followerDIDs, setFollowerDIDs] = useState<string[]>([]);
  const [resultCounter, setResultCounter] = useState<
    Map<string, { followedByDIDs: string[] }>
  >(new Map());

  const [progress, setProgress] = useState(0);

  // TODO: Stop all API requests when user leaves this page
  // TODO: Remove yourself from this list
  // TODO: Show if you follow them or not?
  // TODO: Show if they follow you or not?

  // Get all of my followers
  useEffect(() => {
    async function fetchFollowers() {
      const response = await getFollowersDID(agent!, loginResponseData!.did);
      if (response) {
        console.log('Got my followers', response);
        setFollowerDIDs(response);
      }
    }
    fetchFollowers();
  }, [agent, loginResponseData]);

  // For each of my followers, get all the people they follow
  useEffect(() => {
    async function fetchFollowerFollows() {
      if (followerDIDs.length > 0) {
        for (let i = 0; i < followerDIDs.length; i++) {
          setProgress(i + 1);
          if (BLACKLIST_DIDS.indexOf(followerDIDs[i]) < 0) {
            console.log('getting', followerDIDs[i]);
            const result = await getFollowsDID(agent!, followerDIDs[i]);
            if (result) {
              setResultCounter((oldMap) => {
                const newMap = new Map(oldMap);
                result.forEach((followerDID) => {
                  newMap.set(followerDID, {
                    followedByDIDs: oldMap.has(followerDID)
                      ? [
                          ...oldMap.get(followerDID)!.followedByDIDs,
                          followerDIDs[i]
                        ]
                      : [followerDIDs[i]]
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
    fetchFollowerFollows();

    return () => {
      setResultCounter(new Map());
      setProgress(0);
    };
  }, [followerDIDs]);

  const sortedTrimmedResults = Array.from(resultCounter, ([key, value]) => ({
    key,
    value
  })).sort((a, b) =>
    a.value.followedByDIDs.length < b.value.followedByDIDs.length ? 1 : -1
  );

  return (
    <div>
      <div className="max-h-[610px] overflow-y-scroll overflow-x-hidden mt-2">
        <div className="flex flex-col p-6 bg-[#151729] mr-4 rounded-xl mb-6 mt-2">
          <span className="font-black mb-1">Most like you</span>
          <span className="font-light">
            People that are most followed by your audience/followers.
          </span>
          <div className="mt-3">
            <ProgressBar
              min={progress}
              max={followerDIDs.length}
              message={
                progress < followerDIDs.length
                  ? 'Scanning your followers...'
                  : 'Done scanning your followers.'
              }
            />
          </div>
        </div>
        <div className="flex flex-row justify-between ml-4 mr-8 mb-3 font-bold">
          <div>User</div>
          <div className="text-right"># of your followers who follow them</div>
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
                  {sortedTrimmedResults[index].value.followedByDIDs.length}
                </span>
              </ProfileListItem>
            );
          }}
        </List>
      </div>
    </div>
  );
};

export default FollowerFollows;
