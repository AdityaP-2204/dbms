import { useState, useEffect } from "react";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

interface Query {
  id: string;
  user_id: string;
  user_name: string;
  question: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}



export default function Community() {
  const [user, setUser] = useState<User | null>(null); // logged-in user
  const [userId, setUserId] = useState<string | null>(null); // logged-in user
  const [queries, setQueries] = useState<Query[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  // const [userId, setUserId] = useState<string | null>(null);

  // Fetch logged-in user and queries on mount
  useEffect(() => {
    // fetchCurrentUser();
    if(userId === null)
    fetchQueries();
  }, [userId]);

  const userauth= useAuth();
  useEffect(() => {
    if(userauth) setUser(userauth);
    setUserId(userauth?.id || null);
  }, [userauth]); 

  useEffect(()=>{
    console.log(userId);
  }, [userId])

  // const fetchCurrentUser = async () => {
  //   try {
  //     const res = await axiosInstance.get("http://localhost:8080/auth/me"); // backend returns logged-in user info
  //     setUser(res.data);
  //   } catch (err) {
  //     console.error("Not logged in or failed to fetch user", err);
  //     setUser(null);
  //   }
  // };

  

  const fetchQueries = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:8080/api/queries");
      console.log(res.data);
      
      // const formatted = res.data.map(async(q: any) => {
      //   const askedby = await axiosInstance.get(`http://localhost:8080/api/v1/user?id=${q.userId}`);
      //   return {
      //   id: q.id,
      //   user_id: askedby.data.name,
      //   question: q.message,
      //   created_at: q.createdAt,
      // }
      // });
      const formatted = await Promise.all(
        res.data.map(async (q: any) => {
          const askedby = await axiosInstance.get(`http://localhost:8080/api/v1/user?id=${q.userId}`);
          return {
            id: q.id,
            user_id: q.userId,
            user_name: askedby.data.name,
            question: q.message,
            created_at: q.createdAt,
          };
        })
      );

      setQueries(formatted);
    } catch (err) {
      console.error("Error fetching queries:", err);
    }
  };

  const handlePostQuestion = async () => {
    if (!user) {
      alert("Please log in to post a question.");
      return;
    }
    if (!newQuestion.trim()) return;

    try {
      const payload = {
        userId: userId,
        subject: "General",
        message: newQuestion,
        // userId removed; backend will get it from session cookie
      };

      const res = await axiosInstance.post("http://localhost:8080/api/queries", payload);
      const created = res.data;
      console.log(res.data);
      const formatted: Query = {
        id: created.id,
        user_id: created.userId, // backend sets this from session
        user_name: "You",
        question: created.message,
        created_at: created.createdAt,
      };

      setQueries([formatted, ...queries]);
      setNewQuestion("");
    } catch (err) {
      console.error("Error posting query:", err);
      alert("Failed to post your question. Check console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pt-20">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">Community Q&A</h1>

      {/* Ask Question */}
      <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <FaUserCircle className="text-slate-400 text-2xl" />
          <p className="font-semibold text-lg text-slate-700">Ask a new question</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={user ? "What's on your mind?" : "Sign in to ask a question"}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={!user}
            className={`flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
              !user ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
          <button
            onClick={handlePostQuestion}
            disabled={!user}
            className={`px-8 py-3 bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-teal-700 transition-colors duration-200 ${
              !user ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <FaPlus /> Post
          </button>
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-8">
        {queries.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <FaUserCircle className="text-slate-500 text-2xl" />
              <div className="flex-1">
                <p className="font-semibold text-base text-slate-800">
                  {q.user_id === user?.id ? "You" : `User: ${q.user_name}`}
                </p>
                <p className="text-lg text-slate-700 mt-1">{q.question}</p>
                <p className="text-sm text-slate-400 mt-1">{new Date(q.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
