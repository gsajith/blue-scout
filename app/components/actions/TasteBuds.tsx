'use client';
import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID, getFollowsDID } from '@/helpers/bsky';
import { useEffect, useState } from 'react';
import ProfileListItem from '../ProfileListItem';
import { FixedSizeList as List } from 'react-window';
import ProgressBar from '../ProgressBar';
import { BLACKLIST_DIDS } from '@/helpers/blacklist';

// Find people who follow the same people that you do.
const TasteBuds = () => {
  const { agent, loginResponseData } = useAuth();
  const [followingDIDs, setFollowingDIDs] = useState<string[]>([]);
  const [resultCounter, setResultCounter] = useState<
    Map<string, { followedByDIDs: string[] }>
  >(new Map());

  const [progress, setProgress] = useState(0);

  // TODO: Stop all API requests when user leaves this page
  // TODO: Remove yourself from this list
  // TODO: Show if you follow them or not?
  // TODO: Show if they follow you or not?
  // TODO: Sort this by % of their follows that overlaps with yours?

  // Get all of my following
  useEffect(() => {
    async function fetchFollowing() {
      const response = await getFollowsDID({
        agent: agent!,
        identifier: loginResponseData!.did
      });
      if (response) {
        console.log('Got my follows', response);
        setFollowingDIDs(response);
      }
    }
    fetchFollowing();
  }, [agent, loginResponseData]);

  // For each of my following, get all of their followers
  useEffect(() => {
    async function fetchFollowingFollowers() {
      if (followingDIDs.length > 0) {
        for (let i = 0; i < followingDIDs.length; i++) {
          setProgress(i + 1);
          if (BLACKLIST_DIDS.indexOf(followingDIDs[i]) < 0) {
            console.log('getting', followingDIDs[i]);
            const result = await getFollowersDID({
              agent: agent!,
              identifier: followingDIDs[i]
            });
            if (result) {
              setResultCounter((oldMap) => {
                const newMap = new Map(oldMap);
                result.forEach((followerDID) => {
                  newMap.set(followerDID, {
                    followedByDIDs: oldMap.has(followerDID)
                      ? [
                          ...oldMap.get(followerDID)!.followedByDIDs,
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
    fetchFollowingFollowers();

    return () => {
      setResultCounter(new Map());
      setProgress(0);
    };
  }, [followingDIDs]);

  const sortedTrimmedResults = Array.from(resultCounter, ([key, value]) => ({
    key,
    value
  }))
    .sort((a, b) =>
      a.value.followedByDIDs.length < b.value.followedByDIDs.length ? 1 : -1
    )
    .filter((item) => BLACKLIST_DIDS.indexOf(item.key) < 0);

  return (
    <div>
      <div className="max-h-[610px] overflow-y-scroll overflow-x-hidden mt-2">
        <div className="flex flex-col p-6 bg-[#151729] mr-4 rounded-xl mb-6 mt-2">
          <span className="font-black mb-1">Taste buds</span>
          <span className="font-light">
            Find people who follow the same people that you do.
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
          <div className="text-right"># of your follows they're following</div>
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

export default TasteBuds;
