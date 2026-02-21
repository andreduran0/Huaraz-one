
import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ value, size = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 1 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [value, size]);

  return <canvas ref={canvasRef} className="rounded-md shadow-lg" />;
};

export default QrCodeGenerator;