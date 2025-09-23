import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4 pt-20">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {mockFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition hover:shadow-lg"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </h2>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>

              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
