import clientPromise from '@/lib/mongodb'; // ✅ default import

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('bitlinks');
    const urls = await db.collection('url').find({}).toArray();

    const mapped = urls.map(url => ({
      id: url._id.toString(),
      shortUrl: url.shorturl || '',
      originalUrl: url.url || '',
      clicks: url.clickCount || 0,
      status: 'active'
    }));

    return Response.json(mapped);
  } catch (err) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
