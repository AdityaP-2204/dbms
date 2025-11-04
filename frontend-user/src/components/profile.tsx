import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaShoppingBag,
  FaIdCard,
  FaCheckCircle,
} from "react-icons/fa";
import UserReviews from "./userReviews";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Unnamed User",
    email: "No email provided",
    phone_number: "Not provided",
    address: "Not provided",
  });
  const [editData, setEditData] = useState(profile);

   const user= useAuth();
  useEffect(() => {
    setRole(user?.role || null);
    setUserId(user?.id || null);
  }, [user]); 

  useEffect(() => {
    async function getProfile() {
      if (!userId) return;
      try {
        const response = await axiosInstance.get("http://localhost:8080/api/v1/user", {
          params: { id: userId },
        });
        const data = response?.data;
        setProfile({
          name: data?.name || "Unnamed User",
          email: data?.email || "No email provided",
          phone_number: data?.phone_number || "Not provided",
          address: data?.address || "Not provided"
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getProfile();
  }, [userId]);

  useEffect(() => {
    setEditData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (!userId) return;
      await axiosInstance.put(
        `http://localhost:8080/api/v1/user?id=${userId}`,
        {
          name: editData.name,
          email: editData.email,
          phone_number: editData.phone_number,
          address: editData.address,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name || name === "Unnamed User") return "?";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[1].charAt(0).toUpperCase()
      );
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10 px-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {getInitials(profile.name)}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.name}
                </h2>
                <p className="text-gray-500 flex items-center justify-center gap-2 mb-4">
                  <FaEnvelope className="text-sm" />
                  <span className="text-sm">{profile.email}</span>
                </p>
                
                {role && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    <FaCheckCircle />
                    {role === "admin" ? "Administrator" : "Student"}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3 mt-6">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                      
                      {role !== "admin" && (
                        <button
                          onClick={() => navigate("/transactions")}
                          className="w-full py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                        >
                          <FaShoppingBag />
                          My Transactions
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-8">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FaIdCard className="text-blue-600" />
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-900 mb-1 uppercase tracking-wide">
                            Full Name
                          </h4>
                          <p className="text-gray-900 font-semibold text-lg">
                            {profile.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-purple-900 mb-1 uppercase tracking-wide">
                            Email Address
                          </h4>
                          <p className="text-gray-900 font-semibold text-lg break-all">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-green-900 mb-1 uppercase tracking-wide">
                            Phone Number
                          </h4>
                          <p className="text-gray-900 font-semibold text-lg">
                            {profile.phone_number}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-orange-900 mb-1 uppercase tracking-wide">
                            Address
                          </h4>
                          <p className="text-gray-900 font-semibold text-lg">
                            {profile.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FaEdit className="text-blue-600" />
                      Edit Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="phone_number"
                          value={editData.phone_number}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={editData.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold border-2 border-gray-300"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
                    >
                      <FaSave />
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Reviews Section */}
        {userId && role !== "admin" && (
          <div className="mt-6">
            <UserReviews userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}