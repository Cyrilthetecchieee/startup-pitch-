import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number; // seconds
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${
        disabled
          ? 'text-gray-300'
          : 'bg-gradient-to-r from-gray-400 via-lime-400 to-gray-400 bg-[length:200%_100%] animate-[shine_4s_linear_infinite]'
      } ${className}`}
      style={{ animationDuration }}
    >
      <style>{`
        @keyframes shine {
          0% { background-position: 100% }
          100% { background-position: -100% }
        }
      `}</style>
      {text}
    </span>
  );
};
