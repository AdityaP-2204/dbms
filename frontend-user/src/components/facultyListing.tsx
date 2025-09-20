import axios from "axios";
import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";

interface Faculty {
  id?: string;
  name: string;
  email: string;
  description: string;
  profileImage: string;   // this should come from backend (e.g. "/ca-new-logo.jpg")
  instituteName: string;
}

export default function FacultyListing() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Our Esteemed Faculty
      </h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <article
            key={faculty.id || faculty.email}
            className="group relative bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-400/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img
                  src={faculty.profileImage || "/placeholder.svg"} 
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
                    {faculty.instituteName}
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
