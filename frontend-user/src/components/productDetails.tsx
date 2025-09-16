// ProductDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinedProducts } from "../lib/data-join";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = joinedProducts.find((p) => p.id === Number(id));

  // State to manage the selected variant
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants[0] || null
  );

  if (!product)
    return <div className="p-10 text-center text-lg">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto pt-28 px-6 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        &larr; Back to Courses
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-white rounded-xl shadow-xl p-8">
        {/* Image Section - Adjusted for better alignment */}
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={product.product_image}
            alt={product.title}
            className="w-full rounded-lg shadow-lg aspect-[4/3] object-cover"
          />
        </div>

        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h2>
            <span
              className={`inline-block px-4 py-1 text-sm font-bold rounded-full ${
                product.product_type === "Fast Track"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.product_type}
            </span>
            {product.isCombo && (
              <span className="inline-block px-4 py-1 text-sm font-bold bg-yellow-100 text-yellow-700 rounded-full">
                Combo
              </span>
            )}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>
          <p className="text-gray-500 font-medium">
            Course:{" "}
            <span className="text-indigo-600 font-bold">
              {product.course_name}
            </span>
          </p>

          {/* Variants Section */}
          {product.variants.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-bold text-xl text-gray-800 mb-4">
                Choose a Mode
              </h3>
              <div className="flex flex-col gap-4">
                {product.variants.map((variant) => (
                  <label
                    key={variant.mode}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedVariant?.mode === variant.mode
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="product-mode"
                        value={variant.mode}
                        checked={selectedVariant?.mode === variant.mode}
                        onChange={() => setSelectedVariant(variant)}
                        className="form-radio text-indigo-600 h-5 w-5"
                      />
                      <div>
                        <span className="font-semibold text-gray-800">
                          {variant.mode}
                        </span>
                        <p className="text-sm text-gray-500">
                          {variant.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-indigo-600">
                      ₹{variant.price}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button className="flex-1 py-3 text-lg font-bold text-indigo-600 border border-indigo-600 rounded-lg shadow hover:bg-indigo-50 transition-colors transform hover:scale-105">
                  Add to Wishlist
                </button>
                <button className="flex-1 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition-colors transform hover:scale-105">
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Subjects and Faculties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {product.subjects.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">
                  Subjects
                </h4>
                <ul className="list-inside text-gray-600 space-y-1">
                  {product.subjects.map((s, idx) => (
                    <li key={idx}>
                      <span className="text-sm">• {s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.faculties.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">
                  Faculty
                </h4>
                <ul className="list-inside text-gray-600 space-y-1">
                  {product.faculties.map((f, idx) => (
                    <li key={idx}>
                      <span className="text-sm">
                        • {f.name} -{" "}
                        <span className="text-gray-500 text-xs">
                          {f.designation}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          {product.reviews.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold text-gray-800 text-xl mb-4">Reviews</h4>
              <ul className="space-y-4">
                {product.reviews.map((r, idx) => (
                  <li key={idx} className="border p-5 rounded-lg bg-gray-50">
                    <p className="font-semibold text-lg text-gray-800">
                      {r.reviewer}
                      <span className="text-sm font-normal text-yellow-500 ml-2">
                        {Array(r.rating).fill("★")}
                      </span>
                    </p>
                    <p className="text-gray-600 italic mt-1">"{r.comment}"</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}