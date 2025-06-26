import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('bitlinks');
    const clicks = await db.collection('clicks').find({}).toArray();

    const aggregated = clicks.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(aggregated).map(([date, clicks]) => ({ date, clicks }));

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
