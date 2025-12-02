"use client";

import { useState, useCallback, type FC } from "react";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpIcon, Square, BookOpen, Search, Hash, Sparkles, Heart, Shield, Lightbulb, Compass, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Switch } from "@/components/animate-ui/components/radix/switch";

const BIBLE_TRANSLATIONS = [
  { id: "NIV", name: "New International Version" },
  { id: "ESV", name: "English Standard Version" },
  { id: "KJV", name: "King James Version" },
  { id: "NKJV", name: "New King James Version" },
  { id: "NLT", name: "New Living Translation" },
  { id: "NASB", name: "New American Standard" },
  { id: "MSG", name: "The Message" },
  { id: "AMP", name: "Amplified Bible" },
  { id: "CSB", name: "Christian Standard Bible" },
  { id: "NET", name: "New English Translation" },
  { id: "RSV", name: "Revised Standard Version" },
  { id: "CEV", name: "Contemporary English" },
] as const;

// Organized by category for better autocomplete relevance
const VERSE_SUGGESTIONS = [
  // Psalms - Most Popular
  "Psalm 23 - The Lord is my shepherd",
  "Psalm 91 - He who dwells in the shelter",
  "Psalm 46:10 - Be still and know",
  "Psalm 119:105 - Your word is a lamp",
  "Psalm 27:1 - The Lord is my light",
  "Psalm 139 - You knit me together",
  "Psalm 34:18 - The Lord is close to the brokenhearted",
  "Psalm 103 - Bless the Lord, O my soul",
  "Psalm 121 - I lift my eyes to the hills",
  "Psalm 37:4 - Delight yourself in the Lord",
  // Gospel of John
  "John 3:16 - For God so loved the world",
  "John 14:6 - I am the way, truth, and life",
  "John 14:27 - Peace I leave with you",
  "John 15:5 - I am the vine, you are the branches",
  "John 16:33 - In this world you will have trouble",
  "John 10:10 - I came that they may have life",
  "John 8:32 - The truth will set you free",
  "John 11:25 - I am the resurrection and the life",
  // Romans
  "Romans 8:28 - All things work together for good",
  "Romans 8:38-39 - Nothing can separate us",
  "Romans 12:2 - Be transformed by the renewing",
  "Romans 5:8 - God demonstrates His love",
  "Romans 8:1 - No condemnation for those in Christ",
  "Romans 15:13 - May the God of hope fill you",
  // Philippians
  "Philippians 4:13 - I can do all things through Christ",
  "Philippians 4:6-7 - Do not be anxious",
  "Philippians 4:8 - Whatever is true, noble, right",
  "Philippians 1:6 - He who began a good work",
  // Proverbs
  "Proverbs 3:5-6 - Trust in the Lord with all your heart",
  "Proverbs 31 - A woman of noble character",
  "Proverbs 16:3 - Commit your works to the Lord",
  "Proverbs 22:6 - Train up a child",
  "Proverbs 4:23 - Guard your heart",
  // Isaiah
  "Isaiah 41:10 - Fear not, for I am with you",
  "Isaiah 40:31 - They who wait upon the Lord",
  "Isaiah 53 - He was pierced for our transgressions",
  "Isaiah 26:3 - Perfect peace",
  "Isaiah 43:2 - When you pass through the waters",
  // Jeremiah
  "Jeremiah 29:11 - Plans to prosper you",
  "Jeremiah 33:3 - Call to me and I will answer",
  "Jeremiah 17:7-8 - Blessed is the one who trusts",
  // Matthew
  "Matthew 11:28-30 - Come to me, all who are weary",
  "Matthew 6:33 - Seek first the kingdom",
  "Matthew 5:3-12 - The Beatitudes",
  "Matthew 28:18-20 - The Great Commission",
  "Matthew 7:7 - Ask and it will be given",
  // Other Popular
  "1 Corinthians 13 - Love is patient, love is kind",
  "2 Corinthians 5:17 - New creation in Christ",
  "Galatians 5:22-23 - Fruit of the Spirit",
  "Ephesians 2:8-9 - By grace you have been saved",
  "Ephesians 6:10-18 - Armor of God",
  "Colossians 3:23 - Work as for the Lord",
  "1 Peter 5:7 - Cast all your anxieties on Him",
  "2 Timothy 1:7 - Spirit of power, love, self-control",
  "Hebrews 11:1 - Faith is the substance",
  "Hebrews 12:1-2 - Run with perseverance",
  "James 1:2-4 - Count it all joy",
  "1 John 4:18 - Perfect love casts out fear",
  "Revelation 21:4 - He will wipe away every tear",
  "Genesis 1:1 - In the beginning",
  "Ecclesiastes 3:1 - A time for everything",
  "Lamentations 3:22-23 - His mercies are new",
  "Micah 6:8 - Do justice, love mercy, walk humbly",
  "Habakkuk 3:17-19 - Yet I will rejoice",
  "Zephaniah 3:17 - He will quiet you with His love",
] as const;

