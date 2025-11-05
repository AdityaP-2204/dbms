// src/components/ProductListing.tsx
import ProductCard from "./product-card";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
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

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    course: "",
    productType: "",
    subject: "",
    faculty: "",
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

  // Get unique values for filters
  const uniqueCourses = Array.from(new Set(joinedProducts.map(p => p.course_name))).sort();
  const uniqueProductTypes = Array.from(new Set(joinedProducts.map(p => p.product_type))).sort();
  
  // Dynamic subjects and faculties based on selected filters
  const getFilteredProducts = () => {
    return joinedProducts.filter((product) => {
      const matchesCourse = filters.course === "" || product.course_name === filters.course;
      const matchesProductType = filters.productType === "" || product.product_type === filters.productType;
      return matchesCourse && matchesProductType;
    });
  };

  const filteredForDropdowns = getFilteredProducts();
  
  const uniqueSubjects = Array.from(
    new Set(filteredForDropdowns.flatMap(p => p.subjects))
  ).sort();
  
  const uniqueFaculties = Array.from(
    new Set(filteredForDropdowns.flatMap(p => p.faculties.map(f => f.name)))
  ).sort();

  // Filter products based on search and filters
  const filteredProducts = joinedProducts.filter((product) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.course_name.toLowerCase().includes(searchQuery.toLowerCase());

    // Course filter
    const matchesCourse = filters.course === "" || product.course_name === filters.course;

    // Product type filter
    const matchesProductType = filters.productType === "" || product.product_type === filters.productType;

    // Subject filter
    const matchesSubject = filters.subject === "" || product.subjects.includes(filters.subject);

    // Faculty filter
    const matchesFaculty = filters.faculty === "" || 
      product.faculties.some(f => f.name === filters.faculty);

    return matchesSearch && matchesCourse && matchesProductType && matchesSubject && matchesFaculty;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      course: "",
      productType: "",
      subject: "",
      faculty: "",
    });
    setSearchQuery("");
  };

  // Handle course filter change - reset dependent filters
  const handleCourseChange = (course: string) => {
    setFilters({
      ...filters,
      course,
      subject: "", // Reset subject when course changes
      faculty: "", // Reset faculty when course changes
    });
  };

  // Handle product type filter change - reset dependent filters
  const handleProductTypeChange = (productType: string) => {
    setFilters({
      ...filters,
      productType,
      subject: "", // Reset subject when product type changes
      faculty: "", // Reset faculty when product type changes
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== "" || 
    filters.course !== "" || 
    filters.productType !== "" || 
    filters.subject !== "" || 
    filters.faculty !== "";

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
      <div className="pt-20 max-w-7xl mx-auto px-2 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-2 py-10">
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

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Ultra Professional Compact Search Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white placeholder-gray-400"
            />
            {searchQuery && (
              <>
                <span className="absolute right-12 text-xs text-gray-500 font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150 rounded hover:bg-gray-100"
                  title="Clear"
                >
                  <FaTimes className="text-xs" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              showFilters
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-semibold"
            >
              <FaTimes />
              Clear Filters
            </button>
          )}

          {hasActiveFilters && (
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {joinedProducts.length} courses
            </span>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course
                <span className="ml-2 text-xs text-blue-600">
                  ({uniqueCourses.length} available)
                </span>
              </label>
              <select
                value={filters.course}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Type
                <span className="ml-2 text-xs text-blue-600">
                  ({uniqueProductTypes.length} available)
                </span>
              </label>
              <select
                value={filters.productType}
                onChange={(e) => handleProductTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Types</option>
                {uniqueProductTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
                <span className={`ml-2 text-xs ${uniqueSubjects.length === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  ({uniqueSubjects.length} available)
                </span>
              </label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                disabled={uniqueSubjects.length === 0}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  uniqueSubjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {uniqueSubjects.length === 0 ? 'No subjects available' : 'All Subjects'}
                </option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Faculty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faculty
                <span className={`ml-2 text-xs ${uniqueFaculties.length === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  ({uniqueFaculties.length} available)
                </span>
              </label>
              <select
                value={filters.faculty}
                onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
                disabled={uniqueFaculties.length === 0}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  uniqueFaculties.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {uniqueFaculties.length === 0 ? 'No faculty available' : 'All Faculty'}
                </option>
                {uniqueFaculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <FaSearch className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : "No courses available at the moment."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
