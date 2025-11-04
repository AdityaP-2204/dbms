// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import {
  FaTicketAlt,
  FaReceipt,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const user = useAuth();

  useEffect(() => {
    setRole(user?.role || null);
    setUserId(user?.id || null);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await axiosInstance.post("http://localhost:8080/api/auth/logout");
      // Force page reload to update auth state
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Still reload even if logout fails
      window.location.href = "/";
    }
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

        <div className="flex items-center space-x-6 text-gray-700 font-medium">
          {/* ✅ Show admin-only links */}
          {role === "admin" && userId && (
            <>
              <Link
                to="/coupons"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Manage Coupons"
              >
                <FaTicketAlt className="text-xl" />
              </Link>
              <Link
                to="/admin/transactions"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Transactions"
              >
                <FaReceipt className="text-xl" />
              </Link>
            </>
          )}

          {/* ✅ Show user-only links */}
          {role !== "admin" && userId && (
            <>
              <Link
                to="/wishlist"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Wishlist"
              >
                <FaHeart className="text-xl" />
              </Link>
              <Link
                to="/cart"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Cart"
              >
                <FaShoppingCart className="text-xl" />
              </Link>
            </>
          )}

          {/* ✅ Auth-related links */}
          {userId ? (
            <>
              <Link
                to="/profile"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Profile"
              >
                <FaUser className="text-xl" />
              </Link>
              <button
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                onClick={() => handleSignOut()}
                title="Sign Out"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Sign In"
              >
                <FaSignInAlt className="text-xl" />
              </Link>
              <Link
                to="/signup"
                className="cursor-pointer hover:text-indigo-600 transition flex items-center gap-2"
                title="Sign Up"
              >
                <FaUserPlus className="text-xl" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
