import {  useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";

interface Course {
  id?: string;
  course_name: string;
  course_description: string;
}

export default function CourseListing() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    course_name: "",
    course_description: "",
  });

  const user= useAuth();
  const role=user?.role;

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await axiosInstance.get<Course[]>(
          "http://localhost:8080/api/course"
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getCourses();
  }, []);

  const handleAddCourse = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("http://localhost:8080/api/course", newCourse);
      setCourses([...courses, response.data]); 
      setShowForm(false);
      setNewCourse({ course_name: "", course_description: "" });
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500">
        Loading courses...
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
        <h2 className="text-3xl font-bold text-gray-900">Our Courses</h2>

        {/* Admin-only button */}
        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Cancel" : "Add Course"}
          </button>
        )}
      </div>

      {/* Admin form */}
      {role === "admin" && showForm && (
        <form
          onSubmit={handleAddCourse}
          className="mb-10 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Add New Course
          </h3>

          <input
            type="text"
            placeholder="Course Name"
            value={newCourse.course_name}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_name: e.target.value })
            }
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            placeholder="Course Description"
            value={newCourse.course_description}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                course_description: e.target.value,
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

      {/* Course cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900">
              {course.course_name}
            </h3>
            <p className="mt-2 text-gray-600">
              {course.course_description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
