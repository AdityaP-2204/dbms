import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import { PlusCircle } from "lucide-react";
import {
  FaTag,
  FaPercent,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTicketAlt,
  FaTrash,
} from "react-icons/fa";

interface Coupon {
  coupon_id?: number;
  discount_percentage: number;
  max_discount: number;
  coupon_code: string;
  start_date: string;
  end_date: string;
  limit_count: number;
  min_value: number;
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({
    discount_percentage: "",
    max_discount: "",
    min_value: "",
    date_range: "",
    coupon_code: "",
  });

  // Form fields for adding new coupon
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    discount_percentage: 0,
    max_discount: 0,
    coupon_code: "",
    start_date: "",
    end_date: "",
    limit_count: 0,
    min_value: 0,
  });

  const user = useAuth();
  const role = user?.role;

  // Fetch coupon list
  useEffect(() => {
    async function getCoupons() {
      try {
        setLoading(true);
        const response = await axiosInstance.get("http://localhost:8080/api/v1/coupon");
        setCoupons(response.data);
      } catch (err) {
        console.error("Error fetching coupons:", err);
        setError("Failed to load coupons. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getCoupons();
  }, []);

  // Validation functions
  const validateDiscountPercentage = (value: number) => {
    if (value < 0 || value > 100) {
      setFormErrors(prev => ({ ...prev, discount_percentage: "Discount must be between 0 and 100" }));
      return false;
    }
    setFormErrors(prev => ({ ...prev, discount_percentage: "" }));
    return true;
  };

  const validateMaxDiscount = (value: number) => {
    if (value < 0) {
      setFormErrors(prev => ({ ...prev, max_discount: "Max discount cannot be negative" }));
      return false;
    }
    setFormErrors(prev => ({ ...prev, max_discount: "" }));
    return true;
  };

  const validateMinValue = (value: number) => {
    if (value < 0) {
      setFormErrors(prev => ({ ...prev, min_value: "Minimum value cannot be negative" }));
      return false;
    }
    setFormErrors(prev => ({ ...prev, min_value: "" }));
    return true;
  };

  const validateDateRange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        setFormErrors(prev => ({ ...prev, date_range: "End date must be after start date" }));
        return false;
      }
    }
    setFormErrors(prev => ({ ...prev, date_range: "" }));
    return true;
  };

  const validateCouponCode = (code: string) => {
    if (code.length < 3) {
      setFormErrors(prev => ({ ...prev, coupon_code: "Coupon code must be at least 3 characters" }));
      return false;
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      setFormErrors(prev => ({ ...prev, coupon_code: "Coupon code must contain only uppercase letters and numbers" }));
      return false;
    }
    
    // Check for duplicate coupon code
    const isDuplicate = coupons.some(
      coupon => coupon.coupon_code.toUpperCase() === code.toUpperCase()
    );
    if (isDuplicate) {
      setFormErrors(prev => ({ ...prev, coupon_code: "This coupon code already exists" }));
      return false;
    }
    
    setFormErrors(prev => ({ ...prev, coupon_code: "" }));
    return true;
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const isDiscountValid = validateDiscountPercentage(newCoupon.discount_percentage);
    const isMaxDiscountValid = validateMaxDiscount(newCoupon.max_discount);
    const isMinValueValid = validateMinValue(newCoupon.min_value);
    const isDateRangeValid = validateDateRange(newCoupon.start_date, newCoupon.end_date);
    const isCouponCodeValid = validateCouponCode(newCoupon.coupon_code);

    if (!isDiscountValid || !isMaxDiscountValid || !isMinValueValid || !isDateRangeValid || !isCouponCodeValid) {
      alert("Please fix all validation errors before submitting");
      return;
    }

    try {
      // Convert dates to ISO format for backend
      const couponData = {
        ...newCoupon,
        start_date: new Date(newCoupon.start_date).toISOString(),
        end_date: new Date(newCoupon.end_date).toISOString(),
      };

      await axiosInstance.post(
        "http://localhost:8080/api/v1/coupon",
        couponData
      );
      
      // Refresh the coupon list
      const refreshResponse = await axiosInstance.get("http://localhost:8080/api/v1/coupon");
      setCoupons(refreshResponse.data);
      
      setShowForm(false);
      setNewCoupon({
        discount_percentage: 0,
        max_discount: 0,
        coupon_code: "",
        start_date: "",
        end_date: "",
        limit_count: 0,
        min_value: 0,
      });
      setFormErrors({
        discount_percentage: "",
        max_discount: "",
        min_value: "",
        date_range: "",
        coupon_code: "",
      });
      alert("✅ Coupon added successfully!");
    } catch (err: any) {
      console.error("Error adding coupon:", err);
      // Check if backend also returned duplicate error
      if (err.response?.status === 409 || err.response?.data?.message?.includes("duplicate") || err.response?.data?.message?.includes("already exists")) {
        setFormErrors(prev => ({ ...prev, coupon_code: "This coupon code already exists in the database" }));
        alert("Failed to add coupon: Coupon code already exists!");
      } else {
        alert("Failed to add coupon. Please try again. " + (err.response?.data?.message || ""));
      }
    }
  };

  const handleDeleteCoupon = async (couponId: number) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      await axiosInstance.delete(`http://localhost:8080/api/v1/coupon?id=${couponId}`);
      setCoupons(coupons.filter((c) => c.coupon_id !== couponId));
      alert("Coupon deleted successfully!");
    } catch (err) {
      console.error("Error deleting coupon:", err);
      alert("Failed to delete coupon. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isCouponActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10 text-center text-gray-500">
        Loading coupons...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Show access denied for non-admin users
  if (role !== "admin") {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You must be an admin to access this page.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaTicketAlt className="text-indigo-600" />
            Coupon Management
          </h2>
          <p className="text-gray-600 mt-2">Manage discount coupons for your store</p>
        </div>

        {/* Show Add Coupon button only if admin */}
        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Cancel" : "Add Coupon"}
          </button>
        )}
      </div>

      {/* Add Coupon Form (visible to admin only when toggled) */}
      {role === "admin" && showForm && (
        <form
          onSubmit={handleAddCoupon}
          className="mb-10 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Add New Coupon
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                placeholder="e.g., SUMMER2024"
                value={newCoupon.coupon_code}
                onChange={(e) => {
                  const upperCode = e.target.value.toUpperCase();
                  setNewCoupon({ ...newCoupon, coupon_code: upperCode });
                  validateCouponCode(upperCode);
                }}
                required
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.coupon_code ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.coupon_code && (
                <p className="text-red-500 text-xs mt-1">{formErrors.coupon_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%) *
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={newCoupon.discount_percentage || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewCoupon({
                    ...newCoupon,
                    discount_percentage: value,
                  });
                  validateDiscountPercentage(value);
                }}
                required
                min="0"
                max="100"
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.discount_percentage ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.discount_percentage && (
                <p className="text-red-500 text-xs mt-1">{formErrors.discount_percentage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={newCoupon.max_discount || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewCoupon({
                    ...newCoupon,
                    max_discount: value,
                  });
                  validateMaxDiscount(value);
                }}
                required
                min="0"
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.max_discount ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.max_discount && (
                <p className="text-red-500 text-xs mt-1">{formErrors.max_discount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Cart Value (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={newCoupon.min_value || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewCoupon({
                    ...newCoupon,
                    min_value: value,
                  });
                  validateMinValue(value);
                }}
                required
                min="0"
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.min_value ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.min_value && (
                <p className="text-red-500 text-xs mt-1">{formErrors.min_value}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit *
              </label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={newCoupon.limit_count || ""}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    limit_count: parseInt(e.target.value) || 0,
                  })
                }
                required
                min="1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={newCoupon.start_date}
                onChange={(e) => {
                  setNewCoupon({ ...newCoupon, start_date: e.target.value });
                  validateDateRange(e.target.value, newCoupon.end_date);
                }}
                required
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.date_range ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={newCoupon.end_date}
                onChange={(e) => {
                  setNewCoupon({ ...newCoupon, end_date: e.target.value });
                  validateDateRange(newCoupon.start_date, e.target.value);
                }}
                required
                className={`border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none ${
                  formErrors.date_range ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {formErrors.date_range && (
            <p className="text-red-500 text-xs mt-1">{formErrors.date_range}</p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all"
          >
            Add Coupon
          </button>
        </form>
      )}

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaTicketAlt className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Coupons Yet</h3>
          <p className="text-gray-500">Add your first coupon to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <article
              key={coupon.coupon_id}
              className={`group relative bg-white border rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
                isCouponActive(coupon.start_date, coupon.end_date)
                  ? "border-green-200 hover:border-green-400"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Active Badge */}
              {isCouponActive(coupon.start_date, coupon.end_date) ? (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  ACTIVE
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  INACTIVE
                </div>
              )}

              {/* Coupon Code */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="text-indigo-600" size={20} />
                  <h3 className="text-2xl font-bold text-gray-900 font-mono">
                    {coupon.coupon_code}
                  </h3>
                </div>
              </div>

              {/* Discount Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaPercent className="text-gray-400" size={16} />
                  <span className="text-sm">
                    <span className="font-semibold">{coupon.discount_percentage}%</span> off
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaMoneyBillWave className="text-gray-400" size={16} />
                  <span className="text-sm">
                    Max: <span className="font-semibold">₹{coupon.max_discount}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaMoneyBillWave className="text-gray-400" size={16} />
                  <span className="text-sm">
                    Min Cart: <span className="font-semibold">₹{coupon.min_value}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaTicketAlt className="text-gray-400" size={16} />
                  <span className="text-sm">
                    Uses Left: <span className="font-semibold">{coupon.limit_count}</span>
                  </span>
                </div>
              </div>

              {/* Date Range */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Valid from:</span>
                  <span className="font-medium">{formatDate(coupon.start_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Valid until:</span>
                  <span className="font-medium">{formatDate(coupon.end_date)}</span>
                </div>
              </div>

              {/* Admin Actions */}
              {role === "admin" && (
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button
                    onClick={() => handleDeleteCoupon(coupon.coupon_id!)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <FaTrash size={14} />
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
