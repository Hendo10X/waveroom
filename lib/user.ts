"use server";
import { db } from "@/db/drizzle";
import { user, post, playlist } from "@/db/schema";
import { eq, count } from "drizzle-orm";

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
