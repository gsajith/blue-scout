import { BskyAgent, AtpAgent } from '@atproto/api';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

export type LoginResponse = {
  accessJwt: string;
  did: string;
  email?: string;
  handle: string;
  refreshJwt: string;
};

const NEXT_PAGE_WAIT = 50;
const followsCache: Map<string, ProfileView[]> = new Map();
const followersCache: Map<string, ProfileView[]> = new Map();
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
  limit: number = 100,
  maxPages: number = 20
): Promise<ProfileView[]> {
  console.log(followsCache);
  if (followsCache.has(identifier)) {
    return followsCache.get(identifier)!;
  }

  let follows: ProfileView[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollows({
      actor: identifier,
      limit,
      cursor
    });

    if (response.success) {
      follows = follows.concat(response.data.follows);
      console.log(identifier, follows.length);
      if (!response.data.cursor || response.data.follows.length === 0) {
        break;
      }
      cursor = response.data.cursor;
    } else {
      console.error(response);
      break;
    }
    await new Promise((r) => setTimeout(r, NEXT_PAGE_WAIT));
  }
  followsCache.set(identifier, follows);
  return follows;
}

export async function getFollowers(
  agent: BskyAgent,
  identifier: string,
  limit: number = 100,
  maxPages: number = 20
): Promise<ProfileView[]> {
  if (followersCache.has(identifier)) {
    return followersCache.get(identifier)!;
  }
  let followers: ProfileView[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollowers({
      actor: identifier,
      limit,
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
    await new Promise((r) => setTimeout(r, NEXT_PAGE_WAIT));
  }
  followersCache.set(identifier, followers);
  return followers;
}
