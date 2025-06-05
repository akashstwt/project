"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import arrow from "../public/arrow.svg";

const GameWheel = ({
  isSpinning,
  segments,
  currentMultiplier,
  targetMultiplier,
  handleSelectMultiplier,
  wheelPosition,
  setWheelPosition
}) => {
  const canvasRef = useRef(null);
  
  // Multiplier options
  const multipliers = [0.00, 1.50, 1.70, 2.00, 3.00, 4.00];
  
  // Colors for wheel segments
  const segmentColors = [
    "#333947", // green
    "#00E403", // yellow
    "#D9D9D9", // gray
    "#FDE905", // orange
    "#7F46FD", // purple
    "#FCA32F", // white
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight) - 40;
    canvas.width = size;
    canvas.height = size;
    
    // Draw wheel
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save the current context state
    ctx.save();
    
    // Move to center and rotate the entire wheel
    ctx.translate(centerX, centerY);
    ctx.rotate(-wheelPosition); // Negative for clockwise rotation
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    const segmentAngle = (Math.PI * 2) / segments;
    
    for (let i = 0; i < segments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.arc(centerX, centerY, radius * 0.93, endAngle, startAngle, true);
      ctx.closePath();

      
      ctx.fillStyle = segmentColors[i % segmentColors.length];
      ctx.fill();
    }
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = "#333947"; // Optional outline
    ctx.stroke();

    
    // Restore the context to draw the pointer without rotation
    ctx.restore();
    
  }, [segments, wheelPosition]);

  // Render wheel rotation animation
  useEffect(() => {
    if (!isSpinning || !canvasRef.current) return;
    
    let startTime = null;
    let rafId = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Duration of spin in milliseconds
      const duration = 3000;
      
      if (elapsed < duration) {
        // Calculate rotation based on time
        const progress = elapsed / duration;
        const rotations = 5; // Number of full rotations
        
        // Ease out toward the end
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const rotationAngle = (rotations * Math.PI * 2 * easeOut(progress));
        
        setWheelPosition(rotationAngle);
        rafId = requestAnimationFrame(animate);
      }
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isSpinning, setWheelPosition]);

  return (
    <div className="flex flex-col justify-between items-center h-full w-full">
      <div className="relative flex h-[435px] w-[600px] md:h-[625px] md:w-[600px] items-center justify-center p-4">

        <Image
          src={arrow}
          width={50}
          height={50}
          alt="Pointer Arrow"
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        />           
        <canvas 
          ref={canvasRef} 
          className={cn(
            "max-w-[85vw] max-h-[85vh] rounded-full pt-4 p-2 bg-[#0A0009] transition-transform",
            isSpinning && "animate-pulse"
          )}
        />
        
        {currentMultiplier > 0 && !isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-white animate-bounce">
              {currentMultiplier.toFixed(2)}x
            </div>
          </div>
        )}
      </div>
      
      <div className="flex w-full gap-3 p-2">
        {multipliers.map((multiplier) => {
          const isSelected = targetMultiplier === multiplier;

          const colorMap = {
            0.0: "#333947",
            1.5: "#00E403",
            1.7: "#D9D9D9",
            2.0: "#FDE905",
            3.0: "#7F46FD",
            4.0: "#FCA32F",
          };

          const bgColor = colorMap[multiplier] || "#333947";

          return (
            <button
              key={multiplier}
              onClick={() => handleSelectMultiplier(multiplier)}
              className=
                "flex flex-col justify-end items-center h-[60px] w-full rounded-md text-sm font-medium border bg-[#0A0009] border-[#333947] transition-all"
                style={isSelected ? { backgroundColor: bgColor } : {}}
            >
              <span className="text-white pb-2">
                {multiplier.toFixed(2)}x
              </span>
              <div
                className="w-full h-3 rounded-b-md"
                style={{ backgroundColor: bgColor }}
              ></div>
            </button>
          );
        })}
      </div>

    </div>
  );
};


export default GameWheel;