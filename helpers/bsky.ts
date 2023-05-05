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
const followsDIDCache: Map<string, string[]> = new Map();
const followersDIDCache: Map<string, string[]> = new Map();
const profileCache: Map<string, ProfileViewDetailed> = new Map();

export async function getMyProfile(
  agent: BskyAgent,
  identifier: string
): Promise<ProfileViewDetailed | null> {
  return getProfile(agent, identifier, false);
}

export async function getProfile(
  agent: BskyAgent,
  identifier: string,
  bypassCache: boolean = false
): Promise<ProfileViewDetailed | null> {
  if (!bypassCache) {
    if (profileCache.has(identifier)) {
      return profileCache.get(identifier)!;
    }
  }

  let profile = null;
  const response = await agent.getProfile({ actor: identifier });

  if (response.success) {
    profile = response.data;
    if (!bypassCache) {
      profileCache.set(identifier, profile);
    }
  }

  return profile;
}

async function getData(
  {
    agent,
    identifier,
    limit = 100,
    maxPages = 40,
    bypassDB = false,
    bypassCache = false
  }: BskyRequest,
  cache: Map<string, string[]>,
  fn: typeof agent.getFollows | typeof agent.getFollowers,
  call: 'follows' | 'followers'
): Promise<string[]> {
  console.log(typeof fn, typeof agent.getFollows);

  if (!bypassCache) {
    // Check if in-memory cache has it
    if (cache.has(identifier)) {
      console.log(`Hit cache for: ${call} - ${identifier}`);
      return cache.get(identifier)!;
    }
  }

  if (!bypassDB) {
    // Check if DB has it
    console.log(`Checking DB for: ${call} - ${identifier}`);
    const fromDB = await fetch(`/api/db/${call}?did=${identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((r) => r.json());

    // If found in DB, update the cache and return
    if (fromDB.length > 0) {
      console.log(`Found in DB: ${call} - ${identifier}`);

      if (!bypassCache) {
        cache.set(identifier, fromDB);
      }

      return fromDB;
    }
  }

  // Fetch from API
  let data: string[] = [];
  let cursor;
  for (let i = 0; i < maxPages; i++) {
    console.log(`Getting from API: ${call} - ${identifier}`);
    const response = await fn({ actor: identifier, limit, cursor });

    if (response.success) {
      data = data.concat(
        (response.data[call] as ProfileView[]).map((profile) => profile.did)
      );
      console.log(`Loaded so far: ${call} - ${identifier} - ${data.length}`);
      if (
        !response.data.cursor ||
        (response.data[call] as ProfileView[]).length === 0
      ) {
        break;
      }
      cursor = response.data.cursor as string;
    } else {
      // TODO: Handle error
      console.error(response);
      break;
    }
    // Wait a tiny bit before hitting API again cuz we're nice
    await new Promise((r) => setTimeout(r, NEXT_PAGE_WAIT));
  }

  if (!bypassCache) {
    // UPdate the cache
    cache.set(identifier, data);
  }

  if (!bypassDB) {
    // Update the DB  - no need to await this
    fetch(`/api/db/${call}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        did: identifier,
        data
      })
    });
  }

  return data;
}

export type BskyRequest = {
  agent: BskyAgent;
  identifier: string;
  limit?: number;
  maxPages?: number;
  bypassDB?: boolean;
  bypassCache?: boolean;
};

export async function getFollowsDID(request: BskyRequest): Promise<string[]> {
  return getData(request, followsDIDCache, request.agent.getFollows, 'follows');
}

export async function getFollowersDID(request: BskyRequest): Promise<string[]> {
  return getData(
    request,
    followersDIDCache,
    request.agent.getFollowers,
    'followers'
  );
}
