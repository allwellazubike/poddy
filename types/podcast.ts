/**
 * A podcast record from the backend.
 * Used for both user's own podcasts (GET /) and the community feed (GET /feed).
 */
export interface Podcast {
  id: string;
  original_filename: string;
  status: "uploaded" | "extracting" | "writing" | "synthesizing" | "done" | "failed";
  audio_url: string | null;
  created_at: string;
  is_public?: boolean;
  category?: string;
}

/** Status polling response from GET /:id/status */
export interface PodcastStatus {
  id: string;
  status: Podcast["status"];
  audioUrl: string | null;
}

/** Explore category definition. */
export interface Category {
  name: string;
  icon: string;
  color: string;
}
