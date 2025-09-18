import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

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
          name: data?.name || "",
          email: data?.email || "",
          address: data?.address || "",
          phoneNumber: data?.phoneNumber || "",
        });
        localStorage.setItem("id", response.data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getProfile();
  }, [userId]);

  const [editData, setEditData] = useState(profile);

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
            phoneNumber: editData.phoneNumber,
            address: editData.address,
          },                                               
          {
            headers: { "Content-Type": "application/json" } 
          }
        );

      setProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {!isEditing ? (
          <>
            <div className="flex flex-col items-center">
              {/* Avatar placeholder
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
              </div> */}

              {/* Name */}
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                {profile.name || "Unnamed User"}
              </h2>

              {/* Email */}
              <p className="text-gray-500">{profile.email || "No email"}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">
                  {profile.phoneNumber || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-600">{profile.address || "—"}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Profile
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phoneNumber"
                value={editData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
