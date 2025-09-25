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
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
      async function getJoinedProductsWithRatings(){
        try {
          // Fetch products
          const productResponse = await axios.get("http://localhost:8080/api/joinedProduct");
          const products = productResponse.data;

          // Fetch rating stats for each product
          const productsWithRatings = await Promise.all(
            products.map(async (product: JoinedProduct) => {
              try {
                console.log(`Fetching stats for product ID: ${product.id}`);
                const statsResponse = await axios.get(
                  `http://localhost:8080/api/v1/review/stats?product_id=${product.id}`
                );
                
                console.log(`Stats for ${product.id}:`, statsResponse.data);
                
                const updatedProduct = {
                  ...product,
                  rating: statsResponse.data.average_rating || 0,
                  total_reviews: statsResponse.data.review_count || 0
                };
                
                console.log(`Updated product ${product.id}:`, {
                  rating: updatedProduct.rating,
                  total_reviews: updatedProduct.total_reviews
                });
                
                return updatedProduct;
              } catch (error) {
                console.error(`Error fetching stats for product ${product.id}:`, error);
                // Return product with default rating values if stats fetch fails
                return {
                  ...product,
                  rating: 0,
                  total_reviews: 0
                };
              }
            })
          );

          setJoinedProducts(productsWithRatings);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
      getJoinedProductsWithRatings();
  },[]);
  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="max-w-xs w-full bg-white shadow-lg rounded-xl overflow-hidden animate-pulse">
              <div className="bg-gray-300 h-48"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
