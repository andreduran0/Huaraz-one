
import React, { useState, useEffect } from 'react';

interface HeroSliderProps {
  images: string[];
  children: React.ReactNode;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ images, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-xl">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Huaraz scenery ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          draggable={false}
        />
      ))}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default HeroSlider;