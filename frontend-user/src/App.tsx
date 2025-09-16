// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductListing from "../src/components/productListing";
import ProductDetails from "./components/productDetails";
import Navbar from "./components/navbar";
import CourseListing from "./components/courseListing"; // Import the new components
import FacultyListing from "./components/facultyListing"; // Import the new components

export default function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        {/* Home / product listing page */}
        <Route path="/" element={<ProductListing />} />

        {/* Course listing page */}
        <Route path="/courses" element={<CourseListing />} />

        {/* Faculty listing page */}
        <Route path="/faculty" element={<FacultyListing />} />

        {/* Product details page */}
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}