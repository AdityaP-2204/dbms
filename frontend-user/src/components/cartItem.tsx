// CartItem.tsx
interface Faculty {
  id: string;
  name: string;
  description: string;
  email: string;
  institute_name: string;
  profile_image: string;
}

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

interface JoinedProduct {
  id: number;
  title: string;
  description: string;
  course_name: string;
  course_description: string;
  product_type: string;
  product_image: string;
  is_combo: boolean;
  rating: number;
  total_reviews: number;
  variants: Variant[];
  subjects: string[];
  faculties: Faculty[];
  reviews: any[];
}

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
