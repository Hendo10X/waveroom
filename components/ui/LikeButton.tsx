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
      className={`flex items-center gap-2 transition-colors ${
        liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Heart className={`w-4 ${liked ? "fill-current" : ""}`} />
      <span className="text-xs">Like</span>
      <span className="text-xs">{likeCount}</span>
    </button>
  );
} 