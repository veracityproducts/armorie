"use client";

import { Book, BookOpen, MessageSquare, Search, Star, Map as MapIcon } from "lucide-react";
import {
  AceternitySidebar,
  AceternitySidebarBody,
  AceternitySidebarLink,
} from "@/components/ui/aceternity-sidebar";
import { LeafShieldIcon } from "@/components/ui/leaf-shield-icon";

/**
 * Armorie Sidebar - Collapsible navigation for Bible verse mapping
 * - Collapsed: 60px with icons only
 * - Expanded: 300px with labels on hover
 * - Icons are 50% larger (h-7.5 w-7.5) for better visibility
 */

const links = [
  {
    label: "Conversations",
    href: "#",
    icon: (
      <MessageSquare className="text-primary-700 dark:text-primary-300 h-7 w-7 shrink-0" />
    ),
  },
  {
    label: "Saved Verses",
    href: "#",
    icon: (
      <Star className="text-secondary-600 dark:text-secondary-400 h-7 w-7 shrink-0" />
    ),
  },
  {
    label: "Study Guides",
    href: "#",
    icon: (
      <Book className="text-accent-600 dark:text-accent-400 h-7 w-7 shrink-0" />
    ),
  },
  {
    label: "Verse Mapping",
    href: "#",
    icon: (
      <MapIcon className="text-primary-600 dark:text-primary-400 h-7 w-7 shrink-0" />
    ),
  },
  {
    label: "Search Scripture",
    href: "#",
    icon: (
      <Search className="text-accent-700 dark:text-accent-300 h-7 w-7 shrink-0" />
    ),
  },
  {
    label: "Reading Plans",
    href: "#",
    icon: (
      <BookOpen className="text-secondary-700 dark:text-secondary-300 h-7 w-7 shrink-0" />
    ),
  },
];

export function ArmorieSidebar() {
  return (
    <AceternitySidebar>
      <AceternitySidebarBody className="justify-between gap-10 bg-primary-200 dark:bg-primary-200 ml-2 my-2">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Navigation Links - All same size (h-7 w-7) */}
          <div className="flex flex-col gap-2">
            <AceternitySidebarLink
              link={{
                label: "Armorie",
                href: "#",
                icon: <LeafShieldIcon className="shrink-0" />,
              }}
            />
            {links.map((link) => (
              <AceternitySidebarLink key={link.label} link={link} />
            ))}
          </div>
        </div>

        {/* Footer - User Profile (same format) */}
        <div>
          <AceternitySidebarLink
            link={{
              label: "Profile",
              href: "#",
              icon: (
                <div className="h-7 w-7 bg-secondary-200 dark:bg-secondary-300 rounded-full shrink-0 flex items-center justify-center text-secondary-800 text-xs font-medium">
                  JC
                </div>
              ),
            }}
          />
        </div>
      </AceternitySidebarBody>
    </AceternitySidebar>
  );
}
