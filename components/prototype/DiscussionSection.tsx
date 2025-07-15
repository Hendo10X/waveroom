

export function DiscussionSection({ data }: { data: { title: string; content: string } }) {
  return (
    <div>
      <h1 className="text-sm font-bold mb-4">{data.title}</h1>
      <p className="text-sm text-muted-foreground">{data.content}</p>
    </div>
  );
} 