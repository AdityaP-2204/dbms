// src/components/QueryCard.tsx
import { useState, useEffect } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import axiosInstance from "../api/axiosConfig";

interface Query {
  id: string;
  user_id: string;
  user_name: string;
  question: string;
  created_at: string;
}

interface Response {
  id: string;
  queryId: string;
  userId: string;
  userName: string;
  message: string;
  sentAt: string;
}

interface QueryCardProps {
  query: Query;
  currentUserId: string | null;
}

export default function QueryCard({ query, currentUserId }: QueryCardProps) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [newResponse, setNewResponse] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (showResponses) fetchResponses();
  }, [showResponses]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      console.log(query.id)
      const res = await axiosInstance.get(
        `http://localhost:8080/api/responses?queryId=${query.id}`
      );
      console.log(res.data)
      const formatted = await Promise.all(
        res.data.map(async (r: any) => {
          const askedby = await axiosInstance.get(
            `http://localhost:8080/api/v1/user?id=${r.userId}`
          );
          return {
            id: r.id,
            queryId: r.queryId,
            user_id: r.userId,
            userName: askedby.data.name,
            message: r.message,
            sentAt: r.sentAt,
          };
        })
      );
      
      setResponses(formatted);
    } catch (err) {
      console.error("Error fetching responses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!currentUserId) {
      alert("Please log in to post a response.");
      return;
    }
    if (!newResponse.trim()) return;

    try {
      setPosting(true);
      const payload = {
        queryId: query.id,
        message: newResponse,
        userId: currentUserId,
      };

      const res = await axiosInstance.post(
        "http://localhost:8080/api/responses",
        payload
      );

      const created = res.data;

      // const formatted: Response = {
      //   id: created.id,
      //   queryId: query.id,
      //   userId: currentUserId,
      //   userName: "You",
      //   message: created.message,
      //   sentAt: created.sentAt,
      // };

      console.log(created);

      // add the new response instantly
      setResponses(created);
      setNewResponse("");
    } catch (err) {
      console.error("Error posting response:", err);
      alert("Failed to post response. Check console for details.");
    } finally {
      setPosting(false);
    }
  };

  const isCurrentUser = query.user_id === currentUserId;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Query Header */}
      <div className="flex items-start gap-4 mb-4">
        <FaUserCircle className="text-slate-500 text-2xl" />
        <div className="flex-1">
          <p className="font-semibold text-base text-slate-800">
            {isCurrentUser ? "You" : `User: ${query.user_name}`}
          </p>
          <p className="text-lg text-slate-700 mt-1">{query.question}</p>
          <p className="text-sm text-slate-400 mt-1">
            {new Date(query.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Show/hide responses */}
      <button
        onClick={() => setShowResponses(!showResponses)}
        className="text-teal-600 text-sm font-medium hover:underline"
      >
        {showResponses ? "Hide Responses ▲" : "View Responses ▼"}
      </button>

      {/* Responses Section */}
      {showResponses && (
        <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading responses...</p>
          ) : responses.length === 0 ? (
            <p className="text-gray-500 text-sm mb-2">No responses yet.</p>
          ) : (
            responses.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 mb-4 bg-gray-50 p-3 rounded-lg"
              >
                <FaUserCircle className="text-slate-400 text-xl" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    {r.userId === currentUserId ? "You" : r.userName}
                  </p>
                  <p className="text-slate-700 text-sm mt-1">{r.message}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(r.sentAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Add Response Input */}
          <div className="mt-3 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder={
                currentUserId
                  ? "Write a response..."
                  : "Sign in to write a response"
              }
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              disabled={!currentUserId || posting}
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                !currentUserId ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            />
            <button
              onClick={handleAddResponse}
              disabled={!currentUserId || posting}
              className={`px-4 py-2 bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-teal-700 transition-colors duration-200 ${
                !currentUserId ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <FaPaperPlane className="text-sm" />
              {posting ? "Posting..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
