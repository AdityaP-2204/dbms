import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaPlus, FaPaperPlane } from "react-icons/fa";

const API_BASE = "http://localhost:8080/api"; // adjust if needed

export default function Community() {
  const [userId, setUserId] = useState<string | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any[] }>({});
  const [newQuestion, setNewQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  // Load user and queries
  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setUserId(storedId);

    // Fetch queries
    axios.get(`${API_BASE}/queries`).then((res) => {
      setQueries(res.data);

      // Fetch responses for each query
      res.data.forEach((q: any) => {
        axios.get(`${API_BASE}/responses/${q.id}`).then((r) => {
          setResponses((prev) => ({ ...prev, [q.id]: r.data }));
        });
      });
    });
  }, []);

  // Post a new question
  const handlePostQuestion = async () => {
    if (!userId || !newQuestion.trim()) return;
    const res = await axios.post(`${API_BASE}/queries`, {
      userId,
      question: newQuestion,
      createdAt: new Date().toISOString(),
    });
    setQueries([res.data, ...queries]);
    setNewQuestion("");
  };

  // Post a reply
  const handlePostReply = async (queryId: number) => {
    if (!userId || !replyInputs[queryId]?.trim()) return;
    const res = await axios.post(`${API_BASE}/responses`, {
      queryId,
      userId,
      answer: replyInputs[queryId],
      createdAt: new Date().toISOString(),
    });
    setResponses({
      ...responses,
      [queryId]: [...(responses[queryId] || []), res.data],
    });
    setReplyInputs({ ...replyInputs, [queryId]: "" });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pt-20">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">
        Community Q&A
      </h1>

      {/* Ask Question */}
      <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <FaUserCircle className="text-slate-400 text-2xl" />
          <p className="font-semibold text-lg text-slate-700">
            Ask a new question
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={userId ? "What's on your mind?" : "Sign in to ask a question"}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={!userId}
            className={`flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
              !userId ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
          <button
            onClick={handlePostQuestion}
            disabled={!userId}
            className={`px-8 py-3 bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-teal-700 transition-colors duration-200 ${
              !userId ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <FaPlus /> Post
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {queries.map((q) => {
          const answers = responses[q.id] || [];

          return (
            <div
              key={q.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Question */}
              <div className="flex items-start gap-4 mb-4">
                <FaUserCircle className="text-slate-500 text-2xl" />
                <div className="flex-1">
                  <p className="font-semibold text-base text-slate-800">
                    {q.userId === userId ? "You" : q.userId}
                  </p>
                  <p className="text-lg text-slate-700 mt-1">{q.question}</p>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4 ml-8 border-l-2 border-gray-200 pl-6">
                {answers.map((a) => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl transition-all duration-200 ${
                      a.userId === userId
                        ? "bg-teal-50 border border-teal-200 shadow-sm"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <p className="text-slate-700">{a.answer}</p>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      — {a.userId === userId ? "You" : a.userId}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              {userId && (
                <div className="mt-6 flex items-center gap-3 ml-8">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyInputs[q.id] || ""}
                    onChange={(e) =>
                      setReplyInputs({ ...replyInputs, [q.id]: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => handlePostReply(q.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                  >
                    <FaPaperPlane className="inline-block" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
