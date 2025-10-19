import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

interface Subject {
  id?: string;
  subject_name: string;
  subject_description: string;
}

export default function SubjectListing() {
  const [subjects, setsubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newsubject, setNewsubject] = useState<Subject>({
    subject_name: "",
    subject_description: "",
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    async function getsubjects() {
      try {
        const response = await axios.get<Subject[]>(
          "http://localhost:8080/api/subject"
        );
        setsubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to fetch subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getsubjects();
  }, []);

  const handleAddsubject = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/subject", newsubject);
      setsubjects([...subjects, response.data]); // update list instantly
      setShowForm(false);
      setNewsubject({ subject_name: "", subject_description: "" });
    } catch (err) {
      console.error("Error adding subject:", err);
      alert("Failed to add subject. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500">
        Loading subjects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Our subjects</h2>

        {/* Admin-only button */}
        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Cancel" : "Add subject"}
          </button>
        )}
      </div>

      {/* Admin form */}
      {role === "admin" && showForm && (
        <form
          onSubmit={handleAddsubject}
          className="mb-10 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Add New subject
          </h3>

          <input
            type="text"
            placeholder="subject Name"
            value={newsubject.subject_name}
            onChange={(e) =>
              setNewsubject({ ...newsubject, subject_name: e.target.value })
            }
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            placeholder="subject Description"
            value={newsubject.subject_description}
            onChange={(e) =>
              setNewsubject({
                ...newsubject,
                subject_description: e.target.value,
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

      {/* subject cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900">
              {subject.subject_name}
            </h3>
            <p className="mt-2 text-gray-600">
              {subject.subject_description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
