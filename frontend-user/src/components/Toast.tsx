import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, duration = 2000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[60] transition-all duration-300 ${
        isVisible ? "animate-slide-up opacity-100" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 overflow-hidden min-w-[320px] max-w-md">
        {/* Content */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <p className="text-gray-800 font-medium flex-1">{message}</p>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Progress bar with smooth animation */}
        <div className="h-1 bg-gray-200 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 origin-left"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      {/* Keyframe animation for smooth progress bar */}
      <style>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
