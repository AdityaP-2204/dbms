import { useState, useEffect } from "react";
import { FaUserCircle, FaPlus, FaPaperPlane } from "react-icons/fa";

// Users
const users = [
  { id: "u1", name: "Rohit Sharma" },
  { id: "u2", name: "Priya Mehta" },
  { id: "u3", name: "Sunil Kumar" }, 
];

// Mock queries and responses
const initialQueries = [
  { id: "q1", user_id: "u1", question: "How do I prepare for CA Intermediate Group 1?", created_at: "2025-09-23T10:00:00Z" },
  { id: "q2", user_id: "u2", question: "Is articleship mandatory before CA Final?", created_at: "2025-09-22T15:30:00Z" },
];

const initialResponses = [
  { id: "a1", query_id: "q1", user_id: "u2", answer: "Focus on Accounting and Law daily. Practice past 5-year papers.", created_at: "2025-09-23T11:00:00Z" },
  { id: "a2", query_id: "q1", user_id: "u3", answer: "Don’t ignore Costing; it’s scoring. Revise theory daily.", created_at: "2025-09-23T12:00:00Z" },
  { id: "a3", query_id: "q2", user_id: "u1", answer: "Yes, 3-year articleship is mandatory before CA Final attempt.", created_at: "2025-09-22T16:00:00Z" },
];

export default function Community() {
  const [userId, setUserId] = useState<string | null>(null);
  const [queries, setQueries] = useState(initialQueries);
  const [responses, setResponses] = useState(initialResponses);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedId = localStorage.getItem("id"); 
    setUserId(storedId);
  }, []);

  const handlePostQuestion = () => {
    if (!userId) {
      alert("Please log in to post a question.");
      return;
    }
    if (!newQuestion.trim()) return;

    const newQ = {
      id: `q${queries.length + 1}`,
      user_id: userId,
      question: newQuestion,
      created_at: new Date().toISOString(),
    };

    setQueries([newQ, ...queries]);
    setNewQuestion("");
  };

  const handlePostReply = (queryId: string) => {
    if (!userId || !replyInputs[queryId]?.trim()) return;

    const newAnswer = {
      id: `a${responses.length + 1}`,
      query_id: queryId,
      user_id: userId,
      answer: replyInputs[queryId],
      created_at: new Date().toISOString(),
    };

    setResponses([...responses, newAnswer]);
    setReplyInputs({ ...replyInputs, [queryId]: "" });
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
          const user = users.find((u) => u.id === q.user_id);
          const isLoggedInUser = q.user_id === userId;
          const answers = responses.filter((r) => r.query_id === q.id);

          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {/* Question */}
              <div className="flex items-start gap-4 mb-4">
                <FaUserCircle className="text-slate-500 text-2xl" />
                <div className="flex-1">
                  <p className="font-semibold text-base text-slate-800">
                    {isLoggedInUser ? "You" : user?.name}
                  </p>
                  <p className="text-lg text-slate-700 mt-1">{q.question}</p>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4 ml-8 border-l-2 border-gray-200 pl-6">
                {answers.map((a) => {
                  const answerUser = users.find((u) => u.id === a.user_id);
                  const isAnswerFromLoggedInUser = a.user_id === userId;
                  return (
                    <div
                      key={a.id}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        isAnswerFromLoggedInUser
                          ? "bg-teal-50 border border-teal-200 shadow-sm"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <p className="text-slate-700">{a.answer}</p>
                      <p className="text-sm text-slate-500 mt-2 font-medium">
                        — {isAnswerFromLoggedInUser ? "You" : answerUser?.name}
                      </p>
                    </div>
                  );
                })}
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