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
      user_tier: "artist" | "label" | "agency"
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
      user_tier: ["artist", "label", "agency"],
    },
  },
} as const
