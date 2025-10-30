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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          apple_music_id: string | null
          apple_music_url: string | null
          audiomack_url: string | null
          bio: string | null
          created_at: string
          deezer_url: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          profile_image: string | null
          soundcloud_url: string | null
          spotify_id: string | null
          spotify_url: string | null
          stage_name: string
          tidal_url: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string | null
          youtube_url: string | null
        }
        Insert: {
          apple_music_id?: string | null
          apple_music_url?: string | null
          audiomack_url?: string | null
          bio?: string | null
          created_at?: string
          deezer_url?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          profile_image?: string | null
          soundcloud_url?: string | null
          spotify_id?: string | null
          spotify_url?: string | null
          stage_name: string
          tidal_url?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          apple_music_id?: string | null
          apple_music_url?: string | null
          audiomack_url?: string | null
          bio?: string | null
          created_at?: string
          deezer_url?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          profile_image?: string | null
          soundcloud_url?: string | null
          spotify_id?: string | null
          spotify_url?: string | null
          stage_name?: string
          tidal_url?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      campaign_metrics: {
        Row: {
          campaign_id: string
          clicks: number
          conversions: number
          created_at: string
          date: string
          engagement: number
          id: string
          impressions: number
          reach: number
          spend: number
          updated_at: string
        }
        Insert: {
          campaign_id: string
          clicks?: number
          conversions?: number
          created_at?: string
          date: string
          engagement?: number
          id?: string
          impressions?: number
          reach?: number
          spend?: number
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          engagement?: number
          id?: string
          impressions?: number
          reach?: number
          spend?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          artist_id: string | null
          budget: number
          created_at: string
          end_date: string | null
          id: string
          name: string
          platform: string
          release_id: string | null
          spent: number
          start_date: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist_id?: string | null
          budget: number
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          platform: string
          release_id?: string | null
          spent?: number
          start_date: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist_id?: string | null
          budget?: number
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          platform?: string
          release_id?: string | null
          spent?: number
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          artist_id: string
          created_at: string
          currency: string
          id: string
          period_end: string
          period_start: string
          platform: string | null
          release_id: string | null
          source: string
          status: string
          track_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          artist_id: string
          created_at?: string
          currency?: string
          id?: string
          period_end: string
          period_start: string
          platform?: string | null
          release_id?: string | null
          source: string
          status?: string
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          artist_id?: string
          created_at?: string
          currency?: string
          id?: string
          period_end?: string
          period_start?: string
          platform?: string | null
          release_id?: string | null
          source?: string
          status?: string
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      label_artists: {
        Row: {
          artist_id: string
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          id: string
          label_id: string
          revenue_share_percentage: number | null
          status: string
          updated_at: string
        }
        Insert: {
          artist_id: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          label_id: string
          revenue_share_percentage?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          artist_id?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          label_id?: string
          revenue_share_percentage?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "label_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_methods: {
        Row: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          currency: string
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          metadata: Json | null
          recipient_code: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          currency?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          recipient_code: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          currency?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          recipient_code?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          artist_id: string
          copyright: string | null
          cover_art_url: string | null
          created_at: string
          genre: string | null
          id: string
          label: string | null
          language: string | null
          release_date: string
          release_type: string
          smartlink: string | null
          status: string
          title: string
          upc_ean: string | null
          updated_at: string
        }
        Insert: {
          artist_id: string
          copyright?: string | null
          cover_art_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          label?: string | null
          language?: string | null
          release_date: string
          release_type: string
          smartlink?: string | null
          status?: string
          title: string
          upc_ean?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: string
          copyright?: string | null
          cover_art_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          label?: string | null
          language?: string | null
          release_date?: string
          release_type?: string
          smartlink?: string | null
          status?: string
          title?: string
          upc_ean?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "releases_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      streaming_data: {
        Row: {
          country: string | null
          created_at: string
          date: string
          id: string
          platform: string
          streams: number
          track_id: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          date: string
          id?: string
          platform: string
          streams?: number
          track_id: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          date?: string
          id?: string
          platform?: string
          streams?: number
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaming_data_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          features: Json | null
          id: string
          max_artists: number | null
          name: string
          price_monthly: number
          tier: Database["public"]["Enums"]["user_tier"]
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          max_artists?: number | null
          name: string
          price_monthly: number
          tier: Database["public"]["Enums"]["user_tier"]
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          max_artists?: number | null
          name?: string
          price_monthly?: number
          tier?: Database["public"]["Enums"]["user_tier"]
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paystack_customer_code: string | null
          paystack_subscription_code: string | null
          status: string
          tier: Database["public"]["Enums"]["user_tier"]
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paystack_customer_code?: string | null
          paystack_subscription_code?: string | null
          status?: string
          tier: Database["public"]["Enums"]["user_tier"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paystack_customer_code?: string | null
          paystack_subscription_code?: string | null
          status?: string
          tier?: Database["public"]["Enums"]["user_tier"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          audio_file_url: string | null
          created_at: string
          duration: number
          id: string
          isrc: string | null
          lyrics: string | null
          release_id: string
          title: string
          track_number: number
          updated_at: string
        }
        Insert: {
          audio_file_url?: string | null
          created_at?: string
          duration: number
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_id: string
          title: string
          track_number: number
          updated_at?: string
        }
        Update: {
          audio_file_url?: string | null
          created_at?: string
          duration?: number
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_id?: string
          title?: string
          track_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          tier: Database["public"]["Enums"]["user_tier"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["user_tier"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["user_tier"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_balance: {
        Row: {
          available_balance: number | null
          created_at: string | null
          currency: string
          id: string
          pending_balance: number | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          pending_balance?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          pending_balance?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      withdrawal_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string
          description: string | null
          failure_reason: string | null
          fee: number | null
          id: string
          net_amount: number
          payout_method_id: string | null
          paystack_response: Json | null
          reference: string
          requested_at: string | null
          status: string
          transfer_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          failure_reason?: string | null
          fee?: number | null
          id?: string
          net_amount: number
          payout_method_id?: string | null
          paystack_response?: Json | null
          reference: string
          requested_at?: string | null
          status?: string
          transfer_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          failure_reason?: string | null
          fee?: number | null
          id?: string
          net_amount?: number
          payout_method_id?: string | null
          paystack_response?: Json | null
          reference?: string
          requested_at?: string | null
          status?: string
          transfer_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_transactions_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tier: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_tier"]
      }
    }
    Enums: {
      user_tier: "artist" | "label" | "agency" | "admin"
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
      user_tier: ["artist", "label", "agency", "admin"],
    },
  },
} as const
