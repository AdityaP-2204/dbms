// ProductListing.tsx
import ProductCard from "./product-card";
import { useState, useEffect } from "react";
import axios from "axios";

interface Faculty{
  id: string;
  name:string;
  description:string;
  email:string;
  institute_name:string;
  profile_image:string;
}

interface Variant{
    id:string;
    attempt:string;
    price:number;
    variant_image:string;
    delivery_mode:string;
    availability:boolean;
    validity:string;
    product_id:string;
}
interface Review{
    rating:number,
    comment:string,
    reviewer:string
}

interface JoinedProduct {
  id: number;
  title: string;
  description: string;
  course_name: string;
  course_description: string;
  product_type: string;
  product_image: string;
  is_combo: boolean;
  rating: number; 
  total_reviews: number; 
  variants: Variant[];
  subjects: string[];
  faculties: Faculty[];
  reviews: Review[];
}

export default function ProductListing() {
  const [joinedProducts,setJoinedProducts]=useState<JoinedProduct[]>([]);
  useEffect(()=>{
      async function getJoinedProducts(){
        const response = await axios.get("http://localhost:8080/api/joinedProduct");
        setJoinedProducts(response.data);
      }
      getJoinedProducts();
  },[]);
  return (
    <div className=" pt-20 max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {joinedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
