"use client";
import { useState, useEffect, Suspense } from "react";
import { createPost, getPosts } from "@/lib/post";
import { authClient } from "@/lib/auth-client";
import { getUserById } from "@/lib/user";
import { Loader2, ArrowDown, Bookmark, BookmarkCheck } from "lucide-react";
import { HeartButton } from "@/components/shsfui/button/heart-button";
import { CommentButton, CommentThread } from "@/components/ui/CommentButton";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/user";

function formatDateAndTime(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const formattedDate = `${day}${getOrdinal(day)} ${month}`;
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} • ${formattedTime}`;
}

const postVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
};

const loadMoreVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

type DiscussionPostProps = {
  post: any;
  session: any;
  authorName: string;
  commentThreads: Set<string>;
  handleThreadToggle: (postId: string, showThread: boolean) => void;
};

function DiscussionPost({
  post,
  session,
  authorName,
  commentThreads,
  handleThreadToggle,
}: DiscussionPostProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (!session?.user?.id) return;
    isBookmarked(session.user.id, post.id, "post").then(setBookmarked);
  }, [session?.user?.id, post.id]);
  const handleBookmark = async () => {
    if (!session?.user?.id) return;
    setAnimating(true);
    if (!bookmarked) {
      await addBookmark(session.user.id, post.id, "post");
      setBookmarked(true);
      toast.success("Bookmark successfully added");
    } else {
      await removeBookmark(session.user.id, post.id, "post");
      setBookmarked(false);
      toast("Bookmark removed");
    }
    setTimeout(() => setAnimating(false), 250);
  };
  return (
    <motion.div
      key={post.id}
      variants={postVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="border-b border-neutral-200 dark:border-neutral-800 p-4 bg-background w-[95%] md:w-160 hover:bg-background dark:hover:bg-background cursor-pointer"
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-foreground">
          @{authorName}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDateAndTime(post.createdAt)}
        </span>
      </div>
      <div className="text-sm text-muted-foreground whitespace-pre-line mb-3">
        {post.content}
      </div>
      <div className="flex items-center gap-4 pt-2 border-neutral-100 dark:border-neutral-700">
        <CommentButton
          postId={post.id}
          onThreadToggle={(showThread) =>
            handleThreadToggle(post.id, showThread)
          }
        />
        <HeartButton
          postId={post.id}
          initialCount={0}
          maxClicks={1}
          label=""
          onCountChange={() => {}}
        />
        <motion.button
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          className="focus:outline-none transition-colors">
          <Bookmark
            className={`w-4 h-4 ${
              bookmarked ? "text-blue-500" : "text-muted-foreground"
            }`}
            fill={bookmarked ? "#3b82f6" : "none"}
            style={{ transition: "color 0.2s, fill 0.2s" }}
          />
        </motion.button>
      </div>
      <AnimatePresence>
        {commentThreads.has(post.id) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <CommentThread postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DiscussionSection({
  data,
}: {
  data: { title: string; content: string };
}) {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentThreads, setCommentThreads] = useState<Set<string>>(new Set());
  const [visiblePosts, setVisiblePosts] = useState(7);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [authorNamesLoading, setAuthorNamesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  async function fetchPosts() {
    setLoading(true);
    const res = await getPosts();
    setPosts(res || []);
    setLoading(false);
    // After posts are loaded, fetch all author names
    if (res && res.length > 0) {
      setAuthorNamesLoading(true);
      const uniqueAuthorIds = Array.from(
        new Set(res.map((post: any) => post.authorId))
      );
      await Promise.all(
        uniqueAuthorIds.map(async (authorId) => {
          if (!authorNames[authorId]) {
            const user = await getUserById(authorId);
            setAuthorNames((prev) => ({
              ...prev,
              [authorId]: user ? user.name : "Unknown",
            }));
          }
        })
      );
      setAuthorNamesLoading(false);
    }
  }

  async function fetchAuthorName(authorId: string) {
    if (authorNames[authorId]) return;
    const user = await getUserById(authorId);
    setAuthorNames((prev) => ({
      ...prev,
      [authorId]: user ? user.name : "Unknown",
    }));
  }

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session?.user?.id) return;
    setSubmitting(true);

    // Create an optimistic post object
    const optimisticPost = {
      id: `optimistic-${Date.now()}`,
      content,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      // Add any other fields your post object needs
    };
    setPosts((prev) => [optimisticPost, ...prev]);
    setContent("");

    try {
      createPost({ content, authorId: session.user.id });
      // Re-fetch posts to get the real data (with correct id, etc.)
      fetchPosts();
    } catch (err) {
      // Remove the optimistic post if the backend call fails
      setPosts((prev) => prev.filter((p) => p.id !== optimisticPost.id));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
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
    console.log("Comment on post:", postId);
  };

  const handleThreadToggle = (postId: string, showThread: boolean) => {
    setCommentThreads((prev) => {
      const newSet = new Set(prev);
      if (showThread) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Simulate a small delay for smooth animation
    await new Promise((resolve) => setTimeout(resolve, 300));
    setVisiblePosts((prev) => prev + 7);
    setIsLoadingMore(false);
  };

  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;

  return (
    <motion.div
      className="flex flex-col gap-4 ml-2 md:ml-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}>
        <textarea
          className="w-[95%] md:w-160 h-32 md:h-40 bg-background text-foreground border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 md:p-4 placeholder:text-[#828282] placeholder:text-sm resize-none text-sm md:text-base focus:outline-none focus:ring-0 mb-[-9px]"
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
        <div className="flex justify-end w-[95%] md:w-160">
          <motion.button
            type="submit"
            className="items-center gap-2 rounded-lg bg-[#A2EE2F] px-5 md:px-3 py-1 md:py-2 font-medium text-black opacity-90 text-sm md:text-base mt-2"
            disabled={submitting || !content.trim() || !session?.user?.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
          </motion.button>
        </div>
      </motion.form>
      <Suspense fallback={<div>Loading posts...</div>}>
        <div className="flex flex-col gap-4 mt-4">
          {!mounted || loading || authorNamesLoading ? (
            <motion.div
              className="flex w-[95%] md:w-160 md:h-40 justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}>
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              No posts yet.
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {displayedPosts.map((post) => (
                    <DiscussionPost
                      key={post.id}
                      post={post}
                      session={session}
                      authorName={authorNames[post.authorId] || "..."}
                      commentThreads={commentThreads}
                      handleThreadToggle={handleThreadToggle}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              <AnimatePresence>
                {hasMorePosts && (
                  <motion.div
                    className="flex justify-center w-[95%] md:w-160 pt-4"
                    variants={loadMoreVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden">
                    <motion.button
                      onClick={handleLoadMore}
                      className="flex items-center gap-2 rounded-lg bg-muted hover:bg-muted/80 px-6 py-2 font-medium text-foreground transition-colors"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "hsl(var(--muted))",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      disabled={isLoadingMore}>
                      {isLoadingMore ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      {isLoadingMore ? "Loading..." : "Load More Posts"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </Suspense>
    </motion.div>
  );
}
