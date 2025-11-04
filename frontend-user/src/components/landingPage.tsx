import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaUsers,
  FaCertificate,
  FaBook,
  FaLaptop,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaQuoteLeft,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
  FaComments,
} from "react-icons/fa";

interface FAQType {
  question: string;
  answer: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Animated counter hook
  const useCounterAnimation = (end: number, duration: number = 2000, shouldAnimate: boolean) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!shouldAnimate) return;

      let startTime: number | null = null;
      const startValue = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, shouldAnimate]);

    return count;
  };

  // Counter values
  const studentsCount = useCounterAnimation(10000, 2000, hasAnimated);
  const successRate = useCounterAnimation(95, 2000, hasAnimated);
  const facultyCount = useCounterAnimation(50, 2000, hasAnimated);
  const hoursCount = useCounterAnimation(500, 2000, hasAnimated);

  // Fetch FAQs from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/FAQs")
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Failed to fetch FAQs:", err));
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  // Intersection Observer to trigger animation when stats section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CA Final Cleared",
      image: "👩‍💼",
      text: "The structured approach and expert faculty helped me clear CA Final in my first attempt. The study material and doubt-solving sessions were exceptional!",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      role: "CA Inter Topper",
      image: "👨‍💼",
      text: "I scored 87% in CA Inter thanks to their comprehensive courses. The revision classes and test series were game-changers for my preparation.",
      rating: 5,
    },
    {
      name: "Ananya Desai",
      role: "CA Foundation Rank Holder",
      image: "👩‍🎓",
      text: "Starting my CA journey here was the best decision. The faculty's dedication and personalized attention made complex topics easy to understand.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: <FaGraduationCap />,
      title: "Expert Faculty",
      description: "Learn from experienced CA professionals and industry experts",
      color: "bg-blue-500",
    },
    {
      icon: <FaChartLine />,
      title: "Proven Results",
      description: "95% success rate with our comprehensive study programs",
      color: "bg-green-500",
    },
    {
      icon: <FaLaptop />,
      title: "Online & Offline",
      description: "Flexible learning modes to suit your schedule",
      color: "bg-purple-500",
    },
    {
      icon: <FaBook />,
      title: "Study Material",
      description: "Updated content aligned with latest ICAI syllabus",
      color: "bg-orange-500",
    },
  ];

  const stats = [
    { number: studentsCount, label: "Students Enrolled", icon: <FaUsers />, suffix: "+" },
    { number: successRate, label: "Success Rate", icon: <FaTrophy />, suffix: "%" },
    { number: facultyCount, label: "Expert Faculty", icon: <FaCertificate />, suffix: "+" },
    { number: hoursCount, label: "Hours of Content", icon: <FaBook />, suffix: "+" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center z-10">
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full animate-bounce">
              🎓 India's #1 CA Exam Preparation Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Journey to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              CA Success{" "}
            </span>
            Starts Here
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Master CA Foundation, Intermediate & Final with India's top educators.
            Join 10,000+ successful students who achieved their dreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate("/products")}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              Explore Courses
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <button
              onClick={() => navigate("/courses")}
              className="px-8 py-4 bg-white text-gray-800 text-lg font-bold rounded-full border-2 border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <FaPlay className="text-blue-600" />
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>ICAI Approved Content</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Live Doubt Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl text-white mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our comprehensive CA preparation programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete CA Preparation Package
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to crack CA exams in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Foundation */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-t-4 border-blue-500">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  CA Foundation
                </h3>
                <p className="text-blue-100">Start your CA journey</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Comprehensive video lectures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Practice question bank</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Mock tests & analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Study material PDF</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View Courses
                </button>
              </div>
            </div>

            {/* Intermediate */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-t-4 border-purple-500">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    CA Intermediate
                  </h3>
                  <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
                <p className="text-purple-100">Level up your preparation</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Expert faculty classes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Revision & crash courses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Test series with rankings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Doubt clearing sessions</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300"
                >
                  View Courses
                </button>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-t-4 border-orange-500">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  CA Final
                </h3>
                <p className="text-orange-100">Master the final challenge</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Advanced topic coverage</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Case studies & practical</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Exam strategy sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Industry insights</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300"
                >
                  View Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our successful CA students
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <FaQuoteLeft className="text-blue-300 text-4xl mb-6" />
              
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-blue-600 font-medium">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your CA Journey?
          </h2>
          <p className="text-xl text-white mb-10 opacity-90">
            Join thousands of successful students. Start learning today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 bg-white text-blue-600 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Browse All Courses
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Sign Up Free
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white text-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our courses and platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md transition-all duration-300 ease-in-out
                  ${openFAQIndex === index ? "bg-blue-50 shadow-lg" : "bg-white hover:shadow-lg"}`}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3
                    className={`text-lg md:text-xl font-semibold transition-colors duration-200
                    ${openFAQIndex === index ? "text-blue-800" : "text-gray-800"}`}
                  >
                    {faq.question}
                  </h3>
                  {openFAQIndex === index ? (
                    <FaChevronUp className="text-blue-600 ml-4 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-500 ml-4 flex-shrink-0" />
                  )}
                </button>

                {openFAQIndex === index && (
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EduHub CA
          </div>
          <p className="text-gray-400 mb-6">
            Your trusted partner in CA exam preparation
          </p>
          <div className="mt-8 text-gray-500 text-sm">
            © 2025 EduHub CA. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Fixed Community Widget - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/community")}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-3"
          title="Join Community"
        >
          <FaComments className="text-2xl" />
          <span className="font-semibold pr-2 hidden group-hover:inline-block">
            Community
          </span>
        </button>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}