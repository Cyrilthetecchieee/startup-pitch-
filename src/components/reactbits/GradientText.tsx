import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number; // seconds
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#CCFF00', '#A6D900', '#00E5FF', '#CCFF00'],
  animationSpeed = 4,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `gradientMove ${animationSpeed}s linear infinite`,
  };

  return (
    <>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <span style={gradientStyle} className={`inline-block font-extrabold ${className}`}>
        {children}
      </span>
    </>
  );
};
