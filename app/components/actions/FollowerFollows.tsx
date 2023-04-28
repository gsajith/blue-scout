'use client';
import { getAPIResult } from '@/app/api/db/getResult';
import { useAuth } from '@/app/context/AuthProvider';
import { getFollowers, getFollows } from '@/helpers/bsky';
import { getResult } from '@/helpers/db';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { useEffect, useState } from 'react';

const FollowerFollows = () => {
  const { agent, loginResponseData } = useAuth();
  const [followers, setFollowers] = useState<ProfileView[]>([]);
  const [followerFollows, setFollowerFollows] = useState<
    Map<string, ProfileView[]>
  >(new Map());
  const [followerFollowsMap, setFollowerFollowsMap] = useState<
    Map<string, number>
  >(new Map());

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchFollowers() {
      const response = await getFollowers(agent!, loginResponseData!.handle);
      if (response) {
        setFollowers(response);
        console.log(response);
        response.forEach((person) => console.log(person.did.length));
      }
    }
    fetchFollowers();
    // setFollowers([{ handle: 'newmodernscience.com' } as ProfileView]);
  }, [agent, loginResponseData]);

  // useEffect(() => {
  //   async function fetchFollowerFollows() {
  //     for (let i = 0; i < followers.length; i++) {
  //       console.log('Fetching for ', followers[i].handle);
  //       setProgress(i + 1);
  //       const response = await getFollows(agent!, followers[i].handle);
  //       if (response) {
  //         setFollowerFollows(
  //           (map) => new Map(map.set(followers[i].handle, response))
  //         );
  //         response.forEach((profile) => {
  //           setFollowerFollowsMap(
  //             (map) =>
  //               new Map(
  //                 map.set(
  //                   profile.handle,
  //                   map.has(profile.handle) ? map.get(profile.handle)! + 1 : 1
  //                 )
  //               )
  //           );
  //         });
  //         await new Promise((r) => setTimeout(r, 100));
  //       }
  //     }
  //   }
  //   fetchFollowerFollows();

  //   return () => {
  //     setFollowerFollowsMap(new Map());
  //     setProgress(0);
  //   };
  // }, [followers]);

  useEffect(() => {
    async function getThing() {
      fetch('/api/db/following', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          did: 'testdid',
          following: ['nobody']
        })
      })
        .then((r) => r.text())
        .then((r) => console.log(r));
    }
    getThing();
  }, []);

  return (
    <div>
      Done {progress} / {followers.length}
      {Array.from(followerFollowsMap, ([key, value]) => ({ key, value }))
        .filter((item) => item.value > 5)
        .sort((a, b) => (a.value < b.value ? 1 : -1))
        .map((item, index) => {
          return (
            <div key={index}>
              {item.key}: {item.value}
            </div>
          );
        })}
    </div>
  );
};

export default FollowerFollows;
