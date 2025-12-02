"use client";

import { ArrowLeft, ArrowRight, Book, CheckCircle, FileText, Sparkles } from "lucide-react";
import {
  FamilyDrawerAnimatedContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerButton,
  FamilyDrawerClose,
  FamilyDrawerContent,
  FamilyDrawerHeader,
  FamilyDrawerOverlay,
  FamilyDrawerPortal,
  FamilyDrawerRoot,
  FamilyDrawerSecondaryButton,
  FamilyDrawerTrigger,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
} from "@/components/ui/family-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Family Drawer Mockup for Armorie
 * Bottom drawer with multi-view navigation for complex generative workflows
 */

function StudyGuideDefaultView() {
  const { setView } = useFamilyDrawer();

  return (
    <>
      <header className="mb-4 flex h-[72px] items-center border-b border-border pl-2">
        <h2 className="text-[19px] font-semibold text-foreground md:font-medium">
          Create Study Guide
        </h2>
      </header>
      <div className="space-y-3">
        <FamilyDrawerButton onClick={() => setView("topic")}>
          <Book className="size-5 text-primary-600" />
          Choose Topic
        </FamilyDrawerButton>
        <FamilyDrawerButton onClick={() => setView("template")}>
          <FileText className="size-5 text-accent-600" />
          Select Template
        </FamilyDrawerButton>
      </div>
    </>
  );
}

