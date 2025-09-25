// ProductCard.tsx
import { useNavigate } from "react-router-dom";
interface Faculty{
  id: string;
  name:string;
  description:string;
  email:string;
  institute_name:string;
  profile_image:string;
}

interface Variant{
    id:string;
    attempt:string;
    price:number;
    variant_image:string;
    delivery_mode:string;
    availability:boolean;
    validity:string;
    product_id:string;
}
interface Review{
    rating:number,
    comment:string,
    reviewer:string
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
  reviews: Review[];
}

export default function ProductCard(product: JoinedProduct) {
  const navigate = useNavigate();
  const minPrice =
  product.variants.length > 0
    ? Math.min(...product.variants.map(v => v.price))
    : 0; 

  return (
    <div
      className="max-w-xs w-full bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative w-full aspect-[4/3]">
        <img
          src={product.product_image}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${product.product_type === "Fast Track" ? "bg-gray-900 text-white" : "bg-white text-green-700"} `}>
            {product.product_type}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.course_name}</p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {product.total_reviews > 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>
                {product.rating.toFixed(1)} ({product.total_reviews} review{product.total_reviews !== 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">★</span>
              <span className="text-gray-400">No reviews yet</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.75 1.1 2.97 2.76 2.97 4.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>{product.faculties.length} Faculty</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
            <span>{product.subjects.length} Subjects</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              ₹{minPrice}
            </span>
            <span className="text-xs text-gray-400">
              Starting from
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

