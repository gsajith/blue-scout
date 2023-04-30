'use client';
import { useAuth } from '@/app/auth/AuthProvider';
import { getFollowersDID, getFollowsDID } from '@/helpers/bsky';
import { useEffect, useState } from 'react';
import ProfileListItem from '../ProfileListItem';

const FollowerFollows = () => {
  const { agent, loginResponseData } = useAuth();
  const [followerDIDs, setFollowerDIDs] = useState<string[]>([]);
  const [resultCounter, setResultCounter] = useState<
    Map<string, { followedByDIDs: string[] }>
  >(new Map());

  const [progress, setProgress] = useState(0);

  // TODO: Stop all API requests when user leaves this page

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
        for (let i = 0; i < 1; i++) {
          setProgress(i + 1);
          console.log('getting', followerDIDs[i]);
          const result = await getFollowsDID(agent!, followerDIDs[i]);
          if (result) {
            result.forEach((followerDID) => {
              setResultCounter(
                (map) =>
                  new Map(
                    map.set(followerDID, {
                      followedByDIDs: map.has(followerDID)
                        ? [
                            ...map.get(followerDID)!.followedByDIDs,
                            followerDIDs[i]
                          ]
                        : [followerDIDs[i]]
                    })
                  )
              );
            });
            await new Promise((r) => setTimeout(r, 50));
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

  return (
    <div>
      <div className="max-h-[600px] overflow-y-scroll overflow-x-hidden mt-2">
        {Array.from(resultCounter, ([key, value]) => ({ key, value }))
          .sort((a, b) =>
            a.value.followedByDIDs.length < b.value.followedByDIDs.length
              ? 1
              : -1
          )
          .map((item, index) => {
            return (
              <ProfileListItem
                key={index}
                did={item.key}
                count={item.value.followedByDIDs.length}
              />
            );
          })}
      </div>
      <div className="mt-4">
        Fetched {progress} / {followerDIDs.length}
      </div>
    </div>
  );
};

export default FollowerFollows;
