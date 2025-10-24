import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/coupon';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discount: number;
  finalTotal: number;
}

export const validateCoupon = async (code: string, cartTotal: number): Promise<CouponValidationResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate`, null, {
      params: {
        code: code,
        cartTotal: cartTotal
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw error;
  }
};
