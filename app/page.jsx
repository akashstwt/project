"use client";

import { useState } from "react";
import GameWheel from "@/components/GameWheel";
import BettingPanel from "@/components/BettingPanel";
import GameHistory from "@/components/GameHistory";
import { calculateResult } from "@/lib/gameLogic";
import Image from "next/image";
import coin from "../public/coin.png";


export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [risk, setRisk] = useState("medium");
  const [segments, setSegments] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameMode, setGameMode] = useState("manual");
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [targetMultiplier, setTargetMultiplier] = useState(null);
  const [wheelPosition, setWheelPosition] = useState(0);

  const placeBet = () => {
    if (betAmount <= 0 || betAmount > balance || isSpinning) return;
    
    setIsSpinning(true);
    setBalance(prev => prev - betAmount);
    
    const result = calculateResult(risk, segments);
    
    setTimeout(() => {
      setCurrentMultiplier(result.multiplier);
      setWheelPosition(result.position);
      
      setTimeout(() => {
        const winAmount = betAmount * result.multiplier;
        setBalance(prev => prev + winAmount);
        
        const newHistoryItem = {
          id: Date.now(),
          game: "Mines",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          betAmount: betAmount,
          multiplier: `${result.multiplier.toFixed(2)}x`,
          payout: winAmount
        };
        
        setGameHistory(prev => [newHistoryItem, ...prev]);
        setIsSpinning(false);
      }, 1000);
    }, 3000);
  };

  const handleSelectMultiplier = (value) => {
    setTargetMultiplier(value);
  };

  return (
    <div className="min-h-screen bg-[#070005] text-white py-4 md:py-12 px-4 md:px-24 ">
      <div className="flex flex-col space-y-5 gap-7">
        {/* Header */}
          <div className="content mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="text-sm mb-4 text-gray-400">Games / Mines</div>
              <h1 className="text-4xl ">Crazy times</h1>
            </div>
            <div className="gradient-border">
              <div className="bg-[#1e0936] rounded-sm p-2 py-4 px-5 flex items-center gap-2 mt-2 md:mt-0">
                <span className="text-white text-lg">{balance.toFixed(10)}</span>
                <Image
                  src={coin}
                  width={20}
                  height={20}
                  alt="coin"
                  className=""
                />                 
              </div>
            </div>
          </div>


        {/* Main Content */}
        <div className="w-full flex flex-col-reverse md:flex-row gap-7">
          {/* Betting Panel */}
          <div className="w-full md:w-[40%] lg:w-[30%]">
          <BettingPanel 
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            balance={balance}
            gameMode={gameMode}
            setGameMode={setGameMode}
            risk={risk}
            setRisk={setRisk}
            segments={segments}
            setSegments={setSegments}
            placeBet={placeBet}
            isSpinning={isSpinning}
          />
          </div>
          
          {/* Game Wheel */}
          <div className="w-full md:w-[60%] lg:w-[70%] p-5 bg-[#290023] border border-[#333947] rounded-3xl overflow-hidden">
            <GameWheel
              risk={risk} 
              isSpinning={isSpinning}
              segments={segments}
              currentMultiplier={currentMultiplier}
              targetMultiplier={targetMultiplier}
              handleSelectMultiplier={handleSelectMultiplier}
              wheelPosition={wheelPosition}
              setWheelPosition={setWheelPosition}
            />
          </div>
        </div>
        
        {/* Game History */}
        <GameHistory 
          gameHistory={gameHistory}
        />
      </div>
    </div>
  );
}



