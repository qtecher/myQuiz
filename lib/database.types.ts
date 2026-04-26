export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string
          name: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          id: string
          folder_id: string
          question: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          folder_id: string
          question?: string
          answer?: string
          created_at?: string
        }
        Update: {
          id?: string
          folder_id?: string
          question?: string
          answer?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
