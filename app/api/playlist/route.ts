import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { playlist } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';

// GET: fetch all playlists
export async function GET() {
  const playlists = await db.select().from(playlist).orderBy(desc(playlist.createdAt));
  return NextResponse.json(playlists);
}

// POST: add a new playlist
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = form.get("name") as string;
  const description = form.get("description") as string;
  const link = form.get("link") as string;
  const userId = form.get("userId") as string;
  const userName = form.get("userName") as string;
  const imageFile = form.get("image") as File | null;

  if (!name || !link || !userId || !userName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let imagePath = "";
  if (imageFile && imageFile.size > 0) {
    const ext = path.extname(imageFile.name) || '.png';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    imagePath = `/uploads/${fileName}`;
  }

  const [newPlaylist] = await db.insert(playlist).values({
    name,
    description,
    link,
    userId,
    userName,
    image: imagePath,
  }).returning();
  return NextResponse.json(newPlaylist);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(playlist).where(eq(playlist.id, id));
  return NextResponse.json({ success: true });
} 