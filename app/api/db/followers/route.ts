import { PLANETSCALE_CONNECTION } from '@/helpers/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const did = request.nextUrl.searchParams.get('did');
  if (did !== null && typeof did !== 'undefined') {
    PLANETSCALE_CONNECTION.execute(
      `SELECT * FROM followers WHERE (User) = '${did}'`,
      [1]
    );
  }

  return new Response('Got from planetscale Followers table');
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const did = json.did;
  const followers = json.followers;
  if (
    typeof followers !== 'undefined' &&
    followers !== null &&
    followers.length > 0 &&
    did !== null &&
    typeof did !== 'undefined'
  ) {
    await PLANETSCALE_CONNECTION.execute(
      `INSERT INTO followers (User, Followers) VALUES('${did}', JSON_ARRAY('${followers.join(
        "', '"
      )}')) ON DUPLICATE KEY UPDATE Followers = JSON_ARRAY('${followers.join(
        "', '"
      )}')`,
      [1]
    );
  }

  return new Response('Inserted into Planetscale Followers table');
}
