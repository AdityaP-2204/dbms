// src/components/SignUp.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaArrowRight,
} from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "user",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    phone_number: false,
    address: false,
  });
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name: string) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return ""; // Optional field
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, "")))
      return "Please enter a valid 10-digit phone number";
    return "";
  };

  const validateAddress = (address: string) => {
    if (!address) return ""; // Optional field
    if (address.length < 5) return "Address must be at least 5 characters";
    return "";
  };

  // Handle field change with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate if field has been touched
    if (touched[name as keyof typeof touched]) {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "phone_number":
          error = validatePhone(value);
          break;
        case "address":
          error = validateAddress(value);
          break;
      }
      setErrors({ ...errors, [name]: error });
    }
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    // Validate on blur
    let error = "";
    switch (field) {
      case "name":
        error = validateName(formData.name);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "phone_number":
        error = validatePhone(formData.phone_number);
        break;
      case "address":
        error = validateAddress(formData.address);
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const phoneError = validatePhone(formData.phone_number);
    const addressError = validateAddress(formData.address);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      phone_number: phoneError,
      address: addressError,
    });

    setTouched({
      name: true,
      email: true,
      password: true,
      phone_number: true,
      address: true,
    });

    // If any required field has errors, don't submit
    if (nameError || emailError || passwordError) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user",
        formData
      );
      console.log(response);
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setErrors({
        ...errors,
        email: "This email is already registered",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    !errors.name &&
    !errors.email &&
    !errors.password &&
    formData.name &&
    formData.email &&
    formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FaUserPlus className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Join thousands of students on their learning journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser
                    className={`${
                      touched.name && !errors.name
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.name && errors.name
                      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : touched.name && !errors.name
                      ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {touched.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.name ? (
                      <FaTimesCircle className="text-red-500" />
                    ) : (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touched.name && errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaTimesCircle className="text-xs" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope
                    className={`${
                      touched.email && !errors.email
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock
                    className={`${
                      touched.password && !errors.password
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.password && errors.password
                      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : touched.password && !errors.password
                      ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Create a strong password"
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
              {!errors.password && formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">Password strength:</p>
                  <div className="flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        formData.password.length >= 8
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        /(?=.*\d)/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Two Column Layout for Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone
                      className={`${
                        touched.phone_number && !errors.phone_number && formData.phone_number
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone_number")}
                    className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      touched.phone_number && errors.phone_number
                        ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : touched.phone_number && !errors.phone_number && formData.phone_number
                        ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="10-digit number"
                  />
                  {touched.phone_number && formData.phone_number && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.phone_number ? (
                        <FaTimesCircle className="text-red-500" />
                      ) : (
                        <FaCheckCircle className="text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {touched.phone_number && errors.phone_number && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <FaTimesCircle className="text-xs" />
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Address
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt
                      className={`${
                        touched.address && !errors.address && formData.address
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={() => handleBlur("address")}
                    className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      touched.address && errors.address
                        ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : touched.address && !errors.address && formData.address
                        ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Your address"
                  />
                  {touched.address && formData.address && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.address ? (
                        <FaTimesCircle className="text-red-500" />
                      ) : (
                        <FaCheckCircle className="text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {touched.address && errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <FaTimesCircle className="text-xs" />
                    {errors.address}
                  </p>
                )}
              </div>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span>Free to Join</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span>Secure Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
