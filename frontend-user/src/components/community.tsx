// src/pages/Community.tsx
import { useState, useEffect } from "react";
import { FaUserCircle, FaPlus, FaUsers, FaComments } from "react-icons/fa";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import QueryCard from "../components/QueryCard"; // ✅ imported new component

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
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  const userauth = useAuth();

  useEffect(() => {
    if (userauth) setUser(userauth);
    setUserId(userauth?.id || null);
  }, [userauth]);

  useEffect(() => {
    if (userId === null) fetchQueries();
  }, [userId]);

  const fetchQueries = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:8080/api/queries");

      const formatted = await Promise.all(
        res.data.map(async (q: any) => {
          const askedby = await axiosInstance.get(
            `http://localhost:8080/api/v1/user?id=${q.userId}`
          );
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
      };

      const res = await axiosInstance.post("http://localhost:8080/api/queries", payload);
      console.log(res.data);
      fetchQueries();
      setNewQuestion("");
    } catch (err) {
      console.error("Error posting query:", err);
      alert("Failed to post your question.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaUsers className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Community Q&A
              </h1>
              <p className="text-blue-100 mt-1">
                Connect, ask questions, and learn together
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaUsers className="text-white text-2xl" />
                <div>
                  <p className="text-white text-2xl font-bold">10K+</p>
                  <p className="text-blue-100 text-sm">Members</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaComments className="text-white text-2xl" />
                <div>
                  <p className="text-white text-2xl font-bold">{queries.length}</p>
                  <p className="text-blue-100 text-sm">Questions</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-white text-2xl" />
                <div>
                  <p className="text-white text-2xl font-bold">24/7</p>
                  <p className="text-blue-100 text-sm">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Ask Question Card */}
        <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaPlus className="text-white" />
              </div>
              <h2 className="font-semibold text-lg text-gray-900">Ask a Question</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder={user ? "What would you like to know?" : "Please sign in to ask a question"}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                disabled={!user}
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  !user ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              />
              <button
                onClick={handlePostQuestion}
                disabled={!user || !newQuestion.trim()}
                className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-all duration-300 ${
                  !user || !newQuestion.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                <FaPlus /> Post Question
              </button>
            </div>
            {!user && (
              <p className="text-sm text-gray-500 mt-3">
                Please sign in to participate in the community discussions.
              </p>
            )}
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-6">
          {queries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
              <FaComments className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600">Be the first to ask a question!</p>
            </div>
          ) : (
            queries.map((q) => (
              <QueryCard key={q.id} query={q} currentUserId={user?.id || null} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
