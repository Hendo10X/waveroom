"use server";
import { db } from "@/db/drizzle";
import { user, post, playlist, bookmark } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function getUsers() {
  try {
    const allUsers = await db.select().from(user);
    return allUsers;
  } catch (error) {
    console.error(error, "Error fetching users");
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.error(error, "Error fetching user by id");
    return null;
  }
}

export async function getUserPostCount(userId: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(post)
      .where(eq(post.authorId, userId));
    return result[0]?.count ?? 0;
  } catch (error) {
    console.error(error, "Error counting user posts");
    return 0;
  }
}

export async function getUserPlaylistCount(userId: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(playlist)
      .where(eq(playlist.userId, userId));
    return result[0]?.count ?? 0;
  } catch (error) {
    console.error(error, "Error counting user playlists");
    return 0;
  }
}

export async function addBookmark(
  userId: string,
  targetId: string,
  type: "post" | "playlist"
) {
  await db.insert(bookmark).values({
    id: crypto.randomUUID(),
    userId,
    targetId,
    type,
    createdAt: new Date(),
  });
}

export async function removeBookmark(
  userId: string,
  targetId: string,
  type: "post" | "playlist"
) {
  await db
    .delete(bookmark)
    .where(
      and(
        eq(bookmark.userId, userId),
        eq(bookmark.targetId, targetId),
        eq(bookmark.type, type)
      )
    );
}

export async function isBookmarked(
  userId: string,
  targetId: string,
  type: "post" | "playlist"
) {
  const result = await db
    .select()
    .from(bookmark)
    .where(
      and(
        eq(bookmark.userId, userId),
        eq(bookmark.targetId, targetId),
        eq(bookmark.type, type)
      )
    );
  return result.length > 0;
}

export async function getBookmarks(userId: string) {
  return db.select().from(bookmark).where(eq(bookmark.userId, userId));
}
