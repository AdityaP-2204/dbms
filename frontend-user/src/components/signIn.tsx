import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    role: false,
  });

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Role validation
  const validateRole = (role: string) => {
    if (!role) {
      return "Please select a role";
    }
    return "";
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  // Handle email change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setErrors({ ...errors, email: validateEmail(value) });
    }
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setRole(value);
    setErrors({ ...errors, role: validateRole(value) });
    setTouched({ ...touched, role: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const roleError = validateRole(role);

    setErrors({
      email: emailError,
      password: passwordError,
      role: roleError,
    });

    setTouched({
      email: true,
      password: true,
      role: true,
    });

    // If any errors, don't submit
    if (emailError || passwordError || roleError) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
          role,
        }
      );
      console.log(response.data);
      // Force page reload to update auth state
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing in:", error);
      setErrors({
        ...errors,
        email: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !errors.email && !errors.password && !errors.role && email && password && role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FaUserShield className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={`${
                    touched.email && !errors.email ? "text-green-500" : "text-gray-400"
                  }`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.email && errors.email
                      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : touched.email && !errors.email
                      ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
                {touched.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.email ? (
                      <FaTimesCircle className="text-red-500" />
                    ) : (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaTimesCircle className="text-xs" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={`${
                    touched.password && !errors.password ? "text-green-500" : "text-gray-400"
                  }`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.password && errors.password
                      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : touched.password && !errors.password
                      ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaTimesCircle className="text-xs" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    role === "user"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <FaUser className={role === "user" ? "text-blue-600" : "text-gray-400"} size={20} />
                  <span className={`font-semibold ${role === "user" ? "text-blue-600" : "text-gray-700"}`}>
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    role === "admin"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <FaUserShield className={role === "admin" ? "text-purple-600" : "text-gray-400"} size={20} />
                  <span className={`font-semibold ${role === "admin" ? "text-purple-600" : "text-gray-700"}`}>
                    Admin
                  </span>
                </button>
              </div>
              {touched.role && errors.role && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaTimesCircle className="text-xs" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span>Data Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