function StudyGuideTopicSelectView() {
  const { setView } = useFamilyDrawer();

  return (
    <div>
      <div className="px-2">
        <FamilyDrawerHeader
          icon={<Book className="size-12 text-primary-600" />}
          title="Choose Topic"
          description="Select a biblical theme or topic for your study guide"
        />
        <div className="mt-6 space-y-3 border-t border-border pt-6">
          {[
            { name: "The Shepherd", verses: "12 verses", color: "primary" },
            { name: "Faith & Trust", verses: "18 verses", color: "secondary" },
            { name: "God's Promises", verses: "24 verses", color: "accent" },
          ].map((topic) => (
            <button
              key={topic.name}
              type="button"
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                topic.color === "primary"
                  ? "border-primary-200 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/20 dark:border-primary-800"
                  : topic.color === "secondary"
                    ? "border-secondary-200 bg-secondary-50 hover:bg-secondary-100 dark:bg-secondary-950/20 dark:border-secondary-800"
                    : "border-accent-200 bg-accent-50 hover:bg-accent-100 dark:bg-accent-950/20 dark:border-accent-800"
              }`}
              onClick={() => setView("customize")}
            >
              <div className="font-medium text-foreground">{topic.name}</div>
              <div className="text-sm text-muted-foreground">{topic.verses}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-7 flex gap-4">
        <FamilyDrawerSecondaryButton
          onClick={() => setView("default")}
          className="bg-muted text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </FamilyDrawerSecondaryButton>
      </div>
    </div>
  );
}

function StudyGuideCustomizeView() {
  const { setView } = useFamilyDrawer();

  return (
    <div>
      <div className="px-2">
        <FamilyDrawerHeader
          icon={<Sparkles className="size-12 text-secondary-600" />}
          title="Customize Guide"
          description="Add personal notes and focus areas"
        />
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <div className="space-y-2">
            <Label htmlFor="guide-title" className="text-foreground">
              Study Guide Title
            </Label>
            <Input
              id="guide-title"
              placeholder="The Good Shepherd"
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="focus-areas" className="text-foreground">
              Focus Areas
            </Label>
            <Textarea
              id="focus-areas"
              placeholder="What aspects do you want to explore?"
              rows={3}
              className="bg-background border-border"
            />
          </div>
        </div>
      </div>
      <div className="mt-7 flex gap-4">
        <FamilyDrawerSecondaryButton
          onClick={() => setView("topic")}
          className="bg-muted text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </FamilyDrawerSecondaryButton>
        <FamilyDrawerSecondaryButton
          onClick={() => setView("generating")}
          className="bg-primary-600 text-white"
        >
          Generate <ArrowRight className="size-4" />
        </FamilyDrawerSecondaryButton>
      </div>
    </div>
  );
}

function StudyGuideGeneratingView() {
  return (
    <div>
      <div className="px-2">
        <FamilyDrawerHeader
          icon={<Sparkles className="size-12 text-primary-600 animate-pulse" />}
          title="Generating..."
          description="Creating your personalized study guide"
        />
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <span>Analyzing verse connections...</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-secondary-500 border-t-transparent" />
            <span>Finding cross-references...</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
            <span>Generating insights...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyGuideTemplateView() {
  const { setView } = useFamilyDrawer();

  return (
    <div>
      <div className="px-2">
        <FamilyDrawerHeader
          icon={<FileText className="size-12 text-accent-600" />}
          title="Select Template"
          description="Choose a structure for your study guide"
        />
        <div className="mt-6 space-y-3 border-t border-border pt-6">
          {[
            { name: "Topical Study", desc: "Explore a theme across scripture" },
            { name: "Chapter Analysis", desc: "Deep dive into one passage" },
            { name: "Word Study", desc: "Examine original language & context" },
          ].map((template) => (
            <button
              key={template.name}
              type="button"
              className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
              onClick={() => setView("complete")}
            >
              <div className="font-medium text-foreground">{template.name}</div>
              <div className="text-sm text-muted-foreground">{template.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-7 flex gap-4">
        <FamilyDrawerSecondaryButton
          onClick={() => setView("topic")}
          className="bg-muted text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </FamilyDrawerSecondaryButton>
      </div>
    </div>
  );
}

function StudyGuideFinalView() {
  const { setView } = useFamilyDrawer();

  return (
    <div>
      <div className="px-2">
        <FamilyDrawerHeader
          icon={<CheckCircle className="size-12 text-primary-600" />}
          title="Study Guide Ready!"
          description="Your personalized study guide has been created"
        />
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
              "The Good Shepherd" Study Guide
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-3 text-primary-600" />
                <span>12 verses included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-3 text-primary-600" />
                <span>8 cross-references mapped</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-3 text-primary-600" />
                <span>3 key themes identified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex gap-4">
        <FamilyDrawerSecondaryButton
          onClick={() => setView("default")}
          className="bg-muted text-muted-foreground"
        >
          Create Another
        </FamilyDrawerSecondaryButton>
        <FamilyDrawerSecondaryButton
          onClick={() => {}}
          className="bg-primary-600 text-white"
        >
          <Book className="size-4" /> View Guide
        </FamilyDrawerSecondaryButton>
      </div>
    </div>
  );
}

const studyGuideViews: ViewsRegistry = {
  default: StudyGuideDefaultView,
  topic: StudyGuideTopicSelectView,
  template: StudyGuideTemplateView,
  customize: StudyGuideCustomizeView,
  generating: StudyGuideGeneratingView,
  complete: StudyGuideFinalView,
};

export function FamilyDrawerMockup() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            Family Drawer Mockup
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Bottom drawer for multi-step generative workflows. Click the button to explore
            the 5-step study guide creation flow with Teal Haven colors.
          </p>
        </div>

        <div className="flex justify-center">
          <FamilyDrawerRoot views={studyGuideViews}>
            <FamilyDrawerTrigger className="!relative !top-auto !left-auto !-translate-y-0 !-translate-x-0 bg-primary-600 text-white hover:bg-primary-700 border-primary-700">
              <Sparkles className="size-4 mr-2" />
              Create Study Guide
            </FamilyDrawerTrigger>
            <FamilyDrawerPortal>
              <FamilyDrawerOverlay />
              <FamilyDrawerContent>
                <FamilyDrawerClose />
                <FamilyDrawerAnimatedWrapper>
                  <FamilyDrawerAnimatedContent>
                    <FamilyDrawerViewContent />
                  </FamilyDrawerAnimatedContent>
                </FamilyDrawerAnimatedWrapper>
              </FamilyDrawerContent>
            </FamilyDrawerPortal>
          </FamilyDrawerRoot>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Use Case</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Triggered from chat for complex workflows:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-secondary-600">•</span>
                <span>"Create a study guide on Psalm 23"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-600">•</span>
                <span>"Build a verse collection on hope"</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Smooth view transitions</li>
              <li>• Auto height animations</li>
              <li>• Mobile-optimized</li>
              <li>• Teal Haven styled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
