export function DiscussionSection({ data }: { data: { title: string; content: string } }) {
  return (
    <div className="flex flex-col gap-4 ml-2 md:ml-7">
        <textarea 
          name="" id="" className="w-[95%] md:w-160 h-32 md:h-40 bg-background text-foreground border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 md:p-4 placeholder:text-[#828282] placeholder:text-sm resize-none text-sm md:text-base focus:outline-none focus:ring-0 mb-[-9px]"
          placeholder="Share your thoughts..." 
          defaultValue=""
        />
        <div className="flex justify-end w-[95%] md:w-160">
          <button type="submit" className="items-center gap-2 rounded-lg bg-[#A2EE2F] px-5 md:px-3 py-1 md:py-2 font-medium text-black opacity-60 text-sm md:text-base">
           Start a discussion
          </button>
        </div>
    </div>
  );
}