import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";
import UserReviews from "./userReviews";

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Unnamed User",
    email: "No email provided",
    phone_number: "Not provided",
    address: "Not provided",
  });
  const [editData, setEditData] = useState(profile);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setUserId(storedId);
  }, []);

  useEffect(() => {
    async function getProfile() {
      if (!userId) return;
      try {
        const response = await axios.get("http://localhost:8080/api/v1/user", {
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
      await axios.put(
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        {/* User Info Section */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-gray-200 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-blue-500 text-white flex items-center justify-center text-4xl font-bold">
            {getInitials(profile.name)}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {profile.name}
          </h2>
          <p className="mt-1 flex items-center text-gray-500">
            <FaEnvelope className="mr-2" />
            {profile.email}
          </p>
        </div>

        {!isEditing ? (
          <>
            {/* Display Mode */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <FaUser className="text-gray-500 mr-4" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="text-gray-900 font-semibold">
                    {profile.name}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <FaPhone className="text-gray-500 mr-4" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Phone Number
                  </h3>
                  <p className="text-gray-900 font-semibold">
                    {profile.phone_number}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-4" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-gray-900 font-semibold">
                    {profile.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Your Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border-gray-300 rounded-lg bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full border-gray-300 rounded-lg bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={editData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border-gray-300 rounded-lg bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full border-gray-300 rounded-lg bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

      {/* User Reviews Section */}
      {userId && <UserReviews userId={userId} />}
    </div>
  );
}