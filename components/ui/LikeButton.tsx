import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getLikeCount, hasUserLiked, toggleLike } from "@/lib/post";
import { authClient } from "@/lib/auth-client";

export function LikeButton({ postId }: { postId: string }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLikeData() {
      setLoading(true);
      setLikeCount(await getLikeCount(postId));
      if (userId) setLiked(await hasUserLiked(postId, userId));
      setLoading(false);
    }
    fetchLikeData();
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId) return;
    setLoading(true);
    await toggleLike(postId, userId);
    setLikeCount(await getLikeCount(postId));
    setLiked(await hasUserLiked(postId, userId));
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || !userId}
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