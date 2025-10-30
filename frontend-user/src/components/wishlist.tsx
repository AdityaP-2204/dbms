// Wishlist.tsx
import { useLocation, useNavigate } from "react-router-dom";
import WishlistItem from "./wishlistItem";
import { use, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

// interface Variant {
//   id: string;
//   attempt: string;
//   price: number;
//   variant_image: string;
//   delivery_mode: string;
//   availability: boolean;
//   validity: string;
//   product_id: string;
// }

export interface WishlistItemProps {
  id: string;
  user_id: string;
  variant_id: string;
  added_at: string;
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

  // const location = useLocation();
  // const navigate = useNavigate();

  // const product = location.state?.product;
  // const variant: Variant | null = location.state?.variant || null;

  return (
    <div className="max-w-4xl mx-auto pt-28 px-6 pb-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        wishlistItems.map((item) => (
          <WishlistItem key={item.id} id={item.id} user_id={item.user_id} variant_id={item.variant_id} added_at={item.added_at} />
        ))
      )}

      {/* <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div> */}
    </div>
  );
}
