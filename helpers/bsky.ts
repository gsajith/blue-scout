import { BskyAgent } from '@atproto/api';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

export type LoginResponse = {
  accessJwt: string;
  did: string;
  email?: string;
  handle: string;
  refreshJwt: string;
};

let followsCache: ProfileView[] | null = null;
let followersCache: ProfileView[] | null = null;
let profileCache: ProfileViewDetailed | null = null;

export async function getMyProfile(
  agent: BskyAgent,
  identifier: string
): Promise<ProfileViewDetailed | null> {
  if (profileCache) return profileCache;

  let profile = null;
  const response = await agent.getProfile({ actor: identifier });

  if (response.success) {
    profile = response.data;
    profileCache = profile;
  }

  return profile;
}

export async function getFollows(
  agent: BskyAgent,
  identifier: string,
  maxPages: number = 10
): Promise<ProfileView[]> {
  if (followsCache) return followsCache;

  let follows: ProfileView[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollows({
      actor: identifier,
      cursor
    });

    if (response.success) {
      follows = follows.concat(response.data.follows);
      if (!response.data.cursor || response.data.follows.length === 0) {
        break;
      }
      cursor = response.data.cursor;
    } else {
      // TODO: Handle error
      break;
    }
  }
  followsCache = follows;
  return follows;
}
async function getFollowers(
  agent: BskyAgent,
  identifier: string,
  maxPages: number = 10
): Promise<ProfileView[]> {
  if (followersCache) return followersCache;
  let followers: ProfileView[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollowers({
      actor: identifier,
      cursor
    });

    if (response.success) {
      followers = followers.concat(response.data.followers);
      if (!response.data.cursor || response.data.followers.length === 0) {
        break;
      }
      cursor = response.data.cursor;
    } else {
      // TODO: Handle error
      break;
    }
  }
  followersCache = followers;
  return followers;
}
