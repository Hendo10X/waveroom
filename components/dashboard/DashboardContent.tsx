"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Image from "next/image";

import { UserProfileDialog } from "@/components/dashboard/UserProfileDialog";

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
  {
    key: "discussion",
    label: "Discussion",
    icon: <IconMessageCircle className="size-5" />,
  },
  { key: "charts", label: "Charts", icon: <IconChartBar className="size-5" /> },
  {
    key: "playlists",
    label: "Playlists",
    icon: <IconPlaylist className="size-5" />,
  },
  { key: "saved", label: "Saved", icon: <IconBookmark className="size-5" /> },
];

const sectionComponents: Record<
  SectionKey,
  React.ComponentType<{ data: SectionData }>
> = {
  discussion: DiscussionSection,
  charts: ChartsSection,
  playlists: PlaylistSection,
  saved: SavedSection,
};

const STYLES = {
  sidebar: {
    base: "md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-background text-foreground flex flex-col py-8 px-4 md:ml-20 z-30",
    hidden: "hidden",
  },
  button: {
    base: "text-left px-4 py-2 rounded-xl font-medium transition-colors",
    active:
      "bg-neutral-200 text-foreground dark:bg-[#232323] dark:text-foreground",
    inactive:
      "hover:bg-neutral-200 hover:text-foreground dark:hover:bg-[#232323] dark:hover:text-foreground",
  },
  mobileButton: {
    base: "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
    active: "bg-[#a2ee2f] text-black dark:bg-[#232323] dark:text-foreground",
    inactive:
      "hover:bg-[#a2ee2f] hover:text-black dark:hover:bg-[#a2ee2f] dark:hover:text-black",
  },
} as const;

const SidebarButton = ({
  section,
  isActive,
  onClick,
}: {
  section: Section;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`${STYLES.button.base} ${
      isActive ? STYLES.button.active : STYLES.button.inactive
    }`}
    onClick={onClick}>
    <span className="flex items-center">
      {section.icon}
      <span className="ml-2">{section.label}</span>
    </span>
  </button>
);

const MobileButton = ({
  section,
  isActive,
  onClick,
}: {
  section: Section;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`${STYLES.mobileButton.base} ${
      isActive ? STYLES.mobileButton.active : STYLES.mobileButton.inactive
    }`}
    onClick={onClick}>
    <div className="mb-1">{section.icon}</div>
    <span className="text-xs font-medium truncate">{section.label}</span>
  </button>
);

const Sidebar = ({
  active,
  onSectionChange,
  isMobile,
  userName,
}: {
  active: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  isMobile: boolean;
  userName: string;
}) => (
  <aside
    className={`${STYLES.sidebar.base} ${
      isMobile ? STYLES.sidebar.hidden : ""
    }`}>
    <Image
      src="/Waveroom.svg"
      alt="Waveroom"
      width={80}
      height={80}
      className="mb-8 ml-4"
    />
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

    <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <UserProfileDialog
        trigger={
          <button
            type="button"
            className="mb-4 flex items-center gap-2 cursor-pointer hover:bg-muted rounded-lg px-2 py-2 transition-colors w-full text-left">
            <IconUser className="size-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">
              hey, {userName}
            </span>
          </button>
        }
      />
      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        <Logout />
      </div>
    </div>
  </aside>
);

const MobileNavigation = ({
  active,
  onSectionChange,
}: {
  active: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}) => (
  <div className="fixed bottom-0 left-0 w-full bg-background text-foreground border-t border-neutral-200 dark:border-neutral-800 z-40">
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
  sectionData,
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialSection = (): SectionKey => {
    if (typeof window !== "undefined") {
      const storedSection = localStorage.getItem(
        "waveroom-active-section"
      ) as SectionKey;
      if (storedSection && sections.some((s) => s.key === storedSection)) {
        return storedSection;
      }
    }

    const sectionParam = searchParams.get("section") as SectionKey;
    if (sectionParam && sections.some((s) => s.key === sectionParam)) {
      return sectionParam;
    }

    return "discussion";
  };

  const [active, setActive] = useState<SectionKey>(getInitialSection);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("waveroom-active-section", active);
    }
  }, [active]);

  const handleSectionChange = (section: SectionKey) => {
    setActive(section);
    const params = new URLSearchParams(searchParams);
    params.set("section", section);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-inter tracking-tight text-sm">
      <Sidebar
        active={active}
        onSectionChange={handleSectionChange}
        isMobile={isMobile}
        userName={userName}
      />
      <div className="flex-1 h-screen overflow-y-auto md:ml-64 md:pb-0">
        <MainContent activeSection={active} sectionData={data[active]} />
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
