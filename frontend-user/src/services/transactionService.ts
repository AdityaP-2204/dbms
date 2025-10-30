import axiosInstance from '../api/axiosConfig';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Transaction {
  transaction_id: string;
  user_id: string;
  total_amount: number;
  coupon_id: string | null;
  payment_status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  transaction_date: string;
}

export interface OrderItem {
  order_item_id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  order_date: string;
  transaction_id: string;
}

export interface Variant {
  id: string;
  attempt: string;
  price: number;
  variant_image: string;
  delivery_mode: string;
  availability: boolean;
  validity: string;
  product_id: string;
}

export interface Product {
  id: string;
  product_title: string;
  description: string;
  product_image: string;
  product_type: string;
  is_combo: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ✅ Fetch all transactions for a specific user
export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/transaction`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// ✅ Fetch all transactions (for admin)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    
    const response = await axiosInstance.get(`${API_BASE_URL}/transaction`);
    console.log("yogesh here",response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
};

// ✅ Fetch all order items by transaction ID
export const getOrdersByTransactionId = async (transactionId: string): Promise<OrderItem[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orders`, {
      params: { transactionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
};

// ✅ Fetch variant details by ID
export const getVariantById = async (variantId: string): Promise<Variant> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/variant`, {
      params: { id: variantId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching variant:', error);
    throw error;
  }
};

// ✅ Fetch product details by ID
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/product`, {
      params: { id: productId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// ✅ NEW: Fetch user details by ID (to get email for each transaction)
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/v1/user`, {
      params: { id: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
