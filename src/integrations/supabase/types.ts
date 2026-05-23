export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string
          learner_name: string
          user_id: string
        }
        Insert: {
          certificate_number?: string
          course_id: string
          id?: string
          issued_at?: string
          learner_name: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string
          learner_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_published: boolean
          level: string
          pass_mark: number
          slug: string
          sort_order: number
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean
          level?: string
          pass_mark?: number
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean
          level?: string
          pass_mark?: number
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      educator_claims: {
        Row: {
          claimant_email: string
          claimant_name: string
          claimant_phone: string | null
          claimant_role: string | null
          claimed_user_id: string | null
          created_at: string
          educator_id: string
          evidence_file_paths: string[]
          evidence_url: string | null
          id: string
          message: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
        }
        Insert: {
          claimant_email: string
          claimant_name: string
          claimant_phone?: string | null
          claimant_role?: string | null
          claimed_user_id?: string | null
          created_at?: string
          educator_id: string
          evidence_file_paths?: string[]
          evidence_url?: string | null
          id?: string
          message?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Update: {
          claimant_email?: string
          claimant_name?: string
          claimant_phone?: string | null
          claimant_role?: string | null
          claimed_user_id?: string | null
          created_at?: string
          educator_id?: string
          evidence_file_paths?: string[]
          evidence_url?: string | null
          id?: string
          message?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Relationships: []
      }
      educator_languages: {
        Row: {
          educator_id: string
          id: string
          language_code: string
        }
        Insert: {
          educator_id: string
          id?: string
          language_code: string
        }
        Update: {
          educator_id?: string
          id?: string
          language_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "educator_languages_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
        ]
      }
      educator_locations: {
        Row: {
          address: string | null
          booking_url: string | null
          city: string | null
          country_code: string
          created_at: string
          educator_id: string
          id: string
          lat: number | null
          lng: number | null
          phone: string | null
          postcode: string | null
          region: string | null
        }
        Insert: {
          address?: string | null
          booking_url?: string | null
          city?: string | null
          country_code: string
          created_at?: string
          educator_id: string
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          postcode?: string | null
          region?: string | null
        }
        Update: {
          address?: string | null
          booking_url?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          educator_id?: string
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          postcode?: string | null
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educator_locations_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
        ]
      }
      educator_service_areas: {
        Row: {
          city: string | null
          country_code: string
          created_at: string
          educator_id: string
          id: string
          notes: string | null
          radius_km: number | null
          region: string | null
        }
        Insert: {
          city?: string | null
          country_code: string
          created_at?: string
          educator_id: string
          id?: string
          notes?: string | null
          radius_km?: number | null
          region?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string
          created_at?: string
          educator_id?: string
          id?: string
          notes?: string | null
          radius_km?: number | null
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educator_service_areas_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
        ]
      }
      educators: {
        Row: {
          blurb: string | null
          booking_url: string | null
          claimed_at: string | null
          created_at: string
          hq_country_code: string | null
          id: string
          is_claimed: boolean
          is_online: boolean
          is_verified: boolean
          logo_url: string | null
          name: string
          priority: number
          slug: string
          type: Database["public"]["Enums"]["educator_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          blurb?: string | null
          booking_url?: string | null
          claimed_at?: string | null
          created_at?: string
          hq_country_code?: string | null
          id?: string
          is_claimed?: boolean
          is_online?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name: string
          priority?: number
          slug: string
          type?: Database["public"]["Enums"]["educator_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          blurb?: string | null
          booking_url?: string | null
          claimed_at?: string | null
          created_at?: string
          hq_country_code?: string | null
          id?: string
          is_claimed?: boolean
          is_online?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name?: string
          priority?: number
          slug?: string
          type?: Database["public"]["Enums"]["educator_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      explainer_videos: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          emergency_number: string
          flag: string
          id: string
          language_code: string
          language_name: string
          slug: string
          sort_order: number | null
          title: string
          topic: string
          updated_at: string
          video_url: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          emergency_number: string
          flag: string
          id?: string
          language_code: string
          language_name: string
          slug: string
          sort_order?: number | null
          title: string
          topic: string
          updated_at?: string
          video_url: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          emergency_number?: string
          flag?: string
          id?: string
          language_code?: string
          language_name?: string
          slug?: string
          sort_order?: number | null
          title?: string
          topic?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      give_clicks: {
        Row: {
          country_code: string | null
          country_name: string | null
          created_at: string
          destination_url: string | null
          event_name: string
          id: string
          is_national: boolean | null
          language: string | null
          ngo_id: string | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          variant: string | null
        }
        Insert: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          destination_url?: string | null
          event_name?: string
          id?: string
          is_national?: boolean | null
          language?: string | null
          ngo_id?: string | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          variant?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          destination_url?: string | null
          event_name?: string
          id?: string
          is_national?: boolean | null
          language?: string | null
          ngo_id?: string | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      kb_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string
          id: string
          lang: string
          section: string | null
          slug: string
          title: string | null
          updated_at: string
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string
          embedding: string
          id?: string
          lang?: string
          section?: string | null
          slug: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string
          id?: string
          lang?: string
          section?: string | null
          slug?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string
          course_id: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          body: string | null
          course_id: string
          created_at: string
          duration_minutes: number
          id: string
          slug: string
          sort_order: number
          sources: Json
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          body?: string | null
          course_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          slug: string
          sort_order?: number
          sources?: Json
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          body?: string | null
          course_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          slug?: string
          sort_order?: number
          sources?: Json
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_educators: {
        Row: {
          address: string | null
          blurb: string | null
          booking_url: string | null
          city: string | null
          country_code: string | null
          created_at: string
          hq_country_code: string | null
          id: string
          is_online: boolean
          languages: string[]
          lat: number | null
          lng: number | null
          logo_url: string | null
          name: string
          phone: string | null
          postcode: string | null
          region: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_area_notes: string | null
          slug: string | null
          source: string
          source_url: string | null
          status: Database["public"]["Enums"]["pending_status"]
          submitter_email: string | null
          submitter_name: string | null
          type: Database["public"]["Enums"]["educator_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          blurb?: string | null
          booking_url?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          hq_country_code?: string | null
          id?: string
          is_online?: boolean
          languages?: string[]
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          name: string
          phone?: string | null
          postcode?: string | null
          region?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_area_notes?: string | null
          slug?: string | null
          source?: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["pending_status"]
          submitter_email?: string | null
          submitter_name?: string | null
          type?: Database["public"]["Enums"]["educator_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          blurb?: string | null
          booking_url?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          hq_country_code?: string | null
          id?: string
          is_online?: boolean
          languages?: string[]
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          postcode?: string | null
          region?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_area_notes?: string | null
          slug?: string | null
          source?: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["pending_status"]
          submitter_email?: string | null
          submitter_name?: string | null
          type?: Database["public"]["Enums"]["educator_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          course_id: string
          created_at: string
          id: string
          passed: boolean
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          course_id: string
          created_at?: string
          id?: string
          passed: boolean
          score: number
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          course_id?: string
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          choices: Json
          correct_index: number
          course_id: string
          created_at: string
          explanation: string | null
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          choices: Json
          correct_index: number
          course_id: string
          created_at?: string
          explanation?: string | null
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          choices?: Json
          correct_index?: number
          course_id?: string
          created_at?: string
          explanation?: string | null
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_claim_statuses: {
        Args: { claim_ids: string[] }
        Returns: {
          created_at: string
          id: string
          review_notes: string
          reviewed_at: string
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_kb_chunks: {
        Args: {
          match_count?: number
          match_lang?: string
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          lang: string
          section: string
          similarity: number
          slug: string
          title: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      verify_certificate: {
        Args: { _cert_number: string }
        Returns: {
          certificate_number: string
          course_title: string
          issued_at: string
          learner_initial: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      claim_status: "pending" | "approved" | "rejected"
      educator_type:
        | "st_john"
        | "red_cross"
        | "other_ngo"
        | "commercial"
        | "online"
        | "community"
      pending_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      claim_status: ["pending", "approved", "rejected"],
      educator_type: [
        "st_john",
        "red_cross",
        "other_ngo",
        "commercial",
        "online",
        "community",
      ],
      pending_status: ["pending", "approved", "rejected"],
    },
  },
} as const
