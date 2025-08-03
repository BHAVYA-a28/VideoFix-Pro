import React from 'react';

const DanceAnimation: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        opacity: 0.8
      }}
    />
  );
};

export default DanceAnimation; 