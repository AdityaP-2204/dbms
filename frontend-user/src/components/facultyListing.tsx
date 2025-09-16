// src/components/FacultyListing.tsx
import { faculties } from "../lib/mock-data";

export default function FacultyListing() {
  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Esteemed Faculty</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <div key={faculty.faculty_id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900">{faculty.name}</h3>
            <p className="mt-2 text-gray-600">{faculty.designation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}