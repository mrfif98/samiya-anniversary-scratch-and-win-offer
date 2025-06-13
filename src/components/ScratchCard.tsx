
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScratchCardProps {
  gift: string;
  giftIcon: string;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ gift, giftIcon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up the scratch surface
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add scratch instruction text
    ctx.fillStyle = '#666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2);
    
    // Set up scratch effect
    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const getMousePos = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(canvas, e);
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Check if enough has been scratched
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] === 0) {
        transparentPixels++;
      }
    }

    const scratchedPercentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    
    if (scratchedPercentage > 50 && !isRevealed) {
      setIsRevealed(true);
      // Clear the entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.nativeEvent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching && !isRevealed) {
      scratch(e.nativeEvent);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    scratch(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isScratching && !isRevealed) {
      scratch(e.nativeEvent);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(false);
  };

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">{giftIcon}</div>
            <div className="font-bold text-lg text-gray-800">{gift}</div>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={300}
          height={120}
          className="block cursor-pointer rounded-lg shadow-lg"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      {isRevealed && (
        <Card className="mt-4 bg-gradient-to-br from-green-100 to-green-200 border-green-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🎉 Congratulations! 🎉</div>
            <div className="font-bold text-lg text-green-800">You won: {gift}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScratchCard;
