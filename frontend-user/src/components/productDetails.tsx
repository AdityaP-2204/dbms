// ProductDetails.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewSection from "./reviewSection";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import Toast from "./Toast";

interface Faculty {
  id: string;
  name: string;
  description: string;
  email: string;
  institute_name: string;
  profile_image: string;
}

interface Variant {
  id: string;
  attempt: string;
  price: number;
  variant_image: string;
  delivery_mode: string;
  availability: boolean;
  validity: string;
  product_id: string;
}

interface Review {
  rating: number;
  comment: string;
  reviewer: string;
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

interface Subject {
  id: string;
  subject_name: string;
}

export default function ProductDetails() {
  const [selectedVariantAddedToWishlist, setSelectedVariantAddedToWishlist] = useState(false);
  const [selectedVariantAddedToCart, setSelectedVariantAddedToCart] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<JoinedProduct | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, boolean>>({});

  const [allFaculties, setAllFaculties] = useState<Faculty[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<Record<string, boolean>>({});

  const [newVariant, setNewVariant] = useState<Partial<Variant>>({
    attempt: "",
    price: 0,
    validity: "",
    delivery_mode: "",
    availability: false,
    variant_image: "",
  });

  const [showSubjectPanel, setShowSubjectPanel] = useState(false);
  const [showFacultyPanel, setShowFacultyPanel] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // fetch product (extracted so we can call it after updates)
  const fetchProduct = async () => {
    try {
      const resp = await axiosInstance.get(`http://localhost:8080/api/joinedProduct?id=${id}`);
      setProduct(resp.data);
      // set default selected variant to first
      if (resp.data?.variants?.length) {
        setSelectedVariant(resp.data.variants[0]);
        const res = await axiosInstance.get(`http://localhost:8080/api/wishlist?userId=${userId}&variantId=${resp.data.variants[0].id}`);
        if(res.data.id){
          console.log("Wishlist check response:", res.data.id);
          setSelectedVariantAddedToWishlist(true);
        } else {
          setSelectedVariant(null);
        }
        const res1 = await axiosInstance.get(`http://localhost:8080/api/cart?userId=${userId}&variantId=${resp.data.variants[0].id}`);
        if(res1.data.id){
          console.log("Cart check response:", res1.data.id);
          setSelectedVariantAddedToCart(true);
        } else {
          setSelectedVariantAddedToCart(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
    }
  };

  useEffect(() => {
    console.log("Wishlist status changed:", selectedVariantAddedToWishlist);
  }, [selectedVariantAddedToWishlist]);

  const user= useAuth();
  useEffect(() => {
    setRole(user?.role || null);
    setUserId(user?.id || null);
  }, [user]); 

  useEffect(() => {
    fetchProduct();
  }, []);

  // load master lists only for admin (or you can load always if preferred)
  useEffect(() => {
    if (role === "admin") {
      axiosInstance.get("http://localhost:8080/api/subject").then((res) => {
        setAllSubjects(res.data || []);
        // reset selection map
        const map: Record<string, boolean> = {};
        (res.data || []).forEach((s: Subject) => (map[s.id] = false));
        setSelectedSubjects(map);
      }).catch(() => {});
      axiosInstance.get("http://localhost:8080/api/faculty").then((res) => {
        setAllFaculties(res.data || []);
        const map: Record<string, boolean> = {};
        (res.data || []).forEach((f: Faculty) => (map[f.id] = false));
        setSelectedFaculties(map);
      }).catch(() => {});
    }
  }, [role]);

  // Helpers to get selected ids as arrays
  const getSelectedSubjectIds = () =>
    Object.entries(selectedSubjects).filter(([, v]) => v).map(([k]) => k);
  const getSelectedFacultyIds = () =>
    Object.entries(selectedFaculties).filter(([, v]) => v).map(([k]) => k);

  // Add subjects one by one (POST many) and refresh product
  const handleAddSubjects = async () => {
    const ids = getSelectedSubjectIds();
    if (!ids.length) return alert("Select at least one subject to add.");
    try {
      // send requests in parallel
      await Promise.all(
        ids.map((subjectId) =>
          axiosInstance.post("http://localhost:8080/api/productSubject", {
            // include both keys in case backend expects sproduct_id or product_id
            product_id: id,
            sproduct_id: id,
            subject_id: subjectId,
          })
        )
      );
      alert("Subjects added successfully");
      setShowSubjectPanel(false);
      // clear selections
      const cleared: Record<string, boolean> = {};
      allSubjects.forEach((s) => (cleared[s.id] = false));
      setSelectedSubjects(cleared);
      await fetchProduct();
    } catch (err) {
      console.error(err);
      alert("Failed to add subjects. See console.");
    }
  };

  // Add faculties and refresh
  const handleAddFaculties = async () => {
    const ids = getSelectedFacultyIds();
    if (!ids.length) return alert("Select at least one faculty to add.");
    try {
      await Promise.all(
        ids.map((facultyId) =>
          axiosInstance.post("http://localhost:8080/api/productFaculty", {
            product_id: id,
            faculty_id: facultyId,
          })
        )
      );
      alert("Faculties added successfully");
      setShowFacultyPanel(false);
      const cleared: Record<string, boolean> = {};
      allFaculties.forEach((f) => (cleared[f.id] = false));
      setSelectedFaculties(cleared);
      await fetchProduct();
    } catch (err) {
      console.error(err);
      alert("Failed to add faculties. See console.");
    }
  };

  // Add variant and refresh
  const handleAddVariant = async () => {
    // basic validation
    if (!newVariant.attempt || !newVariant.delivery_mode || !newVariant.price) {
      return alert("Please fill attempt, delivery mode and price.");
    }
    try {
      const payload = {
        attempt: newVariant.attempt,
        price: Number(newVariant.price),
        validity: newVariant.validity || "",
        delivery_mode: newVariant.delivery_mode,
        availability: !!newVariant.availability,
        variant_image: newVariant.variant_image || "",
        product_id: id,
      };
      await axiosInstance.post("http://localhost:8080/api/variant", payload);
      alert("Variant added successfully");
      setShowVariantForm(false);
      setNewVariant({
        attempt: "",
        price: 0,
        validity: "",
        delivery_mode: "",
        availability: false,
        variant_image: "",
      });
      await fetchProduct();
    } catch (err) {
      console.error(err);
      alert("Failed to add variant. See console.");
    }
  };

  if (!product) return <div className="p-10 text-center text-lg">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto pt-28 px-6 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        &larr; Back to Courses
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-white rounded-xl shadow-xl p-8">
        {/* Image */}
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={product.product_image || "https://via.placeholder.com/300x200.png?text=No+Image"}
            alt={product.title}
            className="w-full rounded-lg shadow-lg aspect-[4/3] object-cover"
          />
        </div>

        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h2>
            <span
              className={`inline-block px-4 py-1 text-sm font-bold rounded-full ${
                product.product_type === "Fast Track"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.product_type}
            </span>
            {product.is_combo && (
              <span className="inline-block px-4 py-1 text-sm font-bold bg-yellow-100 text-yellow-700 rounded-full">
                Combo
              </span>
            )}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          <p className="text-gray-500 font-medium">
            Course: <span className="text-indigo-600 font-bold">{product.course_name}</span>
          </p>

          {/* Admin action buttons */}
          {role === "admin" && (
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => setShowVariantForm((s) => !s)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
              >
                + Add Variant
              </button>
              <button
                onClick={() => setShowSubjectPanel((s) => !s)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
              >
                + Add Subject
              </button>
              <button
                onClick={() => setShowFacultyPanel((s) => !s)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
              >
                + Add Faculty
              </button>
            </div>
          )}

          {/* Variant form (admin) */}
          {showVariantForm && (
            <div className="bg-gray-50 p-6 rounded-lg border mt-4">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Add New Variant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Attempt"
                  className="border p-2 rounded"
                  value={newVariant.attempt}
                  onChange={(e) => setNewVariant({ ...newVariant, attempt: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="border p-2 rounded"
                  value={newVariant.price ?? ""}
                  onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                />
                <input
                  type="text"
                  placeholder="Validity (string)"
                  className="border p-2 rounded"
                  value={newVariant.validity}
                  onChange={(e) => setNewVariant({ ...newVariant, validity: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Delivery Mode"
                  className="border p-2 rounded"
                  value={newVariant.delivery_mode}
                  onChange={(e) => setNewVariant({ ...newVariant, delivery_mode: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Variant Image URL"
                  className="border p-2 rounded"
                  value={newVariant.variant_image}
                  onChange={(e) => setNewVariant({ ...newVariant, variant_image: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!newVariant.availability}
                    onChange={(e) => setNewVariant({ ...newVariant, availability: e.target.checked })}
                  />
                  Available
                </label>
              </div>
              <button
                onClick={handleAddVariant}
                className="mt-4 mr-5 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Submit Variant
              </button>
              <button
                onClick={() => {
                  // Clear form and close it
                  setNewVariant({
                    attempt: "",
                    price: 0,
                    validity: "",
                    delivery_mode: "",
                    availability: false,
                    variant_image: "",
                  });
                  setShowVariantForm(false);
                }}
                className="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
      </button>
            </div>
          )}

          {/* Subject panel (admin) - checkbox based multi-select */}
          {showSubjectPanel && (
            <div className="bg-gray-50 p-6 rounded-lg border mt-4">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Add Subjects</h3>
              <div className="max-h-48 overflow-auto p-2 border rounded">
                {allSubjects.length === 0 && <div className="text-gray-500">No subjects available</div>}
                {allSubjects.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 p-2">
                    <input
                      type="checkbox"
                      checked={!!selectedSubjects[s.id]}
                      onChange={(e) =>
                        setSelectedSubjects((prev) => ({ ...prev, [s.id]: e.target.checked }))
                      }
                    />
                    <span className="text-sm">{s.subject_name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleAddSubjects}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Add Selected Subjects
                </button>
                <button
                  onClick={() => {
                    // clear and close
                    const cleared: Record<string, boolean> = {};
                    allSubjects.forEach((s) => (cleared[s.id] = false));
                    setSelectedSubjects(cleared);
                    setShowSubjectPanel(false);
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Faculty panel (admin) - checkbox based multi-select */}
          {showFacultyPanel && (
            <div className="bg-gray-50 p-6 rounded-lg border mt-4">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Add Faculties</h3>
              <div className="max-h-48 overflow-auto p-2 border rounded">
                {allFaculties.length === 0 && <div className="text-gray-500">No faculties available</div>}
                {allFaculties.map((f) => (
                  <label key={f.id} className="flex items-center gap-3 p-2">
                    <input
                      type="checkbox"
                      checked={!!selectedFaculties[f.id]}
                      onChange={(e) =>
                        setSelectedFaculties((prev) => ({ ...prev, [f.id]: e.target.checked }))
                      }
                    />
                    <div>
                      <div className="text-sm font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleAddFaculties}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Add Selected Faculties
                </button>
                <button
                  onClick={() => {
                    const cleared: Record<string, boolean> = {};
                    allFaculties.forEach((f) => (cleared[f.id] = false));
                    setSelectedFaculties(cleared);
                    setShowFacultyPanel(false);
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Variants section (unchanged look) */}
          {product.variants.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Choose a Mode</h3>
              <div className="flex flex-col gap-4">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedVariant?.id === variant.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="product-mode"
                        value={variant.delivery_mode}
                        checked={selectedVariant?.id === variant.id}
                        onChange={async () =>{ 
                          setSelectedVariant(variant)
                          const res = await axiosInstance.get(`http://localhost:8080/api/wishlist?userId=${userId}&variantId=${variant.id}`);
                          if(res.data.id){
                            setSelectedVariantAddedToWishlist(true);
                          } else {
                            setSelectedVariantAddedToWishlist(false);
                          }
                          const res1 = await axiosInstance.get(`http://localhost:8080/api/cart?userId=${userId}&variantId=${variant.id}`);
                          if(res1.data.id){
                            setSelectedVariantAddedToCart(true);
                          } else {
                            setSelectedVariantAddedToCart(false);
                          }
                        }}
                        className="form-radio text-indigo-600 h-5 w-5"
                      />
                      <div>
                        <span className="font-semibold text-gray-800">{variant.delivery_mode}</span>
                        <p className="text-sm text-gray-500">Attempt-{variant.attempt}</p>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-indigo-600">₹{variant.price}</span>
                  </label>
                ))}
              </div>
              {
                role !== "admin" && selectedVariant && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={async () => {
                        if (!userId) {
                          setToastMessage("Please sign in to add to Wishlist.");
                          return;
                        }
                        if (selectedVariant) {
                          console.log("Adding to wishlist:", {
                            user_id: userId,
                            variant_id: selectedVariant.id
                          });
                          const res = await axiosInstance.post(`http://localhost:8080/api/wishlist`, {
                            user_id: userId,
                            variant_id: selectedVariant.id
                          });
                          if (res.status === 201) {
                            setToastMessage("Added to Wishlist!");
                            setSelectedVariantAddedToWishlist(true);
                          }
                        }
                      }}
                      disabled={(!userId) || (selectedVariantAddedToWishlist)}
                      className={`flex-1 py-3 text-lg font-bold text-white rounded-lg shadow transition-colors transform hover:scale-105 ${
                        userId && !selectedVariantAddedToWishlist ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Add to Wishlist
                    </button>

                    <button
                      onClick={async () => {
                        if (!userId) {
                          setToastMessage("Please sign in to add to Cart.");
                          return;
                        }
                        if (selectedVariant) {
                          console.log("Adding to cart:", {
                            user_id: userId,
                            variant_id: selectedVariant.id
                          });
                          const res = await axiosInstance.post(`http://localhost:8080/api/cart`, {
                            user_id: userId,
                            variant_id: selectedVariant.id
                          });
                          if (res.status === 201) {
                            setToastMessage("Added to Cart!");
                            setSelectedVariantAddedToCart(true);
                          }
                        }
                      }}
                      disabled={!userId || selectedVariantAddedToCart}
                      className={`flex-1 py-3 text-lg font-bold text-white rounded-lg shadow transition-colors transform hover:scale-105 ${
                        userId && !selectedVariantAddedToCart ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                )
              }
            </div>
          )}

          {/* Subjects & Faculties lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {product.subjects.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Subjects</h4>
                <ul className="list-inside text-gray-600 space-y-1">
                  {product.subjects.map((s, idx) => (
                    <li key={idx}>
                      <span className="text-sm">• {s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.faculties.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Faculty</h4>
                <ul className="list-inside text-gray-600 space-y-1">
                  {product.faculties.map((f, idx) => (
                    <li key={f.id || idx}>
                      <span className="text-sm">
                        • {f.name} - <span className="text-gray-500 text-xs">{f.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews: always visible; control Add Review inside ReviewSection */}
          <ReviewSection productId={product.id.toString()} userId={userId} hideAddReview={role === "admin"} />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
