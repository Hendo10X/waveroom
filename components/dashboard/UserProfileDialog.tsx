"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  getUserById,
  getUserPostCount,
  getUserPlaylistCount,
} from "@/lib/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const genres = [
  "Rock",
  "Pop",
  "Hip-Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "R&B",
  "Reggae",
  "Metal",
];

async function getUserStats(userId: string) {
  const postCount = await getUserPostCount(userId);
  const playlistCount = await getUserPlaylistCount(userId);
  return { postCount, playlistCount };
}

export function UserProfileDialog({ trigger }: { trigger: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [user, setUser] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    getUserById(userId).then((u) => {
      setUser(u);
    });
    getUserStats(userId).then((stats) => {
      setPostCount(stats.postCount);
      setPlaylistCount(stats.playlistCount);
    });
  }, [userId]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton>
        <DialogTitle className="sr-only">User Profile</DialogTitle>
        <Card className="w-full max-w-lg mx-auto p-0 border-none shadow-none bg-background">
          <CardHeader className="pb-2">
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>User profile and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-2xl">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Posts made:</span> {postCount}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Playlists shared:</span>{" "}
                  {playlistCount}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
