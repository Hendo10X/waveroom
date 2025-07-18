import React from "react";

export function SavedSection({ data }: { data: { title: string; content: string } }) {
  return (
    <div>
      <h1 className="text-sm font-bold mb-4">{data.title}</h1>
      <p className="text-sm text-foreground">{data.content}</p>
    </div>
  );
} 