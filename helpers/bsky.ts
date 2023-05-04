import { BskyAgent } from '@atproto/api';
import {
  ProfileView,
  ProfileViewDetailed
} from '@atproto/api/dist/client/types/app/bsky/actor/defs';

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
const followsDIDCache: Map<string, string[]> = new Map();
const followersDIDCache: Map<string, string[]> = new Map();
const profileCache: Map<string, ProfileViewDetailed> = new Map();

export async function getMyProfile(
  agent: BskyAgent,
  identifier: string
): Promise<ProfileViewDetailed | null> {
  let profile = null;
  const response = await agent.getProfile({ actor: identifier });

  if (response.success) {
    profile = response.data;
  }

  return profile;
}

export async function getProfile(
  agent: BskyAgent,
  identifier: string
): Promise<ProfileViewDetailed | null> {
  if (profileCache.has(identifier)) {
    return profileCache.get(identifier)!;
  }

  let profile = null;
  const response = await agent.getProfile({ actor: identifier });

  if (response.success) {
    profile = response.data;
    profileCache.set(identifier, profile);
  }

  return profile;
}

export async function getFollows(
  agent: BskyAgent,
  identifier: string,
  limit: number = 100,
  maxPages: number = 20
): Promise<ProfileView[]> {
  // Check if in-memory cache has it
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
      // TODO: Handle error
      console.error(response);
      break;
    }
    await new Promise((r) => setTimeout(r, NEXT_PAGE_WAIT));
  }
  followsCache.set(identifier, follows);
  return follows;
}

export async function getFollowsDID(
  agent: BskyAgent,
  identifier: string,
  limit: number = 100,
  maxPages: number = 20
): Promise<string[]> {
  // Check if in-memory cache has it
  if (followsDIDCache.has(identifier)) {
    console.log('Hit cache for follows', identifier);
    return followsDIDCache.get(identifier)!;
  }

  // Check if DB has it
  console.log('Checking DB for follows', identifier);
  const followingFromDb = await fetch(`/api/db/following?did=${identifier}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r) => r.json());

  // Update the cache and return
  if (followingFromDb.length > 0) {
    console.log('Found DB follows for', identifier);
    followsDIDCache.set(identifier, followingFromDb);
    return followingFromDb;
  }

  // Fetch from API
  let follows: string[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollows({
      actor: identifier,
      limit,
      cursor
    });

    if (response.success) {
      follows = follows.concat(
        response.data.follows.map((profile) => profile.did)
      );
      console.log('Fetching from follows API:');
      console.log(identifier, follows.length);
      if (!response.data.cursor || response.data.follows.length === 0) {
        break;
      }
      cursor = response.data.cursor;
    } else {
      // TODO: Handle error
      console.error(response);
      break;
    }
    await new Promise((r) => setTimeout(r, NEXT_PAGE_WAIT));
  }

  // Update the cache
  followsDIDCache.set(identifier, follows);

  // Update the DB - no need to await
  fetch('/api/db/following', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      did: identifier,
      following: follows
    })
  });
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

export async function getFollowersDID(
  agent: BskyAgent,
  identifier: string,
  limit: number = 100,
  maxPages: number = 40
): Promise<string[]> {
  // Check if in-memory cache has it
  if (followersDIDCache.has(identifier)) {
    console.log('Hit cache for followers', identifier);
    return followersDIDCache.get(identifier)!;
  }

  // Check if DB has it
  // const followersFromDb = await fetch(`/api/db/followers?did=${identifier}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then((r) => r.json());

  // Update the cache and return
  // if (followersFromDb.length > 0) {
  //   console.log('Found DB followers for', identifier);
  //   followersDIDCache.set(identifier, followersFromDb);
  //   return followersFromDb;
  // }

  let followers: string[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    const response = await agent.getFollowers({
      actor: identifier,
      limit,
      cursor
    });

    if (response.success) {
      followers = followers.concat(
        response.data.followers.map((profile) => profile.did)
      );
      console.log('Fetching from followers API:');
      console.log(identifier, followers.length);
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

  // Update the cache
  followersDIDCache.set(identifier, followers);

  // Update the DB - no need to await
  fetch('/api/db/followers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      did: identifier,
      followers: followers
    })
  });
  return followers;
}
