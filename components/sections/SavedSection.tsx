import React, { useEffect, useState } from "react";
import { getBookmarks } from "@/lib/user";
import { authClient } from "@/lib/auth-client";

export function SavedSection({
  data,
}: {
  data: { title: string; content: string };
}) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [bookmarks, setBookmarks] = useState<{ id: string; type: string; targetId: string }[]>([]);

  useEffect(() => {
    if (!userId) return;
    getBookmarks(userId).then(setBookmarks);
  }, [userId]);

  return (
    <div className="ml-2 text-foreground ">
      <h1 className="text-sm font-bold mb-4 text-foreground">{data.title}</h1>
      <p className="text-sm text-foreground mb-4">{data.content}</p>
      <h2 className="text-xs font-semibold mb-2 text-foreground">
        Your Bookmarks
      </h2>
      <ul className="text-xs">
        {bookmarks.length === 0 && <li>No bookmarks yet.</li>}
        {bookmarks.map((bm) => (
          <li key={bm.id}>
            {bm.type === "post"
              ? `Post: ${bm.targetId}`
              : `Playlist: ${bm.targetId}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
