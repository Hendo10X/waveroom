import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getLikeCount, hasUserLiked, toggleLike } from "@/lib/post";
import { authClient } from "@/lib/auth-client";

export function LikeButton({ postId }: { postId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    async function fetchLikeData() {
      setLikeCount(await getLikeCount(postId));
      if (userId) setLiked(await hasUserLiked(postId, userId));
    }
    fetchLikeData();
  }, [postId, userId, mounted]);

  const handleLike = async () => {
    if (!userId) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    setAnimate(true);
    setTimeout(() => setAnimate(false), 350);
    try {
      await toggleLike(postId, userId);
    } catch (e) {
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? 1 : -1));
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleLike}
      disabled={!userId}
      className={`relative flex items-center justify-center gap-2 transition-colors ${
        liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
      }`}
      style={{ minWidth: 36, minHeight: 36 }}
    >
      <Heart
        className={`w-4 h-4 ${animate ? "animate-like-bounce" : ""} ${liked ? "fill-current" : ""}`}
      />
      <span className="text-xs font-bold">{likeCount}</span>
    </button>
  );
}

// Add this to your global CSS or Tailwind config:
// .animate-like-bounce { animation: like-bounce 0.35s cubic-bezier(.36,1.7,.3,.9); }
// @keyframes like-bounce { 0% { transform: scale(1); } 30% { transform: scale(1.3); } 60% { transform: scale(0.9); } 100% { transform: scale(1); } } 