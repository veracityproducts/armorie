"use client";

import { useState } from "react";
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

interface VerseMapInterruptProps {
  verse: string;
  reference: string;
  studies: KeywordStudy[];
  onGoDeeper: (editedStudies?: KeywordStudy[]) => void;
}

function ThemedCard({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}) {
  const variantStyles = {
    primary: {
      outer: "bg-primary-200 ring-primary-300",
      middle: "bg-primary-100",
      inner: "bg-white ring-primary-200",
    },
    secondary: {
      outer: "bg-secondary-200 ring-secondary-300",
      middle: "bg-secondary-100",
      inner: "bg-white ring-secondary-200",
    },
    accent: {
      outer: "bg-accent-200 ring-accent-300",
      middle: "bg-accent-100",
      inner: "bg-white ring-accent-200",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "grid grid-cols-1 rounded-2xl",
        "shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.05)]",
        "ring-1",
        styles.outer,
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 rounded-2xl p-1.5 shadow-md",
          styles.middle
        )}
      >
        <div
          className={cn(
            "rounded-xl p-4 shadow-lg ring-1",
            styles.inner,
            "h-full"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function StudyCard({
  study,
  onEdit,
}: {
  study: KeywordStudy;
  onEdit: (updated: KeywordStudy) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudy, setEditedStudy] = useState(study);

  const handleSave = () => {
    onEdit(editedStudy);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStudy(study);
    setIsEditing(false);
  };

  return (
    <ThemedCard variant="secondary" className="h-full">
      <div className="flex flex-col min-h-[100px]">
        {/* Header with keyword and expand/edit controls */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-secondary-700">
              {study.keyword}
            </h3>
            <p className="text-sm text-secondary-500 italic">
              {study.greekHebrew}
            </p>
          </div>
          <div className="flex gap-1">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full hover:bg-secondary-100 transition-colors"
                title="Edit"
              >
                <Edit2 className="size-4 text-secondary-500" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-full hover:bg-secondary-100 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="size-4 text-secondary-500" />
              ) : (
                <ChevronDown className="size-4 text-secondary-500" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsed preview */}
        {!isExpanded && (
          <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
            {study.meaning}
          </p>
        )}

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mt-3 pt-3 border-t border-secondary-200">
                {/* Meaning */}
                <div>
                  <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                    Meaning
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedStudy.meaning}
                      onChange={(e) =>
                        setEditedStudy({ ...editedStudy, meaning: e.target.value })
                      }
                      className="w-full mt-1 p-2 text-sm border border-secondary-200 rounded-md resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground leading-relaxed mt-1">
                      {study.meaning}
                    </p>
                  )}
                </div>

                {/* References */}
                <div>
                  <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                    See Also
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {study.references.map((ref) => (
                      <span
                        key={ref}
                        className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-md text-sm"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Significance */}
                <div>
                  <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                    Significance
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedStudy.significance}
                      onChange={(e) =>
                        setEditedStudy({
                          ...editedStudy,
                          significance: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 text-sm border border-secondary-200 rounded-md resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground leading-relaxed mt-1">
                      {study.significance}
                    </p>
                  )}
                </div>

                {/* Edit actions */}
                {isEditing && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="size-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-secondary-500 hover:bg-secondary-600"
                    >
                      <Check className="size-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap hint */}
        <p className="text-[10px] text-secondary-400 mt-auto pt-2">
          {isExpanded ? "tap to collapse" : "tap to expand"}
        </p>
      </div>
    </ThemedCard>
  );
}

export function VerseMapInterrupt({
  verse,
  reference,
  studies,
  onGoDeeper,
}: VerseMapInterruptProps) {
  const [editedStudies, setEditedStudies] = useState<KeywordStudy[]>(studies);

  const handleStudyEdit = (index: number, updated: KeywordStudy) => {
    const newStudies = [...editedStudies];
    newStudies[index] = updated;
    setEditedStudies(newStudies);
  };

  const hasEdits = JSON.stringify(editedStudies) !== JSON.stringify(studies);

  return (
    <div className="w-full p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Verse header */}
          <ThemedCard variant="primary">
            <div className="flex items-center gap-4 text-left">
              <BookOpen className="size-8 text-primary-600 shrink-0" />
              <div>
                <blockquote className="text-base italic text-foreground leading-relaxed">
                  "{verse}"
                </blockquote>
                <p className="text-sm font-semibold text-primary-600 mt-2">
                  {reference}
                </p>
              </div>
            </div>
          </ThemedCard>

          {/* Study cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedStudies.map((study, index) => (
              <StudyCard
                key={study.keyword}
                study={study}
                onEdit={(updated) => handleStudyEdit(index, updated)}
              />
            ))}
          </div>

          {/* Action bar */}
          <ThemedCard variant="accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-accent-600" />
                <span className="text-sm text-accent-700">
                  {editedStudies.length} keywords studied
                  {hasEdits && (
                    <span className="ml-2 text-secondary-500">(edited)</span>
                  )}
                </span>
              </div>
              <Button
                onClick={() => onGoDeeper(hasEdits ? editedStudies : undefined)}
                className="bg-secondary-500 text-white hover:bg-secondary-600 px-6"
              >
                Go Deeper
              </Button>
            </div>
          </ThemedCard>
        </div>
      </div>
    </div>
  );
}
