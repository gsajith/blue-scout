import { PLANETSCALE_CONNECTION } from '@/helpers/db';

export async function GET(request) {
  const did = request.nextUrl.searchParams.get('did');
  console.log("Hit get follows with", did);
  if (did !== null && typeof did !== 'undefined') {
    const result = await PLANETSCALE_CONNECTION.execute(
      `SELECT * FROM following WHERE (User) = '${did}'`,
      [1]
    );

    if (result.rows.length > 0) {
      const storedDate = Date.parse(result.rows[0]['Date'] + ' GMT');
      const now = Date.now();

      // Invalidate if it's more than 48 hours old
      if (now - storedDate > (1000 * 60 * 60 * 24 * 2)) {
        return new Response(JSON.stringify([]))
      }
      return new Response(JSON.stringify(result.rows[0]['Following']))
    }
  }

  return new Response(JSON.stringify([]))
}

export async function POST(request) {
  const json = await request.json();
  const did = json.did;
  const following = json.data;
  console.log("Hit post follows with", did);
  if (
    typeof following !== 'undefined' &&
    following !== null &&
    following.length > 0 &&
    did !== null &&
    typeof did !== 'undefined'
  ) {
    PLANETSCALE_CONNECTION.execute(
      `INSERT INTO following (User, Following, Date) VALUES('${did}', JSON_ARRAY('${following.join(
        "', '"
      )}'), NOW()) ON DUPLICATE KEY UPDATE Following = JSON_ARRAY('${following.join(
        "', '"
      )}'), Date = NOW()`,
      [1]
    );
  }

  return new Response('Inserted into Planetscale Following table');
}
