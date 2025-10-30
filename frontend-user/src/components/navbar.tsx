// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const user = useAuth();

  useEffect(() => {
    setRole(user?.role || null);
    setUserId(user?.id || null);
  }, [user]);

  const handleSignOut = async () => {
    await axiosInstance.post("http://localhost:8080/api/auth/logout");
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
        >
          EduHub
        </Link>

        <div className="flex space-x-8 text-gray-700 font-medium">
          <Link
            to="/courses"
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Courses
          </Link>
          <Link
            to="/subjects"
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Subjects
          </Link>
          <Link
            to="/faculty"
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Faculty
          </Link>
          <Link
            to="/faq"
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            FAQs
          </Link>
          <Link
            to="/community"
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Community Channel
          </Link>

          {/* ✅ Show admin-only links */}
          {role === "admin" && userId && (
            <>
              <Link
                to="/coupons"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Manage Coupons
              </Link>
              <Link
                to="/admin/transactions"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Transactions
              </Link>
            </>
          )}

          {/* ✅ Show user-only links */}
          {role !== "admin" && userId && (
            <>
              <Link
                to="/wishlist"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Cart
              </Link>
            </>
          )}

          {/* ✅ Auth-related links */}
          {userId ? (
            <>
              <Link
                to="/profile"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Profile
              </Link>
              <button
                className="cursor-pointer hover:text-indigo-600 transition"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
