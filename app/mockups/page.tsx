"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AceternitySidebarMockup } from "@/components/mockups/aceternity-sidebar-mockup";
import { ToolbarExpandableMockup } from "@/components/mockups/toolbar-expandable-mockup";
import { FamilyDrawerMockup } from "@/components/mockups/family-drawer-mockup";

export default function MockupsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Armorie
            </Link>
            <h1 className="text-lg font-semibold text-foreground">
              Navigation Component Mockups
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Mockup Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Overview */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Three-Component Navigation System
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Complementary components for Armorie's Bible verse mapping experience.
            Each serves a distinct purpose while maintaining the Teal Haven design system.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-semibold text-foreground mb-2">Aceternity Sidebar</h3>
              <p className="text-sm text-muted-foreground">
                Main navigation - always accessible, space-efficient, hover-to-expand
              </p>
            </div>
            <div className="p-6 bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-semibold text-foreground mb-2">Toolbar Expandable</h3>
              <p className="text-sm text-muted-foreground">
                Inline workflows - quick verse analysis without leaving chat
              </p>
            </div>
            <div className="p-6 bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-lg">
              <div className="text-2xl mb-3">✨</div>
              <h3 className="font-semibold text-foreground mb-2">Family Drawer</h3>
              <p className="text-sm text-muted-foreground">
                Complex flows - multi-step study guide & collection creation
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Mockup 1: Aceternity Sidebar */}
        <section id="aceternity">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              1. Aceternity Sidebar
            </h2>
            <p className="text-muted-foreground">
              Replace your current ThreadListSidebar with this collapsible version.
              Hover to see it expand from 60px to 300px.
            </p>
          </div>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <AceternitySidebarMockup />
          </div>
        </section>

        {/* Mockup 2: Toolbar Expandable */}
        <section id="toolbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              2. Toolbar Expandable
            </h2>
            <p className="text-muted-foreground">
              Step-based verse analysis workflow. Click any step to expand the content
              panel. Perfect for bottom of Thread component.
            </p>
          </div>
          <ToolbarExpandableMockup />
        </section>

        {/* Mockup 3: Family Drawer */}
        <section id="family-drawer">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              3. Family Drawer
            </h2>
            <p className="text-muted-foreground">
              Multi-view drawer for complex generative workflows. Click the button
              to see the 5-step study guide creation flow.
            </p>
          </div>
          <FamilyDrawerMockup />
        </section>

        {/* Final Notes */}
        <section className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Integration Notes
          </h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Aceternity Sidebar</strong> - Use as main
              navigation. Reduces clutter while maintaining quick access to all features.
              Icons use Teal Haven semantic colors.
            </p>
            <p>
              <strong className="text-foreground">Toolbar Expandable</strong> - Trigger from
              chat when user asks to analyze verses. Appears at bottom of Thread, collapses
              when done. Great for 3-5 step workflows.
            </p>
            <p>
              <strong className="text-foreground">Family Drawer</strong> - Use for complex
              multi-step generative tasks like creating study guides or verse collections.
              Triggered from chat responses or toolbar. Mobile-optimized with smooth animations.
            </p>
            <p className="pt-4 border-t border-border text-xs">
              All components styled with Teal Haven colors (Primary Teal 192°, Secondary Rose
              359°, Accent Slate Blue 245°). Ready for production integration.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
