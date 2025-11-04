// Wishlist.tsx
import WishlistItem from "./wishlistItem";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import { FaHeart } from "react-icons/fa";

export interface WishlistItemProps {
  id: string;
  user_id: string;
  variant_id: string;
  added_at: string;
  onRemove?: (id: string) => void;
}

export default function Wishlist() {

  const [wishlistItems, setWishlistItems] = useState<WishlistItemProps[]>([]);

  const user = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`http://localhost:8080/api/wishlist?userId=${userId}`);
        console.log("Wishlist data:", response.data);
        setWishlistItems(response.data);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaHeart className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Wishlist
              </h1>
              <p className="text-pink-100 mt-1">
                Save your favorite courses for later
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center gap-3">
                <FaHeart className="text-white text-xl" />
                <div>
                  <p className="text-white text-2xl font-bold">{wishlistItems.length}</p>
                  <p className="text-pink-100 text-sm">Saved Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-pink-500 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-6">Start adding courses you love to your wishlist!</p>
            <button
              onClick={() => window.location.href = "/products"}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <WishlistItem 
                key={item.id} 
                id={item.id} 
                user_id={item.user_id} 
                variant_id={item.variant_id} 
                added_at={item.added_at}
                onRemove={(id) => setWishlistItems(prev => prev.filter(i => i.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
