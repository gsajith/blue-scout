import { PLANETSCALE_CONNECTION } from '@/helpers/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const did = request.nextUrl.searchParams.get('did');
  if (did !== null && typeof did !== 'undefined') {
    PLANETSCALE_CONNECTION.execute(
      `SELECT * FROM following WHERE (User) = '${did}'`,
      [1]
    );
  }

  return new Response('Got from planetscale Following table');
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const did = json.did;
  const following = json.following;
  if (
    typeof following !== 'undefined' &&
    following !== null &&
    following.length > 0 &&
    did !== null &&
    typeof did !== 'undefined'
  ) {
    PLANETSCALE_CONNECTION.execute(
      `INSERT INTO following (User, Following) VALUES('${did}', JSON_ARRAY('${following.join(
        "', '"
      )}')) ON DUPLICATE KEY UPDATE Following = JSON_ARRAY('${following.join(
        "', '"
      )}')`,
      [1]
    );
  }

  return new Response('Inserted into Planetscale Following table');
}
