import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Using existing icons

const mockFaqs = [
  {
    question: "What is the eligibility for enrolling in a CA course?",
    answer:
      "To start with the CA Foundation course, you must have passed Class 12th. After graduation, you can directly enter into CA Intermediate under the direct entry scheme.",
  },
  {
    question: "How long does it take to complete the CA course?",
    answer:
      "On average, it takes 4.5 to 5 years to complete the CA course, provided you clear all levels (Foundation, Intermediate, and Final) in the first attempt along with the required articleship training.",
  },
  {
    question: "What is the exam pattern for CA Foundation?",
    answer:
      "The CA Foundation exam consists of 4 papers: two subjective (Accounting and Business Laws) and two objective (Mathematics, Economics, and Business & Commercial Knowledge).",
  },
  {
    question: "Is articleship compulsory for CA?",
    answer:
    "Yes, a 3-year articleship under a practicing Chartered Accountant is mandatory before you can attempt the CA Final exams.",
  },
  {
    question: "Can I pursue CA along with graduation?",
    answer:
      "Yes, many students pursue CA alongside their graduation. However, balancing both requires good time management and dedication.",
  },
  {
    question: "What career opportunities are available after completing CA?",
    answer:
      "As a qualified CA, you can work in auditing, taxation, financial advisory, corporate finance, investment banking, or even start your own practice.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 pt-24 font-sans">
      <div className="max-w-3xl w-full">
        {/* Main Title - similar to "We partner with the world's leading universities" */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center leading-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {mockFaqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md transition-all duration-300 ease-in-out
                ${openIndex === index ? "bg-purple-100 shadow-lg" : "bg-white hover:shadow-lg"}
              `}
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className={`text-lg md:text-xl font-semibold transition-colors duration-200
                  ${openIndex === index ? "text-purple-800" : "text-gray-800"}
                `}>
                  {faq.question}
                </h2>
                {openIndex === index ? (
                  <FaChevronUp className="text-purple-600 ml-4 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-gray-500 ml-4 flex-shrink-0" />
                )}
              </button>

              {/* Answer section - conditional rendering with smooth transition */}
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