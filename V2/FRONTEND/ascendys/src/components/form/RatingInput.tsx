import { useState } from "react";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  label?: string;
  disabled?: boolean;
}

export default function RatingInput({
  value,
  onChange,
  maxRating = 5,
  label,
  disabled = false,
}: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating !== null ? hoverRating : value;

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(maxRating)].map((_, index) => {
            const rating = index + 1;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleClick(rating)}
                onMouseEnter={() => handleMouseEnter(rating)}
                onMouseLeave={handleMouseLeave}
                disabled={disabled}
                className={`transition ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
              >
                <svg
                  className={`size-8 ${
                    rating <= displayRating
                      ? "fill-warning-500 text-warning-500"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayRating} / {maxRating}
        </span>
      </div>
    </div>
  );
}
