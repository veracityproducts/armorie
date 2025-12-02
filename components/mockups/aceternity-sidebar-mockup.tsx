"use client";

import { Book, BookOpen, Map as MapIcon, MessageSquare, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import {
  AceternitySidebar,
  AceternitySidebarBody,
  AceternitySidebarLink,
} from "@/components/ui/aceternity-sidebar";

/**
 * Aceternity Sidebar Mockup for Armorie
 *
 * Hover-to-expand sidebar for main thread navigation
 * - Collapsed: 60px with icons only
 * - Expanded: 300px with labels
 * - Smooth motion animations
 *
 * Use Case: Replace current ThreadListSidebar with this collapsible version
 * to save space while maintaining easy access to conversations and features
 */

const links = [
  {
    label: "Current Chat",
    href: "#",
    icon: (
      <MessageSquare className="text-primary-700 dark:text-primary-300 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "Saved Verses",
    href: "#",
    icon: (
      <Star className="text-secondary-600 dark:text-secondary-400 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "Study Guides",
    href: "#",
    icon: (
      <Book className="text-accent-600 dark:text-accent-400 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "Verse Mapping",
    href: "#",
    icon: (
      <MapIcon className="text-primary-600 dark:text-primary-400 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "Search Scripture",
    href: "#",
    icon: (
      <Search className="text-accent-700 dark:text-accent-300 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "Reading Plans",
    href: "#",
    icon: (
      <BookOpen className="text-secondary-700 dark:text-secondary-300 h-5 w-5 shrink-0" />
    ),
  },
];

export function AceternitySidebarMockup() {
  return (
    <div className="h-screen w-full flex">
      <AceternitySidebar>
        <AceternitySidebarBody className="justify-between gap-10 bg-primary-100 dark:bg-primary-100">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-primary-500 rounded-lg shrink-0" />
                <motion.span
                  className="text-lg font-semibold text-primary-950 dark:text-primary-950"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Armorie
                </motion.span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 flex flex-col gap-2">
              {links.map((link) => (
                <AceternitySidebarLink key={link.label} link={link} />
              ))}
            </div>
          </div>

          {/* Footer - User Profile */}
          <div>
            <AceternitySidebarLink
              link={{
                label: "Profile",
                href: "#",
                icon: (
                  <div className="h-7 w-7 bg-secondary-200 dark:bg-secondary-300 rounded-full shrink-0" />
                ),
              }}
            />
          </div>
        </AceternitySidebarBody>
      </AceternitySidebar>

      {/* Demo Content Area */}
      <div className="flex-1 bg-background">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Aceternity Sidebar Mockup
          </h1>
          <p className="text-muted-foreground mb-8">
            Hover over the sidebar to expand it. This replaces your current ThreadListSidebar
            with a space-saving collapsible version.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Key Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Collapses to 60px (icons only)</li>
                <li>• Expands to 300px on hover</li>
                <li>• Smooth motion animations</li>
                <li>• Mobile: Full-screen drawer</li>
                <li>• Desktop: Auto expand/collapse</li>
              </ul>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Teal Haven Integration</h3>
              <p className="text-sm text-muted-foreground">
                Background uses primary-100, icons use semantic colors from your
                three-scale system (primary/secondary/accent).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
