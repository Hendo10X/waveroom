"use server";

import { db } from "@/db/drizzle";
import { post, postLike, comment as commentTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

type Post = InferSelectModel<typeof post>;
type NewPost = InferInsertModel<typeof post>;

export async function getPosts() {
  try {
    const allPosts = await db
      .select()
      .from(post)
      .where(eq(post.isPublished, true))
      .orderBy(desc(post.createdAt));
    return allPosts;
  } catch (error) {
    console.error(error, "Error fetching posts");
    return null;
  }
}

export async function getPostsByUser(userId: string) {
  try {
    const userPosts = await db
      .select()
      .from(post)
      .where(and(eq(post.authorId, userId), eq(post.isPublished, true)))
      .orderBy(desc(post.createdAt));
    return userPosts;
  } catch (error) {
    console.error(error, "Error fetching user posts");
    return null;
  }
}

export async function getPostById(id: string) {
  try {
    const [postData] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));
    return postData;
  } catch (error) {
    console.error(error, "Error fetching post");
    return null;
  }
}

export async function createPost(postData: Omit<NewPost, "id" | "createdAt" | "updatedAt" | "likesCount" | "commentsCount">) {
  try {
    const [newPost] = await db
      .insert(post)
      .values({
        ...postData,
        id: crypto.randomUUID(),
      })
      .returning();
    
    revalidatePath("/dashboard");
    return newPost;
  } catch (error) {
    console.error(error, "Error creating post");
    return null;
  }
}

export async function updatePost(id: string, postData: Partial<Omit<Post, "id" | "createdAt" | "updatedAt" | "likesCount" | "commentsCount">>) {
  try {
    const [updatedPost] = await db
      .update(post)
      .set({
        ...postData,
        updatedAt: new Date(),
      })
      .where(eq(post.id, id))
      .returning();
    
    revalidatePath("/dashboard");
    return updatedPost;
  } catch (error) {
    console.error(error, "Error updating post");
    return null;
  }
}

export async function deletePost(id: string) {
  try {
    await db.delete(post).where(eq(post.id, id));
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error(error, "Error deleting post");
    return null;
  }
}

export async function incrementLikes(id: string) {
  try {
   
    const [currentPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));
    
    if (!currentPost) return null;
    
    const [updatedPost] = await db
      .update(post)
      .set({
        likesCount: currentPost.likesCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(post.id, id))
      .returning();
    
    revalidatePath("/dashboard");
    return updatedPost;
  } catch (error) {
    console.error(error, "Error incrementing likes");
    return null;
  }
}

export async function decrementLikes(id: string) {
  try {
 
    const [currentPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));
    
    if (!currentPost) return null;
    
    const [updatedPost] = await db
      .update(post)
      .set({
        likesCount: Math.max(0, currentPost.likesCount - 1),
        updatedAt: new Date(),
      })
      .where(eq(post.id, id))
      .returning();
    
    revalidatePath("/dashboard");
    return updatedPost;
  } catch (error) {
    console.error(error, "Error decrementing likes");
    return null;
  }
}

export async function togglePostVisibility(id: string) {
  try {
    const [currentPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));
    
    if (!currentPost) return null;
    
    const [updatedPost] = await db
      .update(post)
      .set({
        isPublished: !currentPost.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(post.id, id))
      .returning();
    
    revalidatePath("/dashboard");
    return updatedPost;
  } catch (error) {
    console.error(error, "Error toggling post visibility");
    return null;
  }
} 


export async function getLikeCount(postId: string) {
  try {
    const count = await db
      .select()
      .from(postLike)
      .where(eq(postLike.postId, postId));
    return count.length;
  } catch (error) {
    console.error(error, "Error getting like count");
    return 0;
  }
}

export async function hasUserLiked(postId: string, userId: string) {
  try {
    const like = await db
      .select()
      .from(postLike)
      .where(and(eq(postLike.postId, postId), eq(postLike.userId, userId)));
    return like.length > 0;
  } catch (error) {
    console.error(error, "Error checking user like");
    return false;
  }
}

export async function toggleLike(postId: string, userId: string) {
  try {
    const existing = await db
      .select()
      .from(postLike)
      .where(and(eq(postLike.postId, postId), eq(postLike.userId, userId)));
    if (existing.length > 0) {
     
      await db.delete(postLike).where(and(eq(postLike.postId, postId), eq(postLike.userId, userId)));
    } else {
     
      await db.insert(postLike).values({
        id: crypto.randomUUID(),
        postId,
        userId,
        createdAt: new Date(),
      });
    }
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error(error, "Error toggling like");
    return false;
  }
}


export async function getComments(postId: string) {
  try {
    const comments = await db
      .select()
      .from(commentTable)
      .where(eq(commentTable.postId, postId))
      .orderBy(commentTable.createdAt);
   
    const map: Record<string, any[]> = {};
    comments.forEach(c => {
      if (!c.parentId) {
        map[c.id] = [];
      } else {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
   
    return comments.filter(c => !c.parentId).map(c => ({
      ...c,
      replies: map[c.id] || [],
    }));
  } catch (error) {
    console.error(error, "Error getting comments");
    return [];
  }
}

export async function addComment({ postId, authorId, content, parentId }: { postId: string, authorId: string, content: string, parentId?: string }) {
  try {
    const [newComment]: any = await db
      .insert(commentTable)
      .values({
        id: crypto.randomUUID(),
        postId,
        authorId,
        content,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    revalidatePath("/dashboard");
    return newComment;
  } catch (error) {
    console.error(error, "Error adding comment");
    return null;
  }
} 