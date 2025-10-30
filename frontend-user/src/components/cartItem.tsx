import { useEffect, useState } from 'react';
import type { Variant, JoinedProduct } from '../types/index';
import type { CartItemProps } from './cart';
import axiosInstance from '../api/axiosConfig';
import { Trash2 } from 'lucide-react'; // Optional icon

export default function CartItem({ id, user_id, variant_id, added_at, quantity }: CartItemProps) {
  const [product, setProduct] = useState<JoinedProduct | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState<number>(quantity);

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
    if (newQty < 1){
      deleteCartItem();
      return;
    }  // prevent 0 or negative
    try {
      await axiosInstance.put(`http://localhost:8080/api/cart?id=${id}&quantity=${newQty - qty}`);
      setQty(newQty);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Delete cart item
  const deleteCartItem = async () => {
    try {
      await axiosInstance.delete(`http://localhost:8080/api/cart?id=${id}`);
      setProduct(null);
      setVariant(null);
      alert("Item removed from cart");
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  if (!product || !variant) return null;

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-white shadow-sm">
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

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => updateQuantity(qty - 1)}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              –
            </button>
            <span className="px-3">{qty}</span>
            <button
              onClick={() => updateQuantity(qty + 1)}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Price & Delete */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-bold text-lg text-indigo-600">₹{variant.price}</span>
        <button
          onClick={deleteCartItem}
          className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
        >
          <Trash2 size={18} /> <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
