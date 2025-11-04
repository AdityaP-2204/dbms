// src/components/QueryCard.tsx
import { useState, useEffect } from "react";
import { FaUserCircle, FaPaperPlane, FaChevronDown, FaChevronUp, FaCommentDots } from "react-icons/fa";
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
      console.log(created);
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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Query Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <FaUserCircle className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-gray-900">
                {isCurrentUser ? "You" : query.user_name}
              </p>
              <span className="text-gray-400">•</span>
              <p className="text-sm text-gray-500">
                {new Date(query.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed">{query.question}</p>
          </div>
        </div>

        {/* Show/hide responses button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowResponses(!showResponses)}
            className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
          >
            <FaCommentDots />
            {showResponses ? (
              <>
                Hide Responses <FaChevronUp className="text-xs" />
              </>
            ) : (
              <>
                View Responses ({responses.length}) <FaChevronDown className="text-xs" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responses Section */}
      {showResponses && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : responses.length === 0 ? (
              <div className="text-center py-8">
                <FaCommentDots className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No responses yet. Be the first to respond!</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {responses.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUserCircle className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {r.userId === currentUserId ? "You" : r.userName}
                          </p>
                          <span className="text-gray-400 text-xs">•</span>
                          <p className="text-xs text-gray-500">
                            {new Date(r.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{r.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Response Input */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder={
                    currentUserId
                      ? "Write your response..."
                      : "Sign in to write a response"
                  }
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  disabled={!currentUserId || posting}
                  className={`flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm ${
                    !currentUserId ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
                <button
                  onClick={handleAddResponse}
                  disabled={!currentUserId || posting || !newResponse.trim()}
                  className={`px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm hover:shadow-lg transition-all duration-300 ${
                    !currentUserId || !newResponse.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  <FaPaperPlane className="text-xs" />
                  {posting ? "Posting..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
