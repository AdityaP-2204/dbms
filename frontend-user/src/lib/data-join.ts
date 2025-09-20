// lib/data-join.ts
import type { ProductType, ProductVariant } from "./mock-data";
import { products, courses, subjects, productFaculties, reviews, productVariants, faculties } from "./mock-data";

export interface JoinedProduct {
  id: number;
  title: string;
  description: string;
  course_name: string;
  course_description: string;
  product_type: ProductType;
  product_image: string;
  isCombo: boolean;
  rating: number; 
  total_reviews: number; 
  variants: ProductVariant[];
  subjects: string[];
  faculties: { name: string; designation: string }[];
  reviews: { reviewer: string; rating: number; comment: string }[];
}

export const joinedProducts: JoinedProduct[] = products.map((p) => {
  const course = courses.find((c) => c.course_id === p.course_id);
  const courseSubjects = subjects
    .filter((s) => s.course_id === p.course_id)
    .map((s) => s.subject_name);

  // Link faculties to products through the many-to-many table
  const productFacultiesForProduct = productFaculties
    .filter((pf) => pf.product_id === p.id)
    .map((pf) => {
      const faculty = faculties.find((f) => f.faculty_id === pf.faculty_id);
      return faculty ? { name: faculty.name, designation: faculty.designation } : null;
    })
    .filter(Boolean) as { name: string; designation: string }[];

  const productReviews = reviews
    .filter((r) => r.product_id === p.id);

  const productVariantOptions = productVariants.filter(
    (v) => v.product_id === p.id
  );

  // Calculate average rating and total reviews
  const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;

  return {
    ...p,
    course_name: course ? course.course_name : "Unknown",
    course_description: course ? course.description : "",
    rating: averageRating,
    total_reviews: productReviews.length,
    subjects: courseSubjects,
    faculties: productFacultiesForProduct,
    reviews: productReviews,
    variants: productVariantOptions,
  };
});