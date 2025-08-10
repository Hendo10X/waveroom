"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
import { createPost, getPosts } from "@/lib/post";
import { authClient } from "@/lib/auth-client";
import { getUserById } from "@/lib/user";
import { Loader2, ArrowDown, Bookmark } from "lucide-react";
import { HeartButton } from "@/components/shsfui/button/heart-button";
import { CommentButton, CommentThread } from "@/components/ui/CommentButton";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/user";

function formatDateAndTime(date: Date) {
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
  post: {
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
    likesCount: number;
  };
  session: { user: { id: string } } | null;
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

  useEffect(() => {
    if (!session?.user?.id) return;
    isBookmarked(session.user.id, post.id, "post").then(setBookmarked);
  }, [session?.user?.id, post.id]);
  const handleBookmark = async () => {
    if (!session?.user?.id) return;
    if (!bookmarked) {
      await addBookmark(session.user.id, post.id, "post");
      setBookmarked(true);
      toast.success("Bookmark successfully added");
    } else {
      await removeBookmark(session.user.id, post.id, "post");
      setBookmarked(false);
      toast("Bookmark removed");
    }
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

export function DiscussionSection() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<
    {
      id: string;
      content: string;
      authorId: string;
      createdAt: Date;
      likesCount: number;
    }[]
  >([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [commentThreads, setCommentThreads] = useState<Set<string>>(new Set());
  const [visiblePosts, setVisiblePosts] = useState(7);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [authorNamesLoading, setAuthorNamesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await getPosts();
    setPosts(res || []);
    setLoading(false);
    // After posts are loaded, fetch all author names
    if (res && res.length > 0) {
      setAuthorNamesLoading(true);
      const uniqueAuthorIds = Array.from(
        new Set(res.map((post: { authorId: string }) => post.authorId))
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
  }, [authorNames]);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || !session?.user?.id) return;
    setSubmitting(true);

    // Create an optimistic post object
    const optimisticPost = {
      id: `optimistic-${Date.now()}`,
      content,
      authorId: session.user.id,
      createdAt: new Date(),
      likesCount: 0,
    };
    setPosts((prev) => [optimisticPost, ...prev]);
    setContent("");

    try {
      createPost({ content, authorId: session.user.id });
      // Re-fetch posts to get the real data (with correct id, etc.)
      fetchPosts();
    } catch {
      // Remove the optimistic post if the backend call fails
      setPosts((prev) => prev.filter((p) => p.id !== optimisticPost.id));
    } finally {
      setSubmitting(false);
    }
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
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
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
            className={`items-center gap-2 rounded-lg px-5 md:px-3 py-1 md:py-2 font-medium text-sm md:text-base mt-2 transition-all duration-200 ${
              submitting || !content.trim() || !session?.user?.id
                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-50"
                : "bg-[#A2EE2F] text-black opacity-90 hover:opacity-100"
            }`}
            disabled={submitting || !content.trim() || !session?.user?.id}
            whileHover={
              submitting || !content.trim() || !session?.user?.id
                ? {}
                : { scale: 1.02 }
            }
            whileTap={
              submitting || !content.trim() || !session?.user?.id
                ? {}
                : { scale: 0.98 }
            }
            transition={{ duration: 0.2 }}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-sm">Say your mind</span>
            )}
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
