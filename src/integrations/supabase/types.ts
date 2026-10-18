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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      alert_actions: {
        Row: {
          alert_key: string
          created_at: string
          description: string
          due_date: string | null
          id: string
          notes: string | null
          owner_id: string
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          alert_key: string
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          alert_key?: string
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
          owner_id: string
        }
        Insert: {
          action: string
          actor_id?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          owner_id?: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          owner_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string
          credit_limit: number
          email: string | null
          gstin: string | null
          id: string
          kind: string
          lead_time_days: number
          name: string
          notes: string | null
          owner_id: string
          payment_terms_days: number
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          credit_limit?: number
          email?: string | null
          gstin?: string | null
          id?: string
          kind: string
          lead_time_days?: number
          name: string
          notes?: string | null
          owner_id?: string
          payment_terms_days?: number
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          credit_limit?: number
          email?: string | null
          gstin?: string | null
          id?: string
          kind?: string
          lead_time_days?: number
          name?: string
          notes?: string | null
          owner_id?: string
          payment_terms_days?: number
          phone?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          expense_date: string
          id: string
          notes: string | null
          owner_id: string
          payment_method: string
          reference: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string | null
          owner_id?: string
          payment_method?: string
          reference?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string | null
          owner_id?: string
          payment_method?: string
          reference?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          contact_id: string | null
          created_at: string
          direction: string
          id: string
          method: string
          notes: string | null
          owner_id: string
          paid_at: string
          purchase_id: string | null
          reference: string | null
          sale_id: string | null
        }
        Insert: {
          amount: number
          contact_id?: string | null
          created_at?: string
          direction: string
          id?: string
          method: string
          notes?: string | null
          owner_id?: string
          paid_at?: string
          purchase_id?: string | null
          reference?: string | null
          sale_id?: string | null
        }
        Update: {
          amount?: number
          contact_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          method?: string
          notes?: string | null
          owner_id?: string
          paid_at?: string
          purchase_id?: string | null
          reference?: string | null
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          gst_rate: number
          hsn_code: string | null
          id: string
          location: string | null
          minimum_stock: number
          name: string
          owner_id: string
          preferred_supplier_id: string | null
          purchase_price: number
          reorder_level: number
          retail_price: number
          sku: string
          status: string
          stock_qty: number
          unit: string
          updated_at: string
          wholesale_price: number
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          location?: string | null
          minimum_stock?: number
          name: string
          owner_id?: string
          preferred_supplier_id?: string | null
          purchase_price?: number
          reorder_level?: number
          retail_price?: number
          sku: string
          status?: string
          stock_qty?: number
          unit?: string
          updated_at?: string
          wholesale_price?: number
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          location?: string | null
          minimum_stock?: number
          name?: string
          owner_id?: string
          preferred_supplier_id?: string | null
          purchase_price?: number
          reorder_level?: number
          retail_price?: number
          sku?: string
          status?: string
          stock_qty?: number
          unit?: string
          updated_at?: string
          wholesale_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_preferred_supplier_id_fkey"
            columns: ["preferred_supplier_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          created_at: string
          discount: number
          gst_rate: number
          id: string
          owner_id: string
          product_id: string | null
          product_name: string
          purchase_id: string
          quantity_ordered: number
          quantity_received: number
          unit_cost: number
        }
        Insert: {
          created_at?: string
          discount?: number
          gst_rate?: number
          id?: string
          owner_id?: string
          product_id?: string | null
          product_name: string
          purchase_id: string
          quantity_ordered: number
          quantity_received?: number
          unit_cost: number
        }
        Update: {
          created_at?: string
          discount?: number
          gst_rate?: number
          id?: string
          owner_id?: string
          product_id?: string | null
          product_name?: string
          purchase_id?: string
          quantity_ordered?: number
          quantity_received?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          due_date: string | null
          freight: number
          id: string
          invoice_number: string | null
          notes: string | null
          order_date: string
          owner_id: string
          paid_amount: number
          status: string
          subtotal: number
          supplier_id: string | null
          tax_total: number
          total: number
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          freight?: number
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_date?: string
          owner_id?: string
          paid_amount?: number
          status?: string
          subtotal?: number
          supplier_id?: string | null
          tax_total?: number
          total?: number
        }
        Update: {
          created_at?: string
          due_date?: string | null
          freight?: number
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_date?: string
          owner_id?: string
          paid_amount?: number
          status?: string
          subtotal?: number
          supplier_id?: string | null
          tax_total?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          discount: number
          gst_rate: number
          id: string
          line_total: number
          owner_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          sku: string | null
          unit_cost: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount?: number
          gst_rate?: number
          id?: string
          line_total?: number
          owner_id?: string
          product_id?: string | null
          product_name: string
          quantity: number
          sale_id: string
          sku?: string | null
          unit_cost?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          discount?: number
          gst_rate?: number
          id?: string
          line_total?: number
          owner_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          sku?: string | null
          unit_cost?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_total: number
          id: string
          invoice_number: string
          notes: string | null
          owner_id: string
          paid_amount: number
          sale_date: string
          status: string
          subtotal: number
          tax_total: number
          total: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_total?: number
          id?: string
          invoice_number: string
          notes?: string | null
          owner_id?: string
          paid_amount?: number
          sale_date?: string
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_total?: number
          id?: string
          invoice_number?: string
          notes?: string | null
          owner_id?: string
          paid_amount?: number
          sale_date?: string
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          movement_type: string
          owner_id: string
          product_id: string
          quantity_change: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          unit_cost: number
        }
        Insert: {
          created_at?: string
          id?: string
          movement_type: string
          owner_id?: string
          product_id: string
          quantity_change: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number
        }
        Update: {
          created_at?: string
          id?: string
          movement_type?: string
          owner_id?: string
          product_id?: string
          quantity_change?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "manager" | "sales" | "inventory" | "accountant"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "manager", "sales", "inventory", "accountant"],
    },
  },
} as const
