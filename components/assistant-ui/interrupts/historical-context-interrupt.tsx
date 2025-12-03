"use client";

import { useState } from "react";
import { BookOpen, Clock, Users, MapPin, Edit2, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemedCard } from "@/components/ui/themed-card";

interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

interface HistoricalContext {
  period: string;
  author: string;
  audience: string;
  events: string[];
  culturalNotes: string;
}

interface HistoricalContextInterruptProps {
  verse: string;
  reference: string;
  studies: KeywordStudy[];
  historicalContext: HistoricalContext;
  onContinue: (editedContext?: HistoricalContext) => void;
}

function ContextSection({
  icon: Icon,
  title,
  children,
  isEditing,
  editComponent,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  editComponent?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 mt-1">
        <div className="size-8 rounded-full bg-accent-100 flex items-center justify-center">
          <Icon className="size-4 text-accent-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-accent-700 uppercase tracking-wide">
          {title}
        </h4>
        {isEditing ? editComponent : children}
      </div>
    </div>
  );
}

export function HistoricalContextInterrupt({
  verse,
  reference,
  studies,
  historicalContext,
  onContinue,
}: HistoricalContextInterruptProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContext, setEditedContext] =
    useState<HistoricalContext>(historicalContext);

  const hasEdits =
    JSON.stringify(editedContext) !== JSON.stringify(historicalContext);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContext(historicalContext);
    setIsEditing(false);
  };

  return (
    <div className="w-full p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Verse header (compact) */}
          <ThemedCard variant="primary">
            <div className="flex items-center gap-3">
              <BookOpen className="size-6 text-primary-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary-600">
                  {reference}
                </p>
                <p className="text-sm text-muted-foreground italic line-clamp-1">
                  "{verse}"
                </p>
              </div>
            </div>
          </ThemedCard>

          {/* Historical Context Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ThemedCard variant="accent">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-accent-200">
                  <h3 className="text-lg font-bold text-accent-700">
                    Historical Context
                  </h3>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-full hover:bg-accent-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="size-4 text-accent-500" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
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
                        className="bg-accent-500 hover:bg-accent-600"
                      >
                        <Check className="size-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                {/* Period */}
                <ContextSection
                  icon={Clock}
                  title="Time Period"
                  isEditing={isEditing}
                  editComponent={
                    <input
                      type="text"
                      value={editedContext.period}
                      onChange={(e) =>
                        setEditedContext({
                          ...editedContext,
                          period: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 text-sm border border-accent-200 rounded-md"
                    />
                  }
                >
                  <p className="text-foreground mt-1">
                    {historicalContext.period}
                  </p>
                </ContextSection>

                {/* Author */}
                <ContextSection
                  icon={Users}
                  title="Author & Audience"
                  isEditing={isEditing}
                  editComponent={
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={editedContext.author}
                        onChange={(e) =>
                          setEditedContext({
                            ...editedContext,
                            author: e.target.value,
                          })
                        }
                        placeholder="Author"
                        className="w-full p-2 text-sm border border-accent-200 rounded-md"
                      />
                      <input
                        type="text"
                        value={editedContext.audience}
                        onChange={(e) =>
                          setEditedContext({
                            ...editedContext,
                            audience: e.target.value,
                          })
                        }
                        placeholder="Audience"
                        className="w-full p-2 text-sm border border-accent-200 rounded-md"
                      />
                    </div>
                  }
                >
                  <div className="mt-1 space-y-1">
                    <p className="text-foreground">
                      <span className="font-medium">Written by:</span>{" "}
                      {historicalContext.author}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Written to:</span>{" "}
                      {historicalContext.audience}
                    </p>
                  </div>
                </ContextSection>

                {/* Historical Events */}
                <ContextSection
                  icon={MapPin}
                  title="Key Events"
                  isEditing={isEditing}
                  editComponent={
                    <textarea
                      value={editedContext.events.join("\n")}
                      onChange={(e) =>
                        setEditedContext({
                          ...editedContext,
                          events: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      placeholder="One event per line"
                      className="w-full mt-1 p-2 text-sm border border-accent-200 rounded-md resize-none"
                      rows={3}
                    />
                  }
                >
                  <ul className="mt-1 space-y-1">
                    {historicalContext.events.map((event, index) => (
                      <li
                        key={index}
                        className="text-foreground flex items-start gap-2"
                      >
                        <span className="text-accent-500 mt-1">•</span>
                        {event}
                      </li>
                    ))}
                  </ul>
                </ContextSection>

                {/* Cultural Notes */}
                <div className="pt-3 border-t border-accent-200">
                  <h4 className="text-sm font-semibold text-accent-700 uppercase tracking-wide mb-2">
                    Cultural Notes
                  </h4>
                  {isEditing ? (
                    <textarea
                      value={editedContext.culturalNotes}
                      onChange={(e) =>
                        setEditedContext({
                          ...editedContext,
                          culturalNotes: e.target.value,
                        })
                      }
                      className="w-full p-2 text-sm border border-accent-200 rounded-md resize-none"
                      rows={4}
                    />
                  ) : (
                    <p className="text-foreground leading-relaxed">
                      {historicalContext.culturalNotes}
                    </p>
                  )}
                </div>
              </div>
            </ThemedCard>
          </motion.div>

          {/* Keywords summary (collapsed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ThemedCard variant="secondary">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-secondary-700">
                  Keywords studied:
                </span>
                <div className="flex flex-wrap gap-2">
                  {studies.map((study) => (
                    <span
                      key={study.keyword}
                      className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-md text-sm"
                    >
                      {study.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </ThemedCard>
          </motion.div>

          {/* Action bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ThemedCard variant="primary">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-700">
                  Your study is complete! Continue to save or add reflections.
                  {hasEdits && (
                    <span className="ml-2 text-secondary-500">(edited)</span>
                  )}
                </p>
                <Button
                  onClick={() =>
                    onContinue(hasEdits ? editedContext : undefined)
                  }
                  className="bg-secondary-500 text-white hover:bg-secondary-600 px-6"
                >
                  Continue
                </Button>
              </div>
            </ThemedCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
