import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, PlusIcon } from "lucide-react";
import { Trash2, Heart, Share2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Playlist {
  id: string;
  name: string;
  description: string;
  link: string;
  userId: string;
  userName: string;
  image?: string;
  createdAt: string;
}

function PlaylistCard({
  playlist,
  onDelete,
  isOwner,
}: {
  playlist: Playlist;
  onDelete: (id: string) => void;
  isOwner: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  return (
    <div className="flex flex-col items-center w-full max-w-[200px] mx-auto">
      <div
        className="w-full aspect-square bg-background rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800  relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {playlist.image && (
          <img
            src={playlist.image}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/40 transition-opacity ${
            hovered ? "opacity-100" : "opacity-0"
          } group-hover:opacity-100`}>
          {isOwner && (
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                  title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this playlist? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(playlist.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <button
            className="bg-white/80 hover:bg-white text-red-500 rounded-full p-2"
            title="Like">
            <Heart className="w-5 h-5" />
          </button>
          <button
            className="bg-white/80 hover:bg-white text-blue-500 rounded-full p-2"
            title="Share"
            onClick={() =>
              navigator.share
                ? navigator.share({
                    title: playlist.name,
                    url: window.location.origin + playlist.link,
                  })
                : navigator.clipboard.writeText(
                    window.location.origin + playlist.link
                  )
            }>
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="text-center w-full text-md mt-2">
        <h2 className="font-semibold text-base mb-1 w-full font-dm-mono uppercase truncate">
          {playlist.name}
        </h2>
        {playlist.description && (
          <p className="text-xs text-muted-foreground mb-1 break-words w-full font-dm-mono uppercase">
            {playlist.description}
          </p>
        )}
        <p className="text-xs text-foreground mb-1 font-dm-mono uppercase">
          @{playlist.userName || "Anonymous"}
        </p>
        <a
          href={playlist.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#1DB954] hover:underline break-all font-dm-mono uppercase">
          View Playlist
        </a>
      </div>
    </div>
  );
}

export function PlaylistSection({
  data,
}: {
  data: { title: string; content: string };
}) {
  const { data: session } = authClient.useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      const res = await fetch("/api/playlist");
      const data = await res.json();
      setPlaylists(data);
      setLoading(false);
    }
    fetchPlaylists();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !link.trim() ||
      !session?.user?.id ||
      !session.user.name
    )
      return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("userId", session.user.id);
    formData.append("userName", session.user.name);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const res = await fetch("/api/playlist", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const newPlaylist = await res.json();
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setName("");
      setDescription("");
      setLink("");
      setImageFile(null);
      setImagePreview("");
      setOpen(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/playlist?id=${id}`, { method: "DELETE" });
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h1 className="text-lg font-bold mb-4 text-muted-foreground">
        Playlist{" "}
        <span className="text-lg text-muted-foreground">
          ({playlists.length})
        </span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-4xl mx-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-full aspect-square rounded-lg border border-neutral-200 dark:border-neutral-800 bg-background flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <PlusIcon className="w-12 h-12 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle>Add Playlist</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 w-full"
              encType="multipart/form-data">
              <input
                type="text"
                className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
                placeholder="Playlist name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="url"
                className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
                placeholder="Playlist link (Spotify, YouTube, etc.)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-background"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mb-2 mx-auto"
                />
              )}
              <button
                type="submit"
                className="bg-[#A2EE2F] text-black rounded px-4 py-2 font-medium text-sm disabled:opacity-50 mt-2"
                disabled={
                  submitting ||
                  !name.trim() ||
                  !link.trim() ||
                  !session?.user?.id
                }>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Playlist"
                )}
              </button>
            </form>
          </DialogContent>
        </Dialog>
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground">
            Loading playlists...
          </div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No playlists yet. Be the first to add one!
          </div>
        ) : (
          playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDelete}
              isOwner={session?.user?.id === playlist.userId}
            />
          ))
        )}
      </div>
    </div>
  );
}
