"use client";

import { useState } from "react";
import GameWheel from "@/components/GameWheel";
import BettingPanel from "@/components/BettingPanel";
import GameHistory from "@/components/GameHistory";
import { calculateResult } from "@/lib/gameLogic";

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
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="gradient-border mb-4">
          <div className="content flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="text-xs text-gray-400">Games / Mines</div>
              <h1 className="text-2xl font-bold">Crazy times</h1>
            </div>
            <div className="gradient-border">
            <div className="bg-[#1e0936] rounded-sm p-2 flex items-center mt-2 md:mt-0">
              <span className="text-white">{balance.toFixed(10)}</span>
              <span className="ml-1 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">$</span>
            </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="w-full flex flex-col md:flex-row gap-7">
          {/* Betting Panel */}
          <div className="w-full md:w-[30%]">
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
          <div className="w-full md:w-[70%] p-5 bg-[#290023] border border-[#333947] rounded-xl overflow-hidden">
            <GameWheel 
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



