import { Podcast, PublicPodcast, Category } from "@/types/podcast";

// ─── Your Podcasts (mock) ────────────────────────────────────────────

export const MOCK_MY_PODCASTS: Podcast[] = [
  {
    id: "1",
    original_filename: "Biology Chapter 5 - Cell Division.pdf",
    status: "done",
    audio_url: "audio/1.mp3",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "2",
    original_filename: "Data Structures and Algorithms.pdf",
    status: "done",
    audio_url: "audio/2.mp3",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "3",
    original_filename: "Cognitive Behavioral Theory.pdf",
    status: "done",
    audio_url: "audio/3.mp3",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
];

// ─── Discover Feed (mock) ────────────────────────────────────────────

export const MOCK_DISCOVER: PublicPodcast[] = [
  {
    id: "d1",
    title: "Neural Networks Explained Simply",
    creator: "Sarah K.",
    niche: "Computer Science",
    duration: "8 min",
    plays: 342,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "d2",
    title: "The Krebs Cycle - A Deep Dive",
    creator: "James O.",
    niche: "Biology",
    duration: "6 min",
    plays: 128,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "d3",
    title: "Constitutional Law Fundamentals",
    creator: "Ade M.",
    niche: "Law",
    duration: "11 min",
    plays: 89,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "d4",
    title: "Freudian Psychology vs Modern CBT",
    creator: "Lena R.",
    niche: "Psychology",
    duration: "9 min",
    plays: 215,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    id: "d5",
    title: "Introduction to Organic Synthesis",
    creator: "Tobi A.",
    niche: "Chemistry",
    duration: "7 min",
    plays: 67,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "d6",
    title: "Calculus II - Integration by Parts",
    creator: "Maria C.",
    niche: "Mathematics",
    duration: "5 min",
    plays: 431,
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
];

// ─── Explore Categories ──────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { name: "Computer Science", icon: "code-slash", color: "#0D9488" },
  { name: "Biology", icon: "leaf", color: "#059669" },
  { name: "Psychology", icon: "brain", color: "#E11D48" },
  { name: "Mathematics", icon: "calculator", color: "#DC2626" },
  { name: "Chemistry", icon: "flask", color: "#2563EB" },
  { name: "Law", icon: "book", color: "#D97706" },
  { name: "History", icon: "time", color: "#EA580C" },
  { name: "Literature", icon: "document-text", color: "#0891B2" },
  { name: "Physics", icon: "planet", color: "#CA8A04" },
];
