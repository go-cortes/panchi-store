export type Role = 'cliente' | 'admin'

export interface User {
  id: number
  email: string
  name: string
  role: Role
}

export interface Product {
  id: number
  name: string
  description: string
  price: number // CLP
  stock: number
  brand: string
  category: string
  images: string[]
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  product: Product
  qty: number
  price_snapshot: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
}

export interface ApiError {
  error: {
    code:
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'ERROR_CODE_NOT_FOUND'
      | 'VALIDATION_ERROR'
      | 'BAD_REQUEST'
    message: string
  }
}

export interface ApiResponse<T> {
  data: T
  page?: number
  total?: number
}