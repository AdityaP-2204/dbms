// WishlistItem.tsx

import { useEffect, useState } from 'react';
import type { JoinedProduct, Variant } from '../types/index';
import type { WishlistItemProps } from './wishlist';
import axiosInstance from '../api/axiosConfig';
import deleteIcon from "../assets/delete.png";



// export interface WishlistItemProps {
//   id: string;
//   product: JoinedProduct;
//   variant: Variant;
// }

export default function WishlistItem({ id, user_id, variant_id, added_at }: WishlistItemProps) {
  const [product, setProduct] = useState<JoinedProduct | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);

  const handleRemoveFromWishlist = async () => {
    if (!id) return;
    try {
      await axiosInstance.delete(`http://localhost:8080/api/wishlist?id=${id}`);
      // Optionally, you can also update the UI state to remove the item from the wishlist
      setProduct(null);
      setVariant(null);
      alert("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
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
    <div className="flex items-start justify-between p-4 border rounded-lg bg-white shadow-sm m-2 relative">
      <div className="flex items-center gap-4">
        <img
          src={product.product_image}
          alt={product.product_title}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{product.product_title}</h3>
          <p className="text-sm text-gray-600">{product.course_name}</p>
          <p className="text-sm text-gray-500 mt-1">{variant.delivery_mode}</p>
          <p className="text-sm text-gray-500">{variant.attempt}</p>
          <p className="text-sm text-gray-500">Validity: {variant.validity}</p>
        </div>
      </div>
      <span className="font-bold text-lg text-indigo-600">₹{variant.price}</span>
      <div className="absolute bottom-0 right-2">
        <button className='cursor-pointer' onClick={() => handleRemoveFromWishlist()}>
          <img src={deleteIcon} className='w-8 h-8' alt="trash" />
        </button>
      </div>
    </div>
  );
}