const TOPIC_SUGGESTIONS = [
  // Emotions & Feelings
  { topic: "comfort", description: "Verses for difficult times" },
  { topic: "peace", description: "Finding calm and rest" },
  { topic: "strength", description: "When you feel weak" },
  { topic: "hope", description: "Encouragement for tomorrow" },
  { topic: "joy", description: "Verses about gladness" },
  { topic: "love", description: "God's unconditional love" },
  { topic: "anxiety", description: "Help for worried hearts" },
  { topic: "fear", description: "Overcoming with faith" },
  { topic: "grief", description: "Comfort in loss" },
  { topic: "loneliness", description: "You are never alone" },
  { topic: "doubt", description: "Strengthening faith" },
  { topic: "anger", description: "Finding peace" },
  { topic: "depression", description: "Light in darkness" },
  { topic: "stress", description: "Rest for the weary" },
  { topic: "gratitude", description: "Thankful hearts" },
  { topic: "contentment", description: "Finding satisfaction" },
  // Life Situations
  { topic: "marriage", description: "Building strong bonds" },
  { topic: "parenting", description: "Raising children" },
  { topic: "work", description: "Faith in the workplace" },
  { topic: "finances", description: "Stewardship & provision" },
  { topic: "health", description: "Healing & wholeness" },
  { topic: "relationships", description: "Loving others well" },
  { topic: "decisions", description: "Seeking God's will" },
  { topic: "new beginnings", description: "Fresh starts" },
  { topic: "suffering", description: "Purpose in pain" },
  { topic: "temptation", description: "Standing firm" },
  { topic: "forgiveness", description: "Letting go" },
  { topic: "patience", description: "Waiting on God" },
  { topic: "purpose", description: "Why am I here?" },
  { topic: "identity", description: "Who I am in Christ" },
  // Spiritual Growth
  { topic: "faith", description: "Trusting God" },
  { topic: "prayer", description: "Talking with God" },
  { topic: "worship", description: "Praising His name" },
  { topic: "salvation", description: "The gospel message" },
  { topic: "grace", description: "Undeserved favor" },
  { topic: "wisdom", description: "Godly understanding" },
  { topic: "courage", description: "Be strong and brave" },
  { topic: "trust", description: "Relying on God" },
  { topic: "obedience", description: "Following God's ways" },
  { topic: "humility", description: "A humble heart" },
  { topic: "service", description: "Serving others" },
  { topic: "holiness", description: "Set apart for God" },
  { topic: "heaven", description: "Our eternal home" },
  { topic: "Holy Spirit", description: "The Comforter" },
  { topic: "God's promises", description: "What He has said" },
  { topic: "God's faithfulness", description: "He never fails" },
] as const;

// Combine for autocomplete filtering
const FAITH_SUGGESTIONS = [
  ...VERSE_SUGGESTIONS,
  ...TOPIC_SUGGESTIONS.map(t => t.topic),
] as const;

export type HeroComposerProps = {
  placeholder?: string;
  onTranslationChange?: (translation: string) => void;
  onGuidedChange?: (guided: boolean) => void;
  defaultTranslation?: string;
  defaultGuided?: boolean;
};

export const HeroComposer: FC<HeroComposerProps> = ({
  placeholder = "Search for a verse, topic, or feeling...",
  onTranslationChange,
  onGuidedChange,
  defaultTranslation = "NIV",
  defaultGuided = false,
}) => {
  const [translation, setTranslation] = useState(defaultTranslation);
  const [guided, setGuided] = useState(defaultGuided);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTranslationChange = useCallback(
    (value: string) => {
      setTranslation(value);
      onTranslationChange?.(value);
    },
    [onTranslationChange]
  );

  const handleGuidedChange = useCallback(
    (checked: boolean) => {
      setGuided(checked);
      onGuidedChange?.(checked);
    },
    [onGuidedChange]
  );

  // Enhanced filtering with categorization
  const getFilteredSuggestions = () => {
    if (inputValue.length < 1) return { verses: [], topics: [] };

    const query = inputValue.toLowerCase();

    const verses = VERSE_SUGGESTIONS
      .filter(v => v.toLowerCase().includes(query))
      .slice(0, 4);

    const topics = TOPIC_SUGGESTIONS
      .filter(t => t.topic.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))
      .slice(0, 3);

    return { verses, topics };
  };

  const { verses: filteredVerses, topics: filteredTopics } = getFilteredSuggestions();
  const hasResults = filteredVerses.length > 0 || filteredTopics.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <ComposerPrimitive.Root className="relative flex w-full flex-col">
        {/* Main Composer with integrated footer */}
        <div className="relative">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <ComposerPrimitive.AttachmentDropzone className="flex flex-col w-full rounded-2xl border-2 border-primary-300 ring-[3px] ring-primary-200/40 bg-card/90 backdrop-blur-sm shadow-lg shadow-primary-200/30 outline-none transition-all duration-300 has-[textarea:focus-visible]:border-secondary-400 has-[textarea:focus-visible]:ring-[4px] has-[textarea:focus-visible]:ring-secondary-300/40 has-[textarea:focus-visible]:shadow-xl has-[textarea:focus-visible]:shadow-secondary-200/30 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50 overflow-hidden">
              {/* Input row */}
              <div className="flex items-center px-4">
                <Search className="size-5 text-muted-foreground/50 mr-2 flex-shrink-0" />
                <ComposerPrimitive.Input
                  placeholder={placeholder}
                  className="flex-1 min-h-12 max-h-24 w-full resize-none bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                  rows={1}
                  autoFocus
                  aria-label="Message input"
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length >= 1);
                  }}
                  onFocus={() => setShowSuggestions(inputValue.length >= 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />

                <div className="flex items-center gap-2 pl-2">
                  <ThreadPrimitive.If running={false}>
                    <ComposerPrimitive.Send asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <TooltipIconButton
                          tooltip="Search"
                          side="bottom"
                          type="submit"
                          variant="default"
                          size="icon"
                          className="size-9 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white shadow-md"
                          aria-label="Search"
                        >
                          <ArrowUpIcon className="size-4" />
                        </TooltipIconButton>
                      </motion.div>
                    </ComposerPrimitive.Send>
                  </ThreadPrimitive.If>

                  <ThreadPrimitive.If running>
                    <ComposerPrimitive.Cancel asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="size-9 rounded-full bg-secondary-500 hover:bg-secondary-600"
                          aria-label="Stop"
                        >
                          <Square className="size-3 fill-white" />
                        </Button>
                      </motion.div>
                    </ComposerPrimitive.Cancel>
                  </ThreadPrimitive.If>
                </div>
              </div>

              {/* Footer row - Translation selector + Guided toggle (both on left) */}
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-50/50">
                {/* Animated Translation Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1.5 text-primary-700 bg-primary-100/70 border border-primary-200/80 rounded-lg px-2.5 py-1.5 hover:bg-primary-100 hover:border-primary-300 transition-all outline-none focus:ring-2 focus:ring-secondary-300"
                    >
                      <BookOpen className="size-3.5" />
                      <span className="text-xs font-medium">{translation}</span>
                      <motion.svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className="text-current"
                      >
                        <motion.path
                          d="M3 4.5L6 7.5L9 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="top"
                    sideOffset={8}
                    className="w-64 max-h-72 overflow-y-auto rounded-xl border-border/60 bg-card/95 backdrop-blur-xl shadow-xl"
                  >
                    <DropdownMenuRadioGroup
                      value={translation}
                      onValueChange={handleTranslationChange}
                    >
                      {BIBLE_TRANSLATIONS.map((t) => (
                        <DropdownMenuRadioItem
                          key={t.id}
                          value={t.id}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg"
                        >
                          <span className="font-medium text-sm">{t.id}</span>
                          <span className="text-muted-foreground text-xs truncate">
                            {t.name}
                          </span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Animated Guided Toggle */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer border bg-primary-100/70 text-primary-700 border-primary-200/80 hover:bg-primary-100 hover:border-primary-300 transition-all duration-200"
                >
                  <Compass className="size-3.5" />
                  <span className="text-xs font-medium select-none">Guided</span>
                  <Switch
                    checked={guided}
                    onCheckedChange={handleGuidedChange}
                    pressedWidth={14}
                    className="h-4 w-7 data-[state=checked]:bg-secondary-500 data-[state=unchecked]:bg-primary-300 border-0 [&_[data-slot=switch-thumb]]:size-3"
                  />
                </motion.label>
              </div>
            </ComposerPrimitive.AttachmentDropzone>
          </motion.div>

          {/* Enhanced Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && hasResults && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-primary-200/10 overflow-hidden z-40"
              >
                <div className="p-2 max-h-80 overflow-y-auto">
                  {/* Verses Section */}
                  {filteredVerses.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
                        <BookOpen className="size-3" />
                        Scripture
                      </div>
                      {filteredVerses.map((verse, index) => {
                        const [reference, preview] = verse.includes(" - ")
                          ? verse.split(" - ")
                          : [verse, ""];
                        return (
                          <ThreadPrimitive.Suggestion
                            key={verse}
                            prompt={reference}
                            send
                            asChild
                          >
                            <motion.button
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              whileHover={{ scale: 1.01 }}
                              className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-primary-100/60 transition-all duration-150 flex items-start gap-3 group"
                            >
                              <span className="mt-0.5 text-secondary-500 group-hover:text-secondary-600 transition-colors">
                                <BookOpen className="size-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-foreground">{reference}</span>
                                {preview && (
                                  <span className="block text-xs text-muted-foreground/70 truncate mt-0.5">
                                    {preview}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          </ThreadPrimitive.Suggestion>
                        );
                      })}
                    </div>
                  )}

                  {/* Topics Section */}
                  {filteredTopics.length > 0 && (
                    <div>
                      {filteredVerses.length > 0 && (
                        <div className="mx-3 my-2 border-t border-border/50" />
                      )}
                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
                        <Hash className="size-3" />
                        Topics
                      </div>
                      {filteredTopics.map((item, index) => (
                        <ThreadPrimitive.Suggestion
                          key={item.topic}
                          prompt={item.topic}
                          send
                          asChild
                        >
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (filteredVerses.length + index) * 0.02 }}
                            whileHover={{ scale: 1.01 }}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-secondary-100/50 transition-all duration-150 flex items-start gap-3 group"
                          >
                            <span className="mt-0.5 text-accent-500 group-hover:text-accent-600 transition-colors">
                              <Sparkles className="size-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground capitalize">{item.topic}</span>
                              <span className="block text-xs text-muted-foreground/70 truncate mt-0.5">
                                {item.description}
                              </span>
                            </div>
                          </motion.button>
                        </ThreadPrimitive.Suggestion>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          {/* Primary Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { topic: "comfort", icon: Heart, color: "primary" },
              { topic: "peace", icon: Sparkles, color: "primary" },
              { topic: "strength", icon: Shield, color: "primary" },
              { topic: "wisdom", icon: Lightbulb, color: "primary" },
            ].map(({ topic, icon: Icon, color }, index) => (
              <ThreadPrimitive.Suggestion key={topic} prompt={topic} send asChild>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${
                    color === "primary"
                      ? "text-primary-700 bg-primary-100/80 hover:bg-primary-100"
                      : color === "accent"
                      ? "text-primary-700 bg-primary-100/80 hover:bg-primary-100"
                      : "text-primary-700 bg-primary-100/80 hover:bg-primary-100"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span className="capitalize">{topic}</span>
                </motion.button>
              </ThreadPrimitive.Suggestion>
            ))}
          </div>

          {/* Secondary Quick Actions - Popular Verses */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Psalm 23",
              "John 3:16",
              "Jeremiah 29:11",
              "Philippians 4:13",
              "Romans 8:28",
            ].map((verse, index) => (
              <ThreadPrimitive.Suggestion key={verse} prompt={verse} send asChild>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.03 }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3.5 py-1.5 text-xs font-medium text-accent-700 bg-accent-100/80 hover:bg-accent-100 rounded-full transition-all duration-200 border border-accent-200/60 shadow-sm hover:shadow"
                >
                  {verse}
                </motion.button>
              </ThreadPrimitive.Suggestion>
            ))}
          </div>
        </motion.div>
      </ComposerPrimitive.Root>
    </motion.div>
  );
};
