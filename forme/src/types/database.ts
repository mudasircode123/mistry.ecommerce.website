// TypeScript types for the Supabase database schema compatible with @supabase/supabase-js v2

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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          sku: string | null
          base_price_paisa: number
          sale_price_paisa: number | null
          is_active: boolean
          is_featured: boolean
          sourcing_type: 'own_stock' | 'supplier'
          supplier_id: string | null
          tags: string[]
          size_guide: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          }
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          color_hex: string | null
          sku: string | null
          price_paisa: number | null
          stock_quantity: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_name: string | null
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>
        Relationships: []
      }
      addresses: {
        Row: {
          id: string
          profile_id: string
          label: string | null
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          province: string | null
          postal_code: string | null
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'addresses_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      wishlists: {
        Row: {
          id: string
          profile_id: string
          product_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wishlists']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'wishlists_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'wishlists_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_paisa: number
          max_uses: number | null
          uses_count: number
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'uses_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          profile_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string
          delivery_city: string
          delivery_province: string | null
          delivery_postal_code: string | null
          subtotal_paisa: number
          discount_paisa: number
          delivery_fee_paisa: number
          total_paisa: number
          coupon_code: string | null
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
          admin_notes: string | null
          tracking_number: string | null
          courier_name: string | null
          tracking_url: string | null
          sheets_synced: boolean
          sheets_sync_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          profile_id?: string | null
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address: string
          delivery_city: string
          delivery_province?: string | null
          delivery_postal_code?: string | null
          subtotal_paisa: number
          discount_paisa?: number
          delivery_fee_paisa?: number
          total_paisa: number
          coupon_code?: string | null
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
          admin_notes?: string | null
          tracking_number?: string | null
          courier_name?: string | null
          tracking_url?: string | null
          sheets_synced?: boolean
          sheets_sync_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Row']>
        Relationships: [
          {
            foreignKeyName: 'orders_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          product_name_snapshot: string
          variant_size_snapshot: string | null
          variant_color_snapshot: string | null
          product_image_snapshot: string | null
          unit_price_paisa: number
          quantity: number
          line_total_paisa: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          product_name_snapshot: string
          variant_size_snapshot?: string | null
          variant_color_snapshot?: string | null
          product_image_snapshot?: string | null
          unit_price_paisa: number
          quantity: number
          line_total_paisa: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          profile_id: string | null
          title: string
          body: string
          type: 'order' | 'payment' | 'shipping' | 'system' | 'admin'
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'notifications_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: never
        Relationships: [
          {
            foreignKeyName: 'audit_logs_admin_id_fkey'
            columns: ['admin_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          category: 'general' | 'order_inquiry' | 'returns' | 'wholesale' | 'feedback' | 'ai_assistant'
          order_number: string | null
          status: 'new' | 'in_progress' | 'resolved' | 'closed'
          source: string
          ip_address: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          source: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_coupon_usage: {
        Args: { coupon_code: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Supplier = Database['public']['Tables']['suppliers']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']

// Extended types with joins
export interface ProductWithDetails extends Product {
  categories?: Category | null
  product_images?: ProductImage[]
  product_variants?: ProductVariant[]
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

// Cart types (client-side)
export interface CartItem {
  id: string // unique cart item id
  productId: string
  variantId: string | null
  name: string
  category: string | null
  image: string | null
  size: string | null
  color: string | null
  unitPricePaisa: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number // paisa
}
