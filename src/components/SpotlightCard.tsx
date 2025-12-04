import { useRef } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard = ({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(6, 182, 212, 0.15)' 
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const updateSpotlightPosition = (x: number, y: number) => {
    if (!divRef.current) return;
    
    const rect = divRef.current.getBoundingClientRect();
    const posX = x - rect.left;
    const posY = y - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${posX}px`);
    divRef.current.style.setProperty('--mouse-y', `${posY}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSpotlightPosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateSpotlightPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateSpotlightPosition(touch.clientX, touch.clientY);
    }
  };

  return (
    <div 
      ref={divRef} 
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`card-spotlight ${className}`}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;

