// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductListing from "../src/components/productListing";
import ProductDetails from "./components/productDetails";
import Navbar from "./components/navbar";
import CourseListing from "./components/courseListing"; // Import the new components
import FacultyListing from "./components/facultyListing"; // Import the new components
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Profile from "./components/profile";
import Cart from "./components/cart";
import Wishlist from "./components/wishlist";
import FAQ from "./components/faq";
import Community from "./components/community";
import SubjectListing from "./components/subjectListing";

export default function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>

        <Route path="/" element={<ProductListing />} />

        <Route path="/courses" element={<CourseListing />} />
         <Route path="/subjects" element={<SubjectListing />} />
        <Route path="/faculty" element={<FacultyListing />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/signin" element={<SignIn></SignIn>} ></Route>
        <Route path="/signup" element={<SignUp></SignUp>} ></Route>
        <Route path="/profile" element={<Profile/>} ></Route>
        <Route path="/cart" element={<Cart/>} ></Route>
        <Route path="/wishlist" element={<Wishlist/>} ></Route>
        <Route path="/faq" element={<FAQ/>} ></Route>
        <Route path="/community" element={<Community/>} ></Route>
      </Routes>
    </Router>
  );
}