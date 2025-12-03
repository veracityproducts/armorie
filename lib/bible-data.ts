/**
 * Bible data constants for Armorie
 * - Translations, verse suggestions, and topic suggestions
 */

export type BibleTranslation = {
  id: string;
  name: string;
};

export type TopicSuggestion = {
  topic: string;
  description: string;
};

export const BIBLE_TRANSLATIONS: readonly BibleTranslation[] = [
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
export const VERSE_SUGGESTIONS: readonly string[] = [
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

export const TOPIC_SUGGESTIONS: readonly TopicSuggestion[] = [
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

// Popular quick action topics with icons
export const QUICK_TOPICS = ["comfort", "peace", "strength", "wisdom"] as const;

// Popular quick action verses
export const QUICK_VERSES = [
  "Psalm 23",
  "John 3:16",
  "Jeremiah 29:11",
  "Philippians 4:13",
  "Romans 8:28",
] as const;
