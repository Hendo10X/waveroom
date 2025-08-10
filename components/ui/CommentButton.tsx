import { useState, useEffect } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { getComments, addComment } from "@/lib/post";
import { authClient } from "@/lib/auth-client";
import { getUserById } from "@/lib/user";

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentWithReplies extends Comment {
  replies: Comment[];
}

interface CommentButtonProps {
  postId: string;
  onThreadToggle?: (showThread: boolean) => void;
}

export function CommentThread({ postId }: { postId: string }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [mainComment, setMainComment] = useState("");
  const [replyInputs, setReplyInputs] = useState<{
    [commentId: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      const cs = (await getComments(postId)) as CommentWithReplies[];
      setComments(cs);

      // Fetch author names for all comments
      const names: Record<string, string> = {};
      for (const comment of cs) {
        if (!names[comment.authorId]) {
          const user = await getUserById(comment.authorId);
          names[comment.authorId] = user ? user.name : "Unknown";
        }
        if (comment.replies) {
          for (const reply of comment.replies) {
            if (!names[reply.authorId]) {
              const user = await getUserById(reply.authorId);
              names[reply.authorId] = user ? user.name : "Unknown";
            }
          }
        }
      }
      setAuthorNames(names);
      setLoading(false);
    }
    fetchComments();
  }, [postId]);

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleMainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainComment.trim() || !userId) return;
    setSubmitting(true);
    await addComment({ postId, authorId: userId, content: mainComment });
    setMainComment("");
    const updatedComments = (await getComments(postId)) as CommentWithReplies[];
    setComments(updatedComments);
    setSubmitting(false);
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    const replyText = replyInputs[parentId] || "";
    if (!replyText.trim() || !userId) return;
    setSubmitting(true);
    await addComment({
      postId,
      authorId: userId,
      content: replyText,
      parentId,
    });
    setReplyInputs((inputs) => ({ ...inputs, [parentId]: "" }));
    setReplyingTo(null);
    const updatedComments = (await getComments(postId)) as CommentWithReplies[];
    setComments(updatedComments);
    setSubmitting(false);
  };

  const renderThread = (comments: CommentWithReplies[], depth: number = 0) => (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="relative flex">
          {/* Vertical line for Reddit-style thread */}
          {depth > 0 && (
            <div
              className="absolute left-0 top-0 h-full flex"
              style={{ width: 16 * depth, pointerEvents: "none" }}>
              {[...Array(depth)].map((_, i) => (
                <div
                  key={i}
                  className="h-full w-px bg-neutral-300 dark:bg-neutral-700"
                  style={{ marginLeft: i === 0 ? 0 : 16 }}
                />
              ))}
            </div>
          )}
          <div
            style={{ marginLeft: depth * 16, flex: 1 }}
            className="flex-1 min-w-0">
            <div className="py-3 border-neutral-200 dark:border-neutral-800 last:border-b-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  @{authorNames[comment.authorId] || "..."}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-foreground mb-2">
                {comment.content}
              </div>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:underline mb-2"
                onClick={() => handleReplyClick(comment.id)}>
                Reply
              </button>
              {/* Reply form only for the comment being replied to */}
              {replyingTo === comment.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, comment.id)}
                  className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-1.5 text-sm bg-background"
                    placeholder="Reply to this comment..."
                    value={replyInputs[comment.id] || ""}
                    onChange={(e) =>
                      setReplyInputs((inputs) => ({
                        ...inputs,
                        [comment.id]: e.target.value,
                      }))
                    }
                    disabled={submitting}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-[#abed48] text-black rounded-lg font-medium disabled:opacity-50"
                    disabled={
                      submitting ||
                      !(replyInputs[comment.id] || "").trim() ||
                      !userId
                    }>
                    Reply
                  </button>
                </form>
              )}
            </div>
            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div>
                {renderThread(
                  comment.replies as CommentWithReplies[],
                  depth + 1
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-4 pb-4 border-neutral-200 dark:border-neutral-800">
      <form
        onSubmit={handleMainSubmit}
        className="flex gap-2 mb-4 pb-4 border-neutral-200 dark:border-neutral-800">
        <input
          type="text"
          className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-1.5 text-sm bg-background"
          placeholder="Write a comment..."
          value={mainComment}
          onChange={(e) => setMainComment(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[#abed48] hover:bg-[#99c940] text-black rounded-lg font-medium disabled:opacity-50"
          disabled={submitting || !mainComment.trim() || !userId}>
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Comment"
          )}
        </button>
      </form>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div>{renderThread(comments)}</div>
      )}
    </div>
  );
}

export function CommentButton({ postId, onThreadToggle }: CommentButtonProps) {
  const [commentCount, setCommentCount] = useState(0);
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    async function fetchCommentCount() {
      const cs = await getComments(postId);
      setCommentCount(cs.length);
    }
    fetchCommentCount();
  }, [postId]);

  const toggleThread = () => {
    const newShowThread = !showThread;
    setShowThread(newShowThread);
    onThreadToggle?.(newShowThread);
  };

  return (
    <button
      onClick={toggleThread}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
      <MessageCircle className="w-4 h-4" />{" "}
      <span className="text-xs">Comment</span>
      <span className="text-xs">{commentCount}</span>
    </button>
  );
}
