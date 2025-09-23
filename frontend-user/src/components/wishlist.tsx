// Cart.tsx
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "./cartItem";
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

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const variant: Variant | null = location.state?.variant || null;

  return (
    <div className="max-w-4xl mx-auto pt-28 px-6 pb-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Wishlist</h2>

      {!variant || !product ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <CartItem product={product} variant={variant} />
      )}

      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
