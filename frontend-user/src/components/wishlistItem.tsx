// WishlistItem.tsx

import { useEffect, useState } from 'react';
import type { WishlistItemProps } from './wishlist';
import axiosInstance from '../api/axiosConfig';
import Toast from './Toast';
import { FaShoppingCart, FaTrash, FaClock, FaTruck, FaBook, FaTag } from 'react-icons/fa';

export default function WishlistItem({ id, user_id, variant_id, onRemove }: WishlistItemProps) {
  const [product, setProduct] = useState<any>(null);
  const [variant, setVariant] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRemoveFromWishlist = async () => {
    if (!id) return;
    try {
      await axiosInstance.delete(`http://localhost:8080/api/wishlist?id=${id}`);
      setToastMessage("Item removed from wishlist");
      if (onRemove) {
        setTimeout(() => onRemove(id), 300); // Wait a bit before removing from UI
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleMoveToCart = async () => {
    if (!user_id || !variant_id) return;
    try {
      // Add to cart
      await axiosInstance.post(`http://localhost:8080/api/cart`, {
        user_id: user_id,
        variant_id: variant_id
      });
      
      // Remove from wishlist
      await axiosInstance.delete(`http://localhost:8080/api/wishlist?id=${id}`);
      
      setToastMessage("Moved to Cart!");
      if (onRemove) {
        setTimeout(() => onRemove(id), 300);
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
      setToastMessage("Failed to move to cart");
    }
  };

  useEffect(() => {
    const fetchWishlistItemDetails = async () => {
      if (!variant_id) return;
      try {
        const response = await axiosInstance.get(`http://localhost:8080/api/variant?id=${variant_id}`);
        const data = response.data;
        setVariant(data);

        const res1 = await axiosInstance.get(`http://localhost:8080/api/product?id=${data.product_id}`);
        setProduct(res1.data);
      } catch (error) {
        console.error("Error fetching wishlist item details:", error);
      }
    };

    fetchWishlistItemDetails();
  }, [variant_id]);

  if ((!product) || (!variant)) {
    return <></>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={product.product_image}
                alt={product.product_title}
                className="w-full md:w-40 h-40 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {variant.delivery_mode}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-purple-600 transition-colors cursor-pointer">
                  {product.product_title}
                </h3>
                <p className="text-sm text-purple-600 font-medium flex items-center gap-2 mb-2">
                  <FaBook className="text-xs" />
                  {product.course_name}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{variant.price}
                </p>
              </div>
            </div>

            {/* Variant Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTag className="text-pink-500" />
                <span>{variant.attempt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-purple-500" />
                <span>Valid: {variant.validity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTruck className="text-blue-500" />
                <span>{variant.delivery_mode}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleMoveToCart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <FaShoppingCart />
                Move to Cart
              </button>
              <button
                onClick={handleRemoveFromWishlist}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300"
              >
                <FaTrash />
                Remove
              </button>
            </div>
          </div>
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
