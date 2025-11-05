import { useEffect, useState } from 'react';
import type { Variant, JoinedProduct } from '../types/index';
import type { CartItemProps } from './cart';
import axiosInstance from '../api/axiosConfig';
import { FaTrash, FaMinus, FaPlus, FaClock, FaTruck, FaBook } from 'react-icons/fa';
import Toast from './Toast';

export default function CartItem({ item: {
  id,
  variant_id,
  quantity
}, setCartItems
}: {
  item: CartItemProps,
  setCartItems?: React.Dispatch<React.SetStateAction<CartItemProps[]>>
}) {
  const [product, setProduct] = useState<JoinedProduct | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState<number>(quantity);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch variant & product details
  useEffect(() => {
    const fetchCartItemDetails = async () => {
      if (!variant_id) return;
      try {
        const variantRes = await axiosInstance.get(`http://localhost:8080/api/variant?id=${variant_id}`);
        const variantData = variantRes.data;
        setVariant(variantData);

        const productRes = await axiosInstance.get(`http://localhost:8080/api/product?id=${variantData.product_id}`);
        setProduct(productRes.data);
      } catch (error) {
        console.error("Error fetching cart item details:", error);
      }
    };
    fetchCartItemDetails();
  }, [variant_id]);

  // Update cart quantity
  const updateQuantity = async (newQty: number) => {
    if (newQty < 1) {
      deleteCartItem();
      return;
    }  // prevent 0 or negative
    try {
      await axiosInstance.put(`http://localhost:8080/api/cart?id=${id}&quantity=${newQty - qty}`);
      setQty(newQty);
      if(setCartItems) {
        setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity: newQty } : item));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Delete cart item
  const deleteCartItem = async () => {
    try {
      await axiosInstance.delete(`http://localhost:8080/api/cart?id=${id}`);
      if (setCartItems) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      }
      setToastMessage("Item removed from cart");
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  if (!product || !variant) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={variant.variant_image}
                alt={product.product_title}
                className="w-full md:w-40 h-40 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {variant.delivery_mode}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                  {product.product_title}
                </h3>
                <p className="text-sm text-blue-600 font-medium flex items-center gap-2 mb-2">
                  <FaBook className="text-xs" />
                  {product.course_name}
                </p>
              </div>
              
              {/* Delete Button - Top Right */}
              <button
                onClick={deleteCartItem}
                className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                title="Remove from cart"
              >
                <FaTrash size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Variant Details */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <FaTruck className="text-blue-600" />
                <span className="font-medium">{variant.attempt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <FaClock className="text-green-600" />
                <span className="font-medium">Valid: {variant.validity}</span>
              </div>
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(qty - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white text-gray-700 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={qty <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                  <button
                    onClick={() => updateQuantity(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white text-gray-700 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-sm text-gray-500 mb-1">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{(variant.price * qty).toFixed(2)}
                  </span>
                  {qty > 1 && (
                    <span className="text-sm text-gray-500">
                      (₹{variant.price} × {qty})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {variant.availability ? (
              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                In Stock
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-600 font-semibold">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Out of Stock
              </span>
            )}
          </span>
          <span className="text-gray-500">
            Item Total: <span className="font-bold text-gray-900">₹{(variant.price * qty).toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
