export type FAAEventType =
  | "kb_article_viewed"
  | "symptom_lookup"
  | "aed_location_search"
  | "workplace_vertical_viewed"
  | "course_viewed"
  | "angel_action_viewed";

export interface FAASignal {
  site: "firstaidangel";
  help_stage: "prepare";
  source_event_type: FAAEventType;
  theme: string | null;
  location_language: string;
  location_country: string | null;
  sensitivity_tier: 1 | 2 | 3;
  urgency: "unknown";
  suppression_active: boolean;
  session_id: string;
  created_at: string;
}
