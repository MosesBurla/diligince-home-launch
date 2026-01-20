import React from 'react';

export const PricingHeroBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,64%,23%,0.03)] via-transparent to-[hsl(210,64%,23%,0.02)]" />

      {/* Animated dot grid */}
      {/* <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(210, 64%, 23%) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          animation: 'grid-pulse 6s ease-in-out infinite'
        }}
      /> */}

      {/* Gradient orbs */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(210, 64%, 23%, 0.08) 0%, transparent 70%)',
          animation: 'orb-pulse 8s ease-in-out infinite'
        }}
      />
      <div
        className="absolute top-1/2 -left-20 w-60 h-60 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(210, 64%, 23%, 0.06) 0%, transparent 70%)',
          animation: 'orb-pulse 10s ease-in-out infinite 2s'
        }}
      />
      <div
        className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(210, 64%, 23%, 0.05) 0%, transparent 70%)',
          animation: 'orb-pulse 12s ease-in-out infinite 4s'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[hsl(210,64%,23%)]"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.1 + (i % 3) * 0.05,
              animation: `float-particle ${10 + i * 2}s ease-in-out infinite ${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Scanline effect - subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(210, 64%, 23%, 0.1) 50%, transparent 100%)',
          backgroundSize: '100% 4px',
          animation: 'scanline 8s linear infinite'
        }}
      />

      {/* Neural network lines - SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210, 64%, 23%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(210, 64%, 23%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(210, 64%, 23%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="40%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1" style={{ animation: 'line-pulse 4s ease-in-out infinite' }} />
        <line x1="60%" y1="10%" x2="90%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" style={{ animation: 'line-pulse 4s ease-in-out infinite 1s' }} />
        <line x1="30%" y1="70%" x2="70%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1" style={{ animation: 'line-pulse 4s ease-in-out infinite 2s' }} />
        <line x1="80%" y1="30%" x2="95%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" style={{ animation: 'line-pulse 4s ease-in-out infinite 3s' }} />
      </svg>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
