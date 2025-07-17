"use client";
import { useState, useEffect } from "react";
import { createPost, getPosts } from "@/lib/post";
import { authClient } from "@/lib/auth-client";
import { getUserById } from "@/lib/user";
import { Loader2, MessageCircle, Heart } from "lucide-react";

function formatDateAndTime(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  // Ordinal suffix
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  const formattedDate = `${day}${getOrdinal(day)} ${month}`;
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${formattedDate} • ${formattedTime}`;
}

export function DiscussionSection({ data }: { data: { title: string; content: string } }) {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { data: session } = authClient.useSession();

  async function fetchPosts() {
    setLoading(true);
    const res = await getPosts();
    setPosts(res || []);
    setLoading(false);
  }

  async function fetchAuthorName(authorId: string) {
    if (authorNames[authorId]) return; // Already fetched
    const user = await getUserById(authorId);
    setAuthorNames(prev => ({ ...prev, [authorId]: user ? user.name : "Unknown" }));
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    posts.forEach(post => {
      if (post.authorId) fetchAuthorName(post.authorId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !session?.user?.id) return;
    setSubmitting(true);
    await createPost({ content, authorId: session.user.id });
    setContent("");
    await fetchPosts();
    setSubmitting(false);
  }

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  return (
    <div className="flex flex-col gap-4 ml-2 md:ml-7">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="w-[95%] md:w-160 h-32 md:h-40 bg-background text-foreground border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 md:p-4 placeholder:text-[#828282] placeholder:text-sm resize-none text-sm md:text-base focus:outline-none focus:ring-0 mb-[-9px]"
          placeholder="Share your thoughts..."
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={submitting}
        />
        <div className="flex justify-end w-[95%] md:w-160">
          <button
            type="submit"
            className="items-center gap-2 rounded-lg bg-[#A2EE2F] px-5 md:px-3 py-1 md:py-2 font-medium text-black opacity-60 text-sm md:text-base mt-2"
            disabled={submitting || !content.trim() || !session?.user?.id}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        {loading ? (
          <div>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground text-sm">No posts yet.</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="border-b border-neutral-200 dark:border-neutral-800  p-4 bg-background w-[95%] md:w-160">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">@{authorNames[post.authorId] || "..."}</span>
                <span className="text-xs text-muted-foreground">{formatDateAndTime(post.createdAt)}</span>
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-line mb-3">{post.content}</div>
              
              <div className="flex items-center gap-4 pt-2 border-neutral-100 dark:border-neutral-700">
                <button
                  onClick={() => handleComment(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Comment</span>
                </button>
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    likedPosts.has(post.id) 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className={`w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  <span className="text-xs">Like</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}