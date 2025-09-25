import { useState ,useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Using existing icons


interface FAQType {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Fetch FAQs from backend
    useEffect(() => {
      fetch("http://localhost:8080/api/FAQs")
        .then((res) => res.json())
        .then((data) => setFaqs(data))
        .catch((err) => console.error("Failed to fetch FAQs:", err));
    }, []);

    const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);

  };

  return (
      <div className="min-h-screen flex justify-center py-12 px-4 pt-24 font-sans">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center leading-tight">
            Frequently Asked Questions
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md transition-all duration-300 ease-in-out
                  ${openIndex === index ? "bg-purple-100 shadow-lg" : "bg-white hover:shadow-lg"}`}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h2
                    className={`text-lg md:text-xl font-semibold transition-colors duration-200
                    ${openIndex === index ? "text-purple-800" : "text-gray-800"}`}
                  >
                    {faq.question}
                  </h2>
                  {openIndex === index ? (
                    <FaChevronUp className="text-purple-600 ml-4 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-500 ml-4 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }