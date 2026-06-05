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
      assessment_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          passed: boolean
          program_slug: string
          score: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          passed: boolean
          program_slug: string
          score?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          passed?: boolean
          program_slug?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          program_slug: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          program_slug?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          program_slug?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_blocks: {
        Row: {
          block_type: string
          body_md: string | null
          caption: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          data: Json
          embed_html: string | null
          id: string
          media_alt: string | null
          media_poster_url: string | null
          media_url: string | null
          post_id: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          block_type?: string
          body_md?: string | null
          caption?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          data?: Json
          embed_html?: string | null
          id?: string
          media_alt?: string | null
          media_poster_url?: string | null
          media_url?: string | null
          post_id: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_type?: string
          body_md?: string | null
          caption?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          data?: Json
          embed_html?: string | null
          id?: string
          media_alt?: string | null
          media_poster_url?: string | null
          media_url?: string | null
          post_id?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_blocks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          category_id: string
          cover_alt: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string | null
          reading_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category_id: string
          cover_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category_id?: string
          cover_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_credits: {
        Row: {
          balance: number
          environment: string
          unlimited: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          environment?: string
          unlimited?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          environment?: string
          unlimited?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      certificate_eligibility_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          program_slug: string
          token_hash: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          program_slug: string
          token_hash: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          program_slug?: string
          token_hash?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
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
      cms_block_translations: {
        Row: {
          block_id: string
          body_md: string | null
          cta_label: string | null
          id: string
          is_machine: boolean
          lang: string
          title: string | null
          updated_at: string
        }
        Insert: {
          block_id: string
          body_md?: string | null
          cta_label?: string | null
          id?: string
          is_machine?: boolean
          lang: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_id?: string
          body_md?: string | null
          cta_label?: string | null
          id?: string
          is_machine?: boolean
          lang?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_block_translations_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "cms_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_blocks: {
        Row: {
          block_key: string
          block_type: string
          body_md: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          data: Json
          id: string
          image_url: string | null
          page_id: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          block_type?: string
          body_md?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          data?: Json
          id?: string
          image_url?: string | null
          page_id: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          block_type?: string
          body_md?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          data?: Json
          id?: string
          image_url?: string | null
          page_id?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_page_translations: {
        Row: {
          description: string | null
          id: string
          is_machine: boolean
          lang: string
          page_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_machine?: boolean
          lang: string
          page_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          is_machine?: boolean
          lang?: string
          page_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          preview_token: string
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          preview_token?: string
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          preview_token?: string
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
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
      course_translations: {
        Row: {
          course_id: string
          description: string | null
          is_machine: boolean
          lang: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          description?: string | null
          is_machine?: boolean
          lang: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          description?: string | null
          is_machine?: boolean
          lang?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_video_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_position_seconds: number
          seconds_watched: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_position_seconds?: number
          seconds_watched?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_position_seconds?: number
          seconds_watched?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          video_duration_seconds: number | null
          video_source_name: string | null
          video_source_website: string | null
          video_source_youtube: string | null
          video_url: string | null
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
          video_duration_seconds?: number | null
          video_source_name?: string | null
          video_source_website?: string | null
          video_source_youtube?: string | null
          video_url?: string | null
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
          video_duration_seconds?: number | null
          video_source_name?: string | null
          video_source_website?: string | null
          video_source_youtube?: string | null
          video_url?: string | null
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
          submitter_user_id: string | null
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
          submitter_user_id?: string | null
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
          submitter_user_id?: string | null
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
      educator_profiles: {
        Row: {
          created_at: string
          educator_id: string
          generated_at: string
          how_text: string | null
          id: string
          model: string | null
          qas: Json
          source_url: string | null
          updated_at: string
          what_text: string | null
          who_text: string | null
          why_text: string | null
        }
        Insert: {
          created_at?: string
          educator_id: string
          generated_at?: string
          how_text?: string | null
          id?: string
          model?: string | null
          qas?: Json
          source_url?: string | null
          updated_at?: string
          what_text?: string | null
          who_text?: string | null
          why_text?: string | null
        }
        Update: {
          created_at?: string
          educator_id?: string
          generated_at?: string
          how_text?: string | null
          id?: string
          model?: string | null
          qas?: Json
          source_url?: string | null
          updated_at?: string
          what_text?: string | null
          who_text?: string | null
          why_text?: string | null
        }
        Relationships: []
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
      lesson_translations: {
        Row: {
          body: string | null
          is_machine: boolean
          lang: string
          lesson_id: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          is_machine?: boolean
          lang: string
          lesson_id: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          is_machine?: boolean
          lang?: string
          lesson_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
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
      lk_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after_value: Json | null
          before_value: Json | null
          created_at: string
          id: string
          notes: string | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      lk_translation_status: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          language_code: string
          locale_id: string | null
          notes: string | null
          published_at: string | null
          reviewed_by: string | null
          status: string
          translator: string | null
          updated_at: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          language_code: string
          locale_id?: string | null
          notes?: string | null
          published_at?: string | null
          reviewed_by?: string | null
          status?: string
          translator?: string | null
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          language_code?: string
          locale_id?: string | null
          notes?: string | null
          published_at?: string | null
          reviewed_by?: string | null
          status?: string
          translator?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lk_translation_status_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_crisis_lines: {
        Row: {
          audience: string | null
          availability: string | null
          confidence: string
          cost: string | null
          created_at: string
          description: string | null
          id: string
          last_checked_at: string | null
          locale_id: string
          name: string
          phone: string | null
          service_slug: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          audience?: string | null
          availability?: string | null
          confidence?: string
          cost?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id: string
          name: string
          phone?: string | null
          service_slug?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          audience?: string | null
          availability?: string | null
          confidence?: string
          cost?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id?: string
          name?: string
          phone?: string | null
          service_slug?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locale_crisis_lines_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_emergency_contacts: {
        Row: {
          confidence: string
          created_at: string
          id: string
          label: string | null
          last_checked_at: string | null
          locale_id: string
          notes: string | null
          number: string
          service_type: string
          updated_at: string
        }
        Insert: {
          confidence?: string
          created_at?: string
          id?: string
          label?: string | null
          last_checked_at?: string | null
          locale_id: string
          notes?: string | null
          number: string
          service_type: string
          updated_at?: string
        }
        Update: {
          confidence?: string
          created_at?: string
          id?: string
          label?: string | null
          last_checked_at?: string | null
          locale_id?: string
          notes?: string | null
          number?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locale_emergency_contacts_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_packs: {
        Row: {
          confidence: string
          country_code: string
          created_at: string
          currency: string | null
          id: string
          last_reviewed_at: string | null
          locale_id: string
          locale_name: string
          locale_type: string
          parent_locale_id: string | null
          primary_language: string | null
          secondary_languages: string[] | null
          status: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          confidence?: string
          country_code: string
          created_at?: string
          currency?: string | null
          id?: string
          last_reviewed_at?: string | null
          locale_id: string
          locale_name: string
          locale_type: string
          parent_locale_id?: string | null
          primary_language?: string | null
          secondary_languages?: string[] | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          confidence?: string
          country_code?: string
          created_at?: string
          currency?: string | null
          id?: string
          last_reviewed_at?: string | null
          locale_id?: string
          locale_name?: string
          locale_type?: string
          parent_locale_id?: string | null
          primary_language?: string | null
          secondary_languages?: string[] | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locale_packs_parent_locale_id_fkey"
            columns: ["parent_locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_recovery_programs: {
        Row: {
          application_url: string | null
          confidence: string
          created_at: string
          disaster_types: string[] | null
          eligibility_disclaimer: string | null
          eligibility_summary: string | null
          id: string
          last_checked_at: string | null
          locale_id: string
          name: string
          notes: string | null
          provider: string | null
          support_categories: string[] | null
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          confidence?: string
          created_at?: string
          disaster_types?: string[] | null
          eligibility_disclaimer?: string | null
          eligibility_summary?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id: string
          name: string
          notes?: string | null
          provider?: string | null
          support_categories?: string[] | null
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          confidence?: string
          created_at?: string
          disaster_types?: string[] | null
          eligibility_disclaimer?: string | null
          eligibility_summary?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id?: string
          name?: string
          notes?: string | null
          provider?: string | null
          support_categories?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locale_recovery_programs_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_trusted_entities: {
        Row: {
          created_at: string
          entity_type: string | null
          id: string
          last_checked_at: string | null
          locale_id: string
          name: string
          notes: string | null
          official_website: string | null
          recovery_url: string | null
          shop_url: string | null
          status: string
          training_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id: string
          name: string
          notes?: string | null
          official_website?: string | null
          recovery_url?: string | null
          shop_url?: string | null
          status?: string
          training_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: string | null
          id?: string
          last_checked_at?: string | null
          locale_id?: string
          name?: string
          notes?: string | null
          official_website?: string | null
          recovery_url?: string | null
          shop_url?: string | null
          status?: string
          training_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locale_trusted_entities_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      locale_warning_sources: {
        Row: {
          authority_level: string | null
          confidence: string
          created_at: string
          crisis_types: string[] | null
          id: string
          last_checked_at: string | null
          locale_id: string
          name: string
          notes: string | null
          region: string | null
          source_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          authority_level?: string | null
          confidence?: string
          created_at?: string
          crisis_types?: string[] | null
          id?: string
          last_checked_at?: string | null
          locale_id: string
          name: string
          notes?: string | null
          region?: string | null
          source_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          authority_level?: string | null
          confidence?: string
          created_at?: string
          crisis_types?: string[] | null
          id?: string
          last_checked_at?: string | null
          locale_id?: string
          name?: string
          notes?: string | null
          region?: string | null
          source_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locale_warning_sources_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      org_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          org_id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          org_id: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          org_id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_audit_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_course_assignments: {
        Row: {
          assigned_by: string | null
          completed_at: string | null
          course_id: string
          created_at: string
          due_at: string | null
          id: string
          member_id: string
          org_id: string
          status: Database["public"]["Enums"]["org_assignment_status"]
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          due_at?: string | null
          id?: string
          member_id: string
          org_id: string
          status?: Database["public"]["Enums"]["org_assignment_status"]
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          due_at?: string | null
          id?: string
          member_id?: string
          org_id?: string
          status?: Database["public"]["Enums"]["org_assignment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_course_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "org_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_course_assignments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_import_jobs: {
        Row: {
          created_at: string
          error_report: Json
          error_rows: number
          file_path: string
          id: string
          org_id: string
          status: Database["public"]["Enums"]["org_import_status"]
          success_rows: number
          total_rows: number
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          error_report?: Json
          error_rows?: number
          file_path: string
          id?: string
          org_id: string
          status?: Database["public"]["Enums"]["org_import_status"]
          success_rows?: number
          total_rows?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          error_report?: Json
          error_rows?: number
          file_path?: string
          id?: string
          org_id?: string
          status?: Database["public"]["Enums"]["org_import_status"]
          success_rows?: number
          total_rows?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_import_jobs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          department: string | null
          email: string
          employee_ref: string | null
          full_name: string | null
          id: string
          invited_at: string
          joined_at: string | null
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          status: Database["public"]["Enums"]["org_member_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          employee_ref?: string | null
          full_name?: string | null
          id?: string
          invited_at?: string
          joined_at?: string | null
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: Database["public"]["Enums"]["org_member_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          employee_ref?: string | null
          full_name?: string | null
          id?: string
          invited_at?: string
          joined_at?: string | null
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: Database["public"]["Enums"]["org_member_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_program_assignments: {
        Row: {
          assigned_by: string | null
          completed_at: string | null
          created_at: string
          due_at: string | null
          id: string
          member_id: string
          org_id: string
          program_id: string
          status: Database["public"]["Enums"]["org_assignment_status"]
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          member_id: string
          org_id: string
          program_id: string
          status?: Database["public"]["Enums"]["org_assignment_status"]
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          member_id?: string
          org_id?: string
          program_id?: string
          status?: Database["public"]["Enums"]["org_assignment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_program_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "org_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_program_assignments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_program_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          billing_email: string | null
          country_code: string | null
          created_at: string
          created_by: string | null
          id: string
          industry: string | null
          join_code: string | null
          logo_url: string | null
          name: string
          primary_color: string | null
          seat_limit: number
          slug: string
          status: Database["public"]["Enums"]["org_status"]
          updated_at: string
        }
        Insert: {
          billing_email?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          industry?: string | null
          join_code?: string | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          seat_limit?: number
          slug: string
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
        }
        Update: {
          billing_email?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          industry?: string | null
          join_code?: string | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          seat_limit?: number
          slug?: string
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          marketing_opt_in: boolean
          marketing_opt_in_at: string | null
          shopify_customer_id: string | null
          shopify_synced_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          marketing_opt_in?: boolean
          marketing_opt_in_at?: string | null
          shopify_customer_id?: string | null
          shopify_synced_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          marketing_opt_in?: boolean
          marketing_opt_in_at?: string | null
          shopify_customer_id?: string | null
          shopify_synced_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_certificates: {
        Row: {
          certificate_number: string
          id: string
          issued_at: string
          learner_name: string
          program_id: string
          user_id: string
        }
        Insert: {
          certificate_number?: string
          id?: string
          issued_at?: string
          learner_name: string
          program_id: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          id?: string
          issued_at?: string
          learner_name?: string
          program_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_certificates_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_completions: {
        Row: {
          id: string
          passed_at: string | null
          program_slug: string
          score: number | null
          user_id: string
        }
        Insert: {
          id?: string
          passed_at?: string | null
          program_slug: string
          score?: number | null
          user_id: string
        }
        Update: {
          id?: string
          passed_at?: string | null
          program_slug?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      program_enrollments: {
        Row: {
          id: string
          program_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          id?: string
          program_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          id?: string
          program_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          passed: boolean
          program_id: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          passed: boolean
          program_id: string
          score: number
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          program_id?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_quiz_attempts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_quiz_questions: {
        Row: {
          choices: Json
          correct_index: number
          created_at: string
          explanation: string | null
          id: string
          program_id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          choices: Json
          correct_index: number
          created_at?: string
          explanation?: string | null
          id?: string
          program_id: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          choices?: Json
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          program_id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_quiz_questions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_topics: {
        Row: {
          course_id: string
          created_at: string
          id: string
          program_id: string
          sort_order: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          program_id: string
          sort_order?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          program_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_topics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_published: boolean
          pass_mark: number
          shopify_certificate_price: number | null
          shopify_certificate_variant_id: string | null
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
          pass_mark?: number
          shopify_certificate_price?: number | null
          shopify_certificate_variant_id?: string | null
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
          pass_mark?: number
          shopify_certificate_price?: number | null
          shopify_certificate_variant_id?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
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
      quiz_question_translations: {
        Row: {
          choices: Json
          explanation: string | null
          is_machine: boolean
          lang: string
          question: string
          question_id: string
          updated_at: string
        }
        Insert: {
          choices: Json
          explanation?: string | null
          is_machine?: boolean
          lang: string
          question: string
          question_id: string
          updated_at?: string
        }
        Update: {
          choices?: Json
          explanation?: string | null
          is_machine?: boolean
          lang?: string
          question?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_translations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
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
      route_catalogue: {
        Row: {
          availability_status: string | null
          confidence: string | null
          country: string | null
          cta_label: string | null
          currency: string | null
          description: string | null
          destination_url: string | null
          id: string
          image_url: string | null
          last_checked_at: string | null
          partner_entity: string | null
          price: number | null
          referral_code: string | null
          related_program: string | null
          route_slug: string
          route_type: string | null
          synced_at: string | null
          title: string | null
          utm_campaign: string | null
          utm_content: string | null
          vendor: string | null
        }
        Insert: {
          availability_status?: string | null
          confidence?: string | null
          country?: string | null
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          destination_url?: string | null
          id: string
          image_url?: string | null
          last_checked_at?: string | null
          partner_entity?: string | null
          price?: number | null
          referral_code?: string | null
          related_program?: string | null
          route_slug: string
          route_type?: string | null
          synced_at?: string | null
          title?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          vendor?: string | null
        }
        Update: {
          availability_status?: string | null
          confidence?: string | null
          country?: string | null
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          destination_url?: string | null
          id?: string
          image_url?: string | null
          last_checked_at?: string | null
          partner_entity?: string | null
          price?: number | null
          referral_code?: string | null
          related_program?: string | null
          route_slug?: string
          route_type?: string | null
          synced_at?: string | null
          title?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
      route_catalogue_sync_runs: {
        Row: {
          error: string | null
          finished_at: string | null
          id: string
          started_at: string
          status: string
          synced_count: number
          triggered_by: string | null
        }
        Insert: {
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          synced_count?: number
          triggered_by?: string | null
        }
        Update: {
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          synced_count?: number
          triggered_by?: string | null
        }
        Relationships: []
      }
      route_clicks: {
        Row: {
          click_id: string
          country: string | null
          destination_url: string | null
          id: string
          partner_slug: string | null
          route_slug: string
          session_id: string | null
          source_page: string | null
          timestamp: string | null
        }
        Insert: {
          click_id: string
          country?: string | null
          destination_url?: string | null
          id?: string
          partner_slug?: string | null
          route_slug: string
          session_id?: string | null
          source_page?: string | null
          timestamp?: string | null
        }
        Update: {
          click_id?: string
          country?: string | null
          destination_url?: string | null
          id?: string
          partner_slug?: string | null
          route_slug?: string
          session_id?: string | null
          source_page?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      route_disclosures: {
        Row: {
          active: boolean
          applies_to_route_types: string[] | null
          created_at: string
          disclosure_id: string
          disclosure_type: string | null
          full_text: string | null
          id: string
          locale_id: string | null
          short_text: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          applies_to_route_types?: string[] | null
          created_at?: string
          disclosure_id: string
          disclosure_type?: string | null
          full_text?: string | null
          id?: string
          locale_id?: string | null
          short_text: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          applies_to_route_types?: string[] | null
          created_at?: string
          disclosure_id?: string
          disclosure_type?: string | null
          full_text?: string | null
          id?: string
          locale_id?: string | null
          short_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_disclosures_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      rsp_signals: {
        Row: {
          created_at: string
          expires_at: string | null
          help_stage: string
          id: string
          location_country: string | null
          location_language: string | null
          raw_event_decoupled_at: string | null
          sensitivity_tier: number
          session_id: string
          site: string
          source_event_type: string
          suppression_active: boolean
          theme: string | null
          urgency: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          help_stage: string
          id?: string
          location_country?: string | null
          location_language?: string | null
          raw_event_decoupled_at?: string | null
          sensitivity_tier: number
          session_id: string
          site: string
          source_event_type: string
          suppression_active?: boolean
          theme?: string | null
          urgency?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          help_stage?: string
          id?: string
          location_country?: string | null
          location_language?: string | null
          raw_event_decoupled_at?: string | null
          sensitivity_tier?: number
          session_id?: string
          site?: string
          source_event_type?: string
          suppression_active?: boolean
          theme?: string | null
          urgency?: string
        }
        Relationships: []
      }
      shopify_certificate_jobs: {
        Row: {
          certificate_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_email: string
          customer_first_name: string | null
          customer_last_name: string | null
          eligibility_verified: boolean | null
          error_message: string | null
          id: string
          pdf_url: string | null
          program_name: string | null
          program_slug: string
          shopify_line_item_id: string
          shopify_order_id: string
          shopify_webhook_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          eligibility_verified?: boolean | null
          error_message?: string | null
          id?: string
          pdf_url?: string | null
          program_name?: string | null
          program_slug: string
          shopify_line_item_id: string
          shopify_order_id: string
          shopify_webhook_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          eligibility_verified?: boolean | null
          error_message?: string | null
          id?: string
          pdf_url?: string | null
          program_name?: string | null
          program_slug?: string
          shopify_line_item_id?: string
          shopify_order_id?: string
          shopify_webhook_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_certificate_jobs_shopify_webhook_id_fkey"
            columns: ["shopify_webhook_id"]
            isOneToOne: false
            referencedRelation: "webhook_events"
            referencedColumns: ["shopify_webhook_id"]
          },
        ]
      }
      shopify_certificates: {
        Row: {
          certificate_id: string
          certificate_template_version: string | null
          completion_date: string
          cpd_disclaimer_version: string | null
          cpd_hours: number | null
          created_at: string | null
          expires_at: string | null
          issue_date: string
          job_id: string | null
          learner_name: string
          pdf_url: string | null
          program_name: string
          program_slug: string
          program_version: string | null
          revocation_reason: string | null
          shopify_order_id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          certificate_id: string
          certificate_template_version?: string | null
          completion_date: string
          cpd_disclaimer_version?: string | null
          cpd_hours?: number | null
          created_at?: string | null
          expires_at?: string | null
          issue_date: string
          job_id?: string | null
          learner_name: string
          pdf_url?: string | null
          program_name: string
          program_slug: string
          program_version?: string | null
          revocation_reason?: string | null
          shopify_order_id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_id?: string
          certificate_template_version?: string | null
          completion_date?: string
          cpd_disclaimer_version?: string | null
          cpd_hours?: number | null
          created_at?: string | null
          expires_at?: string | null
          issue_date?: string
          job_id?: string | null
          learner_name?: string
          pdf_url?: string | null
          program_name?: string
          program_slug?: string
          program_version?: string | null
          revocation_reason?: string | null
          shopify_order_id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_certificates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "shopify_certificate_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      source_registry: {
        Row: {
          authority_level: string | null
          check_frequency: string | null
          confidence: string
          created_at: string
          id: string
          last_checked_at: string | null
          locale_id: string | null
          name: string
          notes: string | null
          related_help_stage: string | null
          source_id: string
          source_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          authority_level?: string | null
          check_frequency?: string | null
          confidence?: string
          created_at?: string
          id?: string
          last_checked_at?: string | null
          locale_id?: string | null
          name: string
          notes?: string | null
          related_help_stage?: string | null
          source_id: string
          source_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          authority_level?: string | null
          check_frequency?: string | null
          confidence?: string
          created_at?: string
          id?: string
          last_checked_at?: string | null
          locale_id?: string | null
          name?: string
          notes?: string | null
          related_help_stage?: string | null
          source_id?: string
          source_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_registry_locale_id_fkey"
            columns: ["locale_id"]
            isOneToOne: false
            referencedRelation: "locale_packs"
            referencedColumns: ["locale_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id?: string
          paddle_subscription_id?: string
          price_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      webhook_events: {
        Row: {
          created_at: string | null
          id: string
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          raw_payload: Json | null
          shop_domain: string
          shopify_event_id: string | null
          shopify_topic: string
          shopify_webhook_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_payload?: Json | null
          shop_domain: string
          shopify_event_id?: string | null
          shopify_topic: string
          shopify_webhook_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_payload?: Json | null
          shop_domain?: string
          shopify_event_id?: string | null
          shopify_topic?: string
          shopify_webhook_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_route_catalogue: {
        Row: {
          availability_status: string | null
          confidence: string | null
          country: string | null
          cta_label: string | null
          description: string | null
          id: string | null
          image_url: string | null
          last_checked_at: string | null
          partner_entity: string | null
          related_program: string | null
          route_slug: string | null
          route_type: string | null
          synced_at: string | null
          title: string | null
          vendor: string | null
        }
        Insert: {
          availability_status?: string | null
          confidence?: string | null
          country?: string | null
          cta_label?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          last_checked_at?: string | null
          partner_entity?: string | null
          related_program?: string | null
          route_slug?: string | null
          route_type?: string | null
          synced_at?: string | null
          title?: string | null
          vendor?: string | null
        }
        Update: {
          availability_status?: string | null
          confidence?: string | null
          country?: string | null
          cta_label?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          last_checked_at?: string | null
          partner_entity?: string | null
          related_program?: string | null
          route_slug?: string | null
          route_type?: string | null
          synced_at?: string | null
          title?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invitation_by_token: {
        Args: { _token: string }
        Returns: undefined
      }
      consume_certificate_credit: {
        Args: { _env?: string; _user: string }
        Returns: boolean
      }
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
      get_cms_preview: {
        Args: { p_lang?: string; p_slug: string; p_token: string }
        Returns: Json
      }
      get_invitation_by_token: {
        Args: { _token: string }
        Returns: {
          accepted_at: string
          expires_at: string
          org_id: string
        }[]
      }
      get_org_billing_email: { Args: { _org: string }; Returns: string }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      has_org_role: {
        Args: {
          _min: Database["public"]["Enums"]["org_role"]
          _org: string
          _user: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: { Args: { _org: string; _user: string }; Returns: boolean }
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
      user_org_ids: { Args: { _user: string }; Returns: string[] }
      verify_certificate: {
        Args: { _cert_number: string }
        Returns: {
          certificate_number: string
          course_title: string
          issued_at: string
          learner_initial: string
        }[]
      }
      verify_shopify_certificate: {
        Args: { _certificate_id: string }
        Returns: {
          certificate_id: string
          completion_date: string
          issue_date: string
          learner_initial: string
          program_name: string
          status: string
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
      org_assignment_status:
        | "assigned"
        | "in_progress"
        | "completed"
        | "overdue"
      org_import_status: "queued" | "processing" | "completed" | "failed"
      org_member_status: "invited" | "active" | "removed"
      org_role: "owner" | "admin" | "manager" | "learner"
      org_status: "active" | "suspended" | "trial"
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
      org_assignment_status: [
        "assigned",
        "in_progress",
        "completed",
        "overdue",
      ],
      org_import_status: ["queued", "processing", "completed", "failed"],
      org_member_status: ["invited", "active", "removed"],
      org_role: ["owner", "admin", "manager", "learner"],
      org_status: ["active", "suspended", "trial"],
      pending_status: ["pending", "approved", "rejected"],
    },
  },
} as const
