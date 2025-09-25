import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showCount = false 
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
          disabled={readonly}
        >
          <FaStar
            className={`${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
      {showCount && (
        <span className="ml-2 text-sm text-gray-500">
          ({rating}/5)
        </span>
      )}
    </div>
  );
}
