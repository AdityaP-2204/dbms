// CartItem.tsx
import type { Variant, JoinedProduct } from '../types/index';

interface CartItemProps {
  product: JoinedProduct;
  variant: Variant;
}

export default function CartItem({ product, variant }: CartItemProps) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={product.product_image}
          alt={product.title}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-600">{product.course_name}</p>
          <p className="text-sm text-gray-500 mt-1">{variant.delivery_mode}</p>
          <p className="text-sm text-gray-500">{variant.attempt}</p>
          <p className="text-sm text-gray-500">Validity: {variant.validity}</p>
        </div>
      </div>
      <span className="font-bold text-lg text-indigo-600">₹{variant.price}</span>
    </div>
  );
}
