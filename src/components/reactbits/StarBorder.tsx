import React from 'react';

interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  children,
  className = '',
  color = '#CCFF00',
  speed = '4s',
  ...props
}) => {
  return (
    <div
      className={`relative inline-block overflow-hidden rounded-xl p-[1.5px] ${className}`}
      {...props}
    >
      <div
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 340deg, ${color} 360deg)`,
          animationDuration: speed,
        }}
      />
      <div className="relative rounded-[11px] bg-dark-card">
        {children}
      </div>
    </div>
  );
};
