// src/components/CourseListing.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseListing() {
  const [courses,setCourses]=useState([{
    id:"",
    course_name:"",
    course_description:""
  }])
  useEffect(()=>{
    async function getCourses(){
      const response=await axios.get("http://localhost:8080/api/course");
      setCourses(response.data);
    }
    getCourses();
  },[])

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Courses</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900">{course.course_name}</h3>
            <p className="mt-2 text-gray-600">{ course.course_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}