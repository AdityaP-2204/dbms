// lib/mock-data.ts
export type ProductType = "Fast Track" | "Regular";

export interface Course {
  course_id: number;
  course_name: string;
  description: string;
}

export interface Subject {
  subject_id: number;
  course_id: number;
  subject_name: string;
}

export interface Faculty {
  faculty_id: number;
  name: string;
  designation: string;
}

// New interface for the many-to-many relationship
export interface ProductFaculty {
  product_id: number;
  faculty_id: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  course_id: number;
  product_type: ProductType;
  product_image: string;
  isCombo: boolean;
}

export interface Review {
  product_id: number;
  reviewer: string;
  rating: number;
  comment: string;
}

export interface ProductVariant {
  product_id: number;
  mode: "GDrive" | "Pendrive" | "Live";
  price: number;
  description: string;
}

// Mock Courses
export const courses: Course[] = [
  { course_id: 101, course_name: "CFA Level 1", description: "CFA beginner course" },
  { course_id: 102, course_name: "CA Final", description: "CA final preparation" },
  { course_id: 103, course_name: "CFA Level 2", description: "CFA advanced course" },
];

// Mock Subjects
export const subjects: Subject[] = [
  { subject_id: 1, course_id: 101, subject_name: "Ethics" },
  { subject_id: 2, course_id: 101, subject_name: "Quantitative Methods" },
  { subject_id: 3, course_id: 101, subject_name: "Economics" },
  { subject_id: 4, course_id: 101, subject_name: "Financial Reporting & Analysis" },
  { subject_id: 5, course_id: 101, subject_name: "Corporate Finance" },
  { subject_id: 6, course_id: 102, subject_name: "Financial Reporting" },
  { subject_id: 7, course_id: 102, subject_name: "Corporate Laws" },
  { subject_id: 8, course_id: 102, subject_name: "Cost Management" },
];

// Mock Faculty
export const faculties: Faculty[] = [
  { faculty_id: 1, name: "John Doe", designation: "Senior Instructor" },
  { faculty_id: 2, name: "Jane Smith", designation: "Assistant Instructor" },
  { faculty_id: 3, name: "Robert Brown", designation: "Lead Faculty" },
  { faculty_id: 4, name: "Emily White", designation: "Subject Matter Expert" },
];

// New many-to-many relationship table
export const productFaculties: ProductFaculty[] = [
  { product_id: 1, faculty_id: 1 },
  { product_id: 1, faculty_id: 2 },
  { product_id: 2, faculty_id: 3 },
  { product_id: 2, faculty_id: 4 },
  { product_id: 3, faculty_id: 1 }, // Faculty John Doe also teaches CFA Level 2
];

// Mock Products
export const products: Product[] = [
  {
    id: 1,
    title: "CFA Level 1 Crash Course",
    description: "Fast-track preparation with exam-focused content, mock tests, and mentoring to help you ace your exams.",
    course_id: 101,
    product_type: "Fast Track",
    product_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isCombo: false,
  },
  {
    id: 2,
    title: "CA Final Regular Batch",
    description: "In-depth, comprehensive coverage of all topics with detailed notes, weekly doubt sessions, and a full-length test series.",
    course_id: 102,
    product_type: "Regular",
    product_image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isCombo: true,
  },
  {
    id: 3,
    title: "CFA Level 2 Full Course",
    description: "Master advanced investment topics with our comprehensive course designed for CFA Level 2 candidates. Includes video lectures, practice questions, and mock exams.",
    course_id: 103,
    product_type: "Regular",
    product_image: "/ca-new-logo.jpg",
    isCombo: false,
  },
];

// Mock Reviews
export const reviews: Review[] = [
  { product_id: 1, reviewer: "Alice", rating: 5, comment: "Amazing course! It helped me pass with flying colors." },
  { product_id: 1, reviewer: "Bob", rating: 4, comment: "Very useful, but the pace was a bit fast for me. Excellent content nonetheless." },
  { product_id: 2, reviewer: "Charlie", rating: 5, comment: "Detailed and well structured. The combo pack was a great value." },
  { product_id: 2, reviewer: "David", rating: 5, comment: "Highly recommended for serious students. The faculty is top-notch." },
  { product_id: 3, reviewer: "Eve", rating: 4, comment: "Good quality course material, but could use more practice questions." },
];

// Mock Product Variants (now every product has at least one)
export const productVariants: ProductVariant[] = [
  // Variants for Product ID 1
  { product_id: 1, mode: "GDrive", price: 8999, description: "Instant access via Google Drive. Study anytime, anywhere." },
  { product_id: 1, mode: "Pendrive", price: 10999, description: "All content on a physical pendrive delivered to your door." },
  { product_id: 1, mode: "Live", price: 14999, description: "Join live interactive sessions with the faculty and peers." },

  // Variants for Product ID 2
  { product_id: 2, mode: "GDrive", price: 25000, description: "Immediate access to video lectures and notes on Google Drive." },
  { product_id: 2, mode: "Pendrive", price: 28000, description: "All course content and a bonus study kit on a pendrive." },

  // Variants for Product ID 3
  { product_id: 3, mode: "GDrive", price: 18000, description: "Instant access to all lectures and study material." },
  { product_id: 3, mode: "Pendrive", price: 21000, description: "Convenient offline access on a pendrive." },
];