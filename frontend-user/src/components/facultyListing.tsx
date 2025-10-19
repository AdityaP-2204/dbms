import axios from "axios";
import { useEffect, useState } from "react";
import { Mail, MapPin, PlusCircle } from "lucide-react";

interface Faculty {
  id?: string;
  name: string;
  email: string;
  description: string;
  profile_image: string; // e.g., "/ca-new-logo.jpg"
  institute_name: string;
}

export default function FacultyListing() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields for adding new faculty
  const [newFaculty, setNewFaculty] = useState<Faculty>({
    name: "",
    email: "",
    description: "",
    profile_image: "",
    institute_name: "",
  });

  const role = localStorage.getItem("role");

  // Fetch faculty list
  useEffect(() => {
    async function getFaculty() {
      try {
        const response = await axios.get<Faculty[]>(
          "http://localhost:8080/api/faculty"
        );
        setFaculties(response.data);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setError("Failed to fetch faculty data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getFaculty();
  }, []);

  const handleAddFaculty = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/faculty", newFaculty);
      setFaculties([...faculties, response.data]); // update UI dynamically
      setShowForm(false);
      setNewFaculty({
        name: "",
        email: "",
        description: "",
        profile_image: "",
        institute_name: "",
      });
    } catch (err) {
      console.error("Error adding faculty:", err);
      alert("Failed to add faculty. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10 text-center text-gray-500">
        Loading faculty data...
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

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Our Esteemed Faculty
        </h2>

        {/* Show Add Faculty button only if admin */}
        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Cancel" : "Add Faculty"}
          </button>
        )}
      </div>

      {/* Add Faculty Form (visible to admin only when toggled) */}
      {role === "admin" && showForm && (
        <form
          onSubmit={handleAddFaculty}
          className="mb-10 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Add New Faculty
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newFaculty.name}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, name: e.target.value })
              }
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={newFaculty.email}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, email: e.target.value })
              }
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Institute Name"
              value={newFaculty.institute_name}
              onChange={(e) =>
                setNewFaculty({
                  ...newFaculty,
                  institute_name: e.target.value,
                })
              }
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Profile Image Path (e.g. /images/profile1.jpg)"
              value={newFaculty.profile_image}
              onChange={(e) =>
                setNewFaculty({
                  ...newFaculty,
                  profile_image: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <textarea
            placeholder="Description"
            value={newFaculty.description}
            onChange={(e) =>
              setNewFaculty({
                ...newFaculty,
                description: e.target.value,
              })
            }
            required
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all"
          >
            Submit
          </button>
        </form>
      )}

      {/* Faculty Cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <article
            key={faculty.id || faculty.email}
            className="group relative bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-400/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img
                  src={faculty.profile_image || "/placeholder.svg"}
                  alt={`Portrait of ${faculty.name}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {faculty.name}
                </h3>

                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {faculty.institute_name}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {faculty.description}
              </p>

              <a
                href={`mailto:${faculty.email}`}
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200 group/email"
                aria-label={`Send email to ${faculty.name}`}
              >
                <Mail className="w-4 h-4 transition-transform duration-200 group-hover/email:scale-110" />
                <span className="font-medium">{faculty.email}</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
