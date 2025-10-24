// src/components/ProductListing.tsx
import ProductCard from "./product-card";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
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

interface Review {
  rating: number;
  comment: string;
  reviewer: string;
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

interface Course {
  id: string;
  course_name: string;
}

export default function ProductListing() {
  const [joinedProducts, setJoinedProducts] = useState<JoinedProduct[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState({
    product_title: "",
    product_description: "",
    product_type: "Regular",
    is_combo: false,
  });

  const user= useAuth();
  const role=user?.role;

  // Fetch all products and courses
  useEffect(() => {
    async function fetchData() {
      try {
        const [productResponse, courseResponse] = await Promise.all([
          axiosInstance.get("http://localhost:8080/api/joinedProduct"),
          axiosInstance.get("http://localhost:8080/api/course"),
        ]);

        const products = productResponse.data;
        const coursesData = courseResponse.data;
        setCourses(coursesData);

        const productsWithRatings = await Promise.all(
          products.map(async (product: JoinedProduct) => {
            try {
              const statsResponse = await axios.get(
                `http://localhost:8080/api/v1/review/stats?product_id=${product.id}`
              );
              return {
                ...product,
                rating: statsResponse.data.average_rating || 0,
                total_reviews: statsResponse.data.review_count || 0,
              };
            } catch {
              return { ...product, rating: 0, total_reviews: 0 };
            }
          })
        );
        setJoinedProducts(productsWithRatings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle product form submission
// Handle product form submission
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (!selectedCourses.length) {
      alert("Please select a course.");
      return;
    }

    // ✅ send a single UUID, not array
    const payload = {
      product_title: newProduct.product_title,
      product_description: newProduct.product_description,
      product_type: newProduct.product_type,
      is_combo: newProduct.is_combo,
      course_id: selectedCourses[0], // ✅ only one UUID string
    };

    console.log("Payload being sent:", payload);

    await axiosInstance.post("http://localhost:8080/api/product", payload, {
      headers: { "Content-Type": "application/json" },
    });

    alert("✅ Product added successfully!");

    // Reset form
    setShowForm(false);
    setNewProduct({
      product_title: "",
      product_description: "",
      product_type: "Regular",
      is_combo: false,
    });
    setSelectedCourses([]);

    // Refresh products
    const refreshed = await axiosInstance.get("http://localhost:8080/api/joinedProduct");
    setJoinedProducts(refreshed.data);
  } catch (err: any) {
    console.error("Error adding product:", err);
    alert("❌ Failed to add product. Check console for details.");
  }
};

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Products</h2>

        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="mb-10 p-6 bg-white rounded-lg shadow-md space-y-4"
        >
          {/* Product title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              placeholder="Enter product title"
              value={newProduct.product_title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_title: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Product description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              placeholder="Enter product description"
              value={newProduct.product_description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_description: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Course dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              value={selectedCourses[0] || ""}
              onChange={(e) => setSelectedCourses([e.target.value])}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Product type dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              value={newProduct.product_type}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_type: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="Regular">Regular</option>
              <option value="Fast Track">Fast Track</option>
            </select>
          </div>

          {/* Combo checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.is_combo}
              onChange={(e) =>
                setNewProduct({ ...newProduct, is_combo: e.target.checked })
              }
            />
            <label className="text-sm text-gray-700">Is Combo Product?</label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Product
          </button>
        </form>
      )}

      {/* Product list */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {joinedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
