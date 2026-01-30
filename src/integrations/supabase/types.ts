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
      announcements: {
        Row: {
          content: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_urgent: boolean | null
          published_at: string
          target_audience: string | null
          title: string
        }
        Insert: {
          content: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_urgent?: boolean | null
          published_at?: string
          target_audience?: string | null
          title: string
        }
        Update: {
          content?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_urgent?: boolean | null
          published_at?: string
          target_audience?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_date: string
          created_at: string
          description: string | null
          discipline_id: string
          id: string
          location: string | null
          max_grade: number | null
          title: string
        }
        Insert: {
          assessment_date: string
          created_at?: string
          description?: string | null
          discipline_id: string
          id?: string
          location?: string | null
          max_grade?: number | null
          title: string
        }
        Update: {
          assessment_date?: string
          created_at?: string
          description?: string | null
          discipline_id?: string
          id?: string
          location?: string | null
          max_grade?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      disciplines: {
        Row: {
          course_id: string
          created_at: string
          credits: number | null
          description: string | null
          id: string
          name: string
          semester: number | null
        }
        Insert: {
          course_id: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name: string
          semester?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name?: string
          semester?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "disciplines_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          document_type: string
          id: string
          notes: string | null
          purpose: string | null
          ready_at: string | null
          requested_at: string
          status: Database["public"]["Enums"]["document_status"]
          student_id: string
        }
        Insert: {
          document_type: string
          id?: string
          notes?: string | null
          purpose?: string | null
          ready_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["document_status"]
          student_id: string
        }
        Update: {
          document_type?: string
          id?: string
          notes?: string | null
          purpose?: string | null
          ready_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["document_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          enrollment_date: string
          expected_completion: string | null
          id: string
          progress_percent: number | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          enrollment_date?: string
          expected_completion?: string | null
          id?: string
          progress_percent?: number | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          enrollment_date?: string
          expected_completion?: string | null
          id?: string
          progress_percent?: number | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          assessment_id: string
          feedback: string | null
          grade: number | null
          graded_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          assessment_id: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          assessment_id?: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inscricoes: {
        Row: {
          bilhete_identidade: string
          created_at: string
          curso_escolhido: string
          data_nascimento: string
          email: string | null
          escolaridade: string
          id: string
          morada: string
          nome_completo: string
          observacoes: string | null
          status: string
          telefone: string
          tipo_curso: string
          updated_at: string
        }
        Insert: {
          bilhete_identidade: string
          created_at?: string
          curso_escolhido: string
          data_nascimento: string
          email?: string | null
          escolaridade: string
          id?: string
          morada: string
          nome_completo: string
          observacoes?: string | null
          status?: string
          telefone: string
          tipo_curso: string
          updated_at?: string
        }
        Update: {
          bilhete_identidade?: string
          created_at?: string
          curso_escolhido?: string
          data_nascimento?: string
          email?: string | null
          escolaridade?: string
          id?: string
          morada?: string
          nome_completo?: string
          observacoes?: string | null
          status?: string
          telefone?: string
          tipo_curso?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          paid_date: string | null
          payment_method: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          id_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          created_at: string
          description: string | null
          discipline_id: string
          file_type: string
          file_url: string | null
          id: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          discipline_id: string
          file_type?: string
          file_url?: string | null
          id?: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          discipline_id?: string
          file_type?: string
          file_url?: string | null
          id?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_materials_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          role?: Database["public"]["Enums"]["app_role"]
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
      vocational_test_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          recommended_courses: Json
          session_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          recommended_courses: Json
          session_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          recommended_courses?: Json
          session_id?: string
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
      app_role: "admin" | "user"
      document_status: "pending" | "processing" | "ready" | "delivered"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      user_type: "student" | "teacher" | "staff" | "admin"
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
      document_status: ["pending", "processing", "ready", "delivered"],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      user_type: ["student", "teacher", "staff", "admin"],
    },
  },
} as const
