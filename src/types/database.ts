export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            organizations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    whatsapp_number: string | null
                    timezone: string
                    logo_url: string | null
                    settings: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    whatsapp_number?: string | null
                    timezone?: string
                    logo_url?: string | null
                    settings?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    whatsapp_number?: string | null
                    timezone?: string
                    logo_url?: string | null
                    settings?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    duration_minutes: number
                    price: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    duration_minutes: number
                    price: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    duration_minutes?: number
                    price?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            professionals: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    color_code: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    color_code?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    color_code?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            customers: {
                Row: {
                    id: string
                    organization_id: string
                    full_name: string
                    whatsapp_number: string
                    internal_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    full_name: string
                    whatsapp_number: string
                    internal_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    full_name?: string
                    whatsapp_number?: string
                    internal_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    organization_id: string
                    customer_id: string
                    service_id: string
                    professional_id: string
                    start_time: string
                    end_time: string
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    customer_id: string
                    service_id: string
                    professional_id: string
                    start_time: string
                    end_time: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    customer_id?: string
                    service_id?: string
                    professional_id?: string
                    start_time?: string
                    end_time?: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
