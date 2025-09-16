// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 cursor-pointer">
          EduHub
        </Link>

        {/* Menu Items */}
        <div className="flex space-x-8 text-gray-700 font-medium">
          <Link to="/courses" className="cursor-pointer hover:text-indigo-600 transition">
            Courses
          </Link>
          <Link to="/faculty" className="cursor-pointer hover:text-indigo-600 transition">
            Faculty
          </Link>
          <Link to="/signin" className="cursor-pointer hover:text-indigo-600 transition">
            Sign In
          </Link>
          <Link to="/signup" className="cursor-pointer hover:text-indigo-600 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}