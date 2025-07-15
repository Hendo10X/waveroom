"use client"
import { useState } from "react";
import dataJson from "./data.json";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  IconMessageCircle,
  IconChartBar,
  IconPlaylist,
  IconBookmark,
} from "@tabler/icons-react";
import { DiscussionSection } from "@/components/prototype/DiscussionSection";
import { ChartsSection } from "@/components/prototype/ChartsSection";
import { PlaylistSection } from "@/components/prototype/PlaylistSection";
import { SavedSection } from "@/components/prototype/SavedSection";

type SectionKey = "discussion" | "charts" | "playlists" | "saved";
const data: Record<SectionKey, { title: string; content: string }> = dataJson;

const sections: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "discussion", label: "Discussion", icon: <IconMessageCircle className="size-5" /> },
  { key: "charts", label: "Charts", icon: <IconChartBar className="size-5" /> },
  { key: "playlists", label: "Playlists", icon: <IconPlaylist className="size-5" /> },
  { key: "saved", label: "Saved", icon: <IconBookmark className="size-5" /> },
];

const sectionComponents = {
  discussion: DiscussionSection,
  charts: ChartsSection,
  playlists: PlaylistSection,
  saved: SavedSection,
};

export default function PrototypePage() {
  const [active, setActive] = useState<SectionKey>("discussion");
  const isMobile = useIsMobile();
  const ActiveComponent = sectionComponents[active];
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-inter tracking-tight text-sm">
      <div className="flex flex-1">
        <aside className={`w-64 bg-background text-foreground flex flex-col py-8 px-4 ${isMobile ? "hidden" : "block"}`}>
          <h2 className="text-sm font-bold mb-8 text-foreground ml-3">Waveroom</h2>
          <nav className="flex flex-col gap-2">
            {sections.map((section) => (
              <button
                key={section.key}
                className={`text-left px-4 py-2 rounded-xl font-medium transition-colors ${
                  active === section.key
                    ? "bg-neutral-200 text-foreground dark:bg-[#232323] dark:text-foreground"
                    : "hover:bg-neutral-200 hover:text-foreground dark:hover:bg-[#232323] dark:hover:text-foreground"
                }`}
                onClick={() => setActive(section.key)}
              >
                <span className="flex items-center">{section.icon}<span className="ml-2">{section.label}</span></span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-background text-foreground rounded-lg p-6">
            <ActiveComponent data={data[active]} />
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation Bar */}
      {isMobile && (
        <div className="bg-background text-foreground border-t border-neutral-200 dark:border-neutral-800">
          <nav className="flex justify-around py-4 px-4">
            {sections.map((section) => (
              <button
                key={section.key}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                  active === section.key
                    ? "bg-neutral-200 text-foreground dark:bg-[#232323] dark:text-foreground"
                    : "hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#2a2a2a] dark:hover:text-foreground"
                }`}
                onClick={() => setActive(section.key)}
              >
                <div className="mb-1">{section.icon}</div>
                <span className="text-xs font-medium truncate">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}