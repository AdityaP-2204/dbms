// ProductListing.tsx
import ProductCard from "./product-card";
import { joinedProducts } from "../lib/data-join";

export default function ProductListing() {
  return (
    <div className=" pt-20 max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {joinedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
