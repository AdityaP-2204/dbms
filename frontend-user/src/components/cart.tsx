// Cart.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "./cartItem";
import { validateCoupon } from "../services/couponService";
import type { CouponValidationResult } from "../services/couponService";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

interface Variant {
  id: string;
  attempt: string;
  price: number;
  variant_image: string;
  delivery_mode: string;
  availability: boolean;
  validity: string;
  product_id: string;
}

export interface CartItemProps {
  id: string;
  user_id: string;
  variant_id: string;
  added_at: string;
  quantity: number;
}


export default function Cart() {
  // const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);

  // const product = location.state?.product;
  // const variant: Variant | null = location.state?.variant || null;

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState<number>(0);
  // const cartTotal = variant ? variant.price : 0;

  const user = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponResult({
        valid: false,
        message: "Please enter a coupon code",
        discount: 0,
        finalTotal: cartTotal
      });
      return;
    }

    setIsApplying(true);
    try {
      const result = await validateCoupon(couponCode, cartTotal);
      setCouponResult(result);
      if (result.valid) {
        setAppliedCoupon(couponCode);
      }
    } catch (error) {
      setCouponResult({
        valid: false,
        message: "Error validating coupon. Please try again.",
        discount: 0,
        finalTotal: cartTotal
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
    setAppliedCoupon(null);
  };

  const displayTotal = couponResult?.valid ? couponResult.finalTotal : cartTotal;
  const discount = couponResult?.valid ? couponResult.discount : 0;
  async function fetchCartItems() {
    if (!userId) return;
    const res = await axiosInstance.get(`http://localhost:8080/api/cart?userId=${userId}`);
    const data = res.data;

    setCartItems(data);

  }
  useEffect(() => {
    fetchCartItems();
  }, [userId])

  useEffect(() => {
    // Calculate cart total
    const calcTotal = async () => {
      let total = 0;
      for (const item of cartItems) {
        try {
          const variantRes = await axiosInstance.get(`http://localhost:8080/api/variant?id=${item.variant_id}`);
          const variantData = variantRes.data;
          total += variantData.price * item.quantity;
        } catch (error) {
          console.error("Error fetching variant for cart total calculation:", error);
        }
      }
      setCartTotal(total);
    };
    calcTotal();
  }, [cartItems]);

  return (
    <div className="max-w-4xl mx-auto pt-28 px-6 pb-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item}/>
          ))}

          {/* Coupon Section */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Apply Coupon</h3>

            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isApplying}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplying}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isApplying ? "Applying..." : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-green-800">Coupon "{appliedCoupon}" applied</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Coupon Status Message */}
            {couponResult && !appliedCoupon && (
              <div className={`mt-3 p-3 rounded-lg ${couponResult.valid
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
                }`}>
                <div className="flex items-center gap-2">
                  {couponResult.valid ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{couponResult.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Details</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>₹{displayTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {discount > 0 && (
              <div className="mt-3 text-sm text-green-600 font-medium">
                You saved ₹{discount.toFixed(2)} with this coupon! 🎉
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        {cartItems.length > 0 && (
          <button
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
