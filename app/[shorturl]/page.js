import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export default async function Page({ params }) {
  const shorturl = params.shorturl;

  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("url");

  // Find the short URL
  const doc = await collection.findOne({ shorturl: shorturl });

  if (doc) {
    await collection.updateOne(
      { shorturl: shorturl },
      { $inc: { clickCount: 1 } }
    );

    await db.collection("clicks").insertOne({
      shorturl: shorturl,
      timestamp: new Date(),
    });

    redirect(doc.url);
  } else {
    // If not found, redirect to homepage or error page
    redirect(process.env.NEXT_PUBLIC_HOST || "/");
  }

  return null;
}
