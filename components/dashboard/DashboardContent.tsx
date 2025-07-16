"use client";

import { useState } from "react";
import dataJson from "@/app/dashboard/data.json";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  IconMessageCircle,
  IconChartBar,
  IconPlaylist,
  IconBookmark,
  IconUser,
} from "@tabler/icons-react";
import { DiscussionSection } from "@/components/sections/DiscussionSection";
import { ChartsSection } from "@/components/sections/ChartsSection";
import { PlaylistSection } from "@/components/sections/PlaylistSection";
import { SavedSection } from "@/components/sections/SavedSection";
import { Logout } from "@/components/logout";
import { ThemeToggle } from "@/components/theme-toggle";

type SectionKey = "discussion" | "charts" | "playlists" | "saved";

interface SectionData {
  title: string;
  content: string;
}

interface Section {
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
}

interface DashboardContentProps {
  userName: string;
}

const data: Record<SectionKey, SectionData> = dataJson;

const sections: Section[] = [
  { key: "discussion", label: "Discussion", icon: <IconMessageCircle className="size-5" /> },
  { key: "charts", label: "Charts", icon: <IconChartBar className="size-5" /> },
  { key: "playlists", label: "Playlists", icon: <IconPlaylist className="size-5" /> },
  { key: "saved", label: "Saved", icon: <IconBookmark className="size-5" /> },
];

const sectionComponents: Record<SectionKey, React.ComponentType<{ data: SectionData }>> = {
  discussion: DiscussionSection,
  charts: ChartsSection,
  playlists: PlaylistSection,
  saved: SavedSection,
};

const STYLES = {
  sidebar: {
    base: "w-64 bg-background text-foreground flex flex-col py-8 px-4 ml-20",
    hidden: "hidden",
  },
  button: {
    base: "text-left px-4 py-2 rounded-xl font-medium transition-colors",
    active: "bg-neutral-200 text-foreground dark:bg-[#232323] dark:text-foreground",
    inactive: "hover:bg-neutral-200 hover:text-foreground dark:hover:bg-[#232323] dark:hover:text-foreground",
  },
  mobileButton: {
    base: "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
    active: "bg-[#a2ee2f] text-black dark:bg-[#232323] dark:text-foreground",
    inactive: "hover:bg-[#a2ee2f] hover:text-black dark:hover:bg-[#a2ee2f] dark:hover:text-black",
  },
} as const;

const SidebarButton = ({ 
  section, 
  isActive, 
  onClick 
}: { 
  section: Section; 
  isActive: boolean; 
  onClick: () => void; 
}) => (
  <button
    className={`${STYLES.button.base} ${
      isActive ? STYLES.button.active : STYLES.button.inactive
    }`}
    onClick={onClick}
  >
    <span className="flex items-center">
      {section.icon}
      <span className="ml-2">{section.label}</span>
    </span>
  </button>
);

const MobileButton = ({ 
  section, 
  isActive, 
  onClick 
}: { 
  section: Section; 
  isActive: boolean; 
  onClick: () => void; 
}) => (
  <button
    className={`${STYLES.mobileButton.base} ${
      isActive ? STYLES.mobileButton.active : STYLES.mobileButton.inactive
    }`}
    onClick={onClick}
  >
    <div className="mb-1">{section.icon}</div>
    <span className="text-xs font-medium truncate">{section.label}</span>
  </button>
);

const Sidebar = ({ 
  active, 
  onSectionChange, 
  isMobile,
  userName
}: { 
  active: SectionKey; 
  onSectionChange: (section: SectionKey) => void; 
  isMobile: boolean;
  userName: string;
}) => (
  <aside className={`${STYLES.sidebar.base} ${isMobile ? STYLES.sidebar.hidden : ''}`}>
    <h2 className="text-sm font-bold mb-8 text-foreground ml-3">Waveroom</h2>
    <nav className="flex flex-col gap-2 flex-1">
      {sections.map((section) => (
        <SidebarButton
          key={section.key}
          section={section}
          isActive={active === section.key}
          onClick={() => onSectionChange(section.key)}
        />
      ))}
    </nav>
    
    {/* Bottom section with user info, theme toggle, and logout */}
    <div className="mt-auto pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-3 mb-4 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <IconUser className="size-5 text-foreground" />
        <span className="text-sm font-medium text-foreground">hey, {userName}</span>
      </div>
      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        <Logout />
      </div>
    </div>
  </aside>
);

const MobileNavigation = ({ 
  active, 
  onSectionChange 
}: { 
  active: SectionKey; 
  onSectionChange: (section: SectionKey) => void; 
}) => (
  <div className="bg-background text-foreground border-t border-neutral-200 dark:border-neutral-800">
    <nav className="flex justify-around py-4 px-4 gap-2">
      {sections.map((section) => (
        <MobileButton
          key={section.key}
          section={section}
          isActive={active === section.key}
          onClick={() => onSectionChange(section.key)}
        />
      ))}
    </nav>
  </div>
);

const MainContent = ({ 
  activeSection, 
  sectionData 
}: { 
  activeSection: SectionKey; 
  sectionData: SectionData; 
}) => {
  const ActiveComponent = sectionComponents[activeSection];
  
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="bg-background text-foreground rounded-lg p-6">
        <ActiveComponent data={sectionData} />
      </div>
    </main>
  );
};

export function DashboardContent({ userName }: DashboardContentProps) {
  const [active, setActive] = useState<SectionKey>("discussion");
  const isMobile = useIsMobile();

  const handleSectionChange = (section: SectionKey) => {
    setActive(section);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-inter tracking-tight text-sm">
      <div className="flex flex-1">
        <Sidebar 
          active={active} 
          onSectionChange={handleSectionChange} 
          isMobile={isMobile}
          userName={userName}
        />
        <MainContent 
          activeSection={active} 
          sectionData={data[active]} 
        />
      </div>
      
      {isMobile && (
        <MobileNavigation 
          active={active} 
          onSectionChange={handleSectionChange} 
        />
      )}
    </div>
  );
} 