"use client";

import { BookOpen, Link2, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToolbarExpandable from "@/components/ui/toolbar-expandable";

/**
 * Toolbar Expandable Mockup for Armorie
 *
 * Horizontal toolbar for step-based verse analysis workflows
 * - Appears at top or bottom of chat thread
 * - Expands downward to show step content
 * - Smooth height animations with scroll masking
 *
 * Use Case: Multi-step verse analysis - search → select → analyze → visualize
 * Perfect complement to aceternity sidebar for focused workflows
 */

const verseAnalysisSteps = [
  {
    id: "search",
    title: "Search Verses",
    description: "Find verses by keyword, topic, or reference",
    icon: Search,
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verse-search" className="text-foreground">
            Search Scripture
          </Label>
          <Input
            id="verse-search"
            placeholder="comfort, fear, love..."
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Quick Topics</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary-100 text-primary-800 border-primary-300 hover:bg-primary-200"
            >
              Peace
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary-100 text-secondary-800 border-secondary-300 hover:bg-secondary-200"
            >
              Hope
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-accent-100 text-accent-800 border-accent-300 hover:bg-accent-200"
            >
              Faith
            </Button>
          </div>
        </div>
        <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
          <Search className="w-4 h-4 mr-2" />
          Search Verses
        </Button>
      </div>
    ),
  },
  {
    id: "select",
    title: "Select Verses",
    description: "Choose verses to include in your analysis",
    icon: BookOpen,
    content: (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground mb-3">
          Select verses to analyze together
        </div>
        {[
          { ref: "Psalm 23:1", text: "The Lord is my shepherd..." },
          { ref: "John 10:11", text: "I am the good shepherd..." },
          { ref: "Isaiah 40:11", text: "He tends his flock like a shepherd..." },
        ].map((verse, i) => (
          <label
            key={i}
            className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20"
          >
            <input type="checkbox" className="mt-1" />
            <div>
              <div className="font-medium text-foreground">{verse.ref}</div>
              <div className="text-sm text-muted-foreground">{verse.text}</div>
            </div>
          </label>
        ))}
        <Button variant="outline" className="w-full bg-transparent">
          Continue with 3 verses
        </Button>
      </div>
    ),
  },
  {
    id: "connect",
    title: "Find Connections",
    description: "Discover thematic links between selected verses",
    icon: Link2,
    content: (
      <div className="space-y-4">
        <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-foreground">3 Themes Found</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-foreground">Shepherd imagery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full" />
              <span className="text-foreground">Divine protection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full" />
              <span className="text-foreground">Comfort & care</span>
            </div>
          </div>
        </div>
        <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Insights
        </Button>
      </div>
    ),
  },
  {
    id: "visualize",
    title: "Visualize Map",
    description: "Create visual representation of verse connections",
    icon: MapPin,
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Visualization Style</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="justify-start bg-background hover:bg-primary-50"
            >
              <div className="w-6 h-6 mr-2 bg-primary-200 rounded" />
              Network
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-background hover:bg-primary-50"
            >
              <div className="w-6 h-6 mr-2 bg-secondary-200 rounded" />
              Timeline
            </Button>
          </div>
        </div>
        <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg p-8 text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <p className="text-sm text-muted-foreground">
            Map preview will appear here
          </p>
        </div>
        <Button className="w-full bg-secondary-600 text-white hover:bg-secondary-700">
          <MapPin className="w-4 h-4 mr-2" />
          Create Verse Map
        </Button>
      </div>
    ),
  },
];

export function ToolbarExpandableMockup() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            Toolbar Expandable Mockup
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Horizontal step-based workflow for verse analysis. Click a step to expand
            the content panel. Perfect for guided verse mapping workflows.
          </p>
        </div>

        {/* Toolbar Component */}
        <div className="border border-border rounded-xl p-6 bg-card">
          <ToolbarExpandable
            steps={verseAnalysisSteps}
            badgeText="VERSE ANALYSIS"
          />
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Use Case</h3>
            <p className="text-sm text-muted-foreground">
              Place at bottom of Thread component for contextual verse analysis.
              Users can search, select, find connections, and visualize without
              leaving the chat.
            </p>
          </div>
          <div className="p-4 bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Integration</h3>
            <p className="text-sm text-muted-foreground">
              Complements aceternity sidebar - sidebar for navigation, toolbar for
              workflows. Appears when user triggers verse analysis from chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
