"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const BettingPanel = ({
  betAmount,
  setBetAmount,
  balance,
  gameMode,
  setGameMode,
  risk,
  setRisk,
  segments,
  setSegments,
  placeBet,
  isSpinning
}) => {
  const [inputValue, setInputValue] = useState('0');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setBetAmount(parseFloat(value) || 0);
  };

  const handleMultiplier = (multiplier) => {
    const newAmount = Math.min(balance, Math.max(0, betAmount * multiplier));
    setBetAmount(newAmount);
    setInputValue(newAmount.toString());
  };

  const [numberOfBets, setNumberOfBets] = useState(10);
  const [winIncrease, setWinIncrease] = useState(0);
  const [lossIncrease, setLossIncrease] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [autoBetRunning, setAutoBetRunning] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [initialBetAmount, setInitialBetAmount] = useState(betAmount);

  const handleAutoBetStart = async () => {
    if (autoBetRunning) return;

    setAutoBetRunning(true);
    setInitialBetAmount(betAmount);
    let currentBet = betAmount;
    let totalProfitTemp = 0;

    for (let i = 0; i < numberOfBets; i++) {
      if (!autoBetRunning) break;
      
      const result = await placeBet(currentBet); // expect { win: boolean, profit: number }
      totalProfitTemp += result.profit;
      setTotalProfit(totalProfitTemp);

      // Stop conditions
      if (stopProfit > 0 && totalProfitTemp >= stopProfit) break;
      if (stopLoss > 0 && totalProfitTemp <= -stopLoss) break;

      // Adjust next bet
      if (result.win) {
        if (parseFloat(winIncrease) > 0) {
          currentBet = currentBet * (1 + parseFloat(winIncrease) / 100);
        } else {
          currentBet = initialBetAmount;
        }
      } else {
        if (parseFloat(lossIncrease) > 0) {
          currentBet = currentBet * (1 + parseFloat(lossIncrease) / 100);
        } else {
          currentBet = initialBetAmount;
        }
      }

      // Prevent over-bet
      if (currentBet > balance) break;
      setBetAmount(currentBet);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Optional delay
    }

    setAutoBetRunning(false);
  };

  return (
    <div className="bg-[#290023] border border-[#333947] rounded-xl p-4 flex flex-col h-full">
      {/* Mode Tabs */}
      <div className="flex mb-4 bg-[#120521] rounded-lg overflow-hidden">
        <button 
          className={cn(
            "flex-1 py-2 px-4 text-center transition-colors",
            gameMode === "manual" ? "bg-[#1e0936] text-white" : "text-gray-400"
          )}
          onClick={() => setGameMode("manual")}
        >
          Manual
        </button>
        <button 
          className={cn(
            "flex-1 py-2 px-4 text-center transition-colors",
            gameMode === "auto" ? "bg-gradient-to-r from-[#F1324D] to-[#2414E3] text-white" : "text-gray-400"
          )}
          onClick={() => setGameMode("auto")}
        >
          Auto
        </button>
      </div>

      {/* Bet Amount */}
      <div className="mb-4">
        <div className="flex justify-between p-1 mb-1">
          <label className="text-sm text-white">Bet Amount</label>
          <div className="text-sm">${betAmount.toFixed(2)}</div>
        </div>
        <div className="flex w-full gradient-border">
        <div className="flex items-center w-[70%]">
          <div className="bg-[#120521] rounded-l-sm flex-1 flex items-center p-1 py-2 ">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="bg-transparent border-none outline-none w-full text-white p-1"
              placeholder="0.00000000000"
            />
            <span className="bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">$</span>
          </div>
        </div>
        <div className="flex w-[30%]">
          <button onClick={() => handleMultiplier(1 / 2)} className="flex-1 bg-[#120521] py-1 text-sm hover:bg-purple-900/20 transition-colors">1/2</button>
          <button onClick={() => handleMultiplier(2)} className="flex-1 bg-[#120521] py-1 rounded-r-sm text-sm hover:bg-purple-900/20 transition-colors">2x</button>
        </div>
        </div>
      </div>

      {/* Risk */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Risk</label>
        <div className="relative gradient-border">
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full bg-[#120521] p-2 py-3 rounded-sm appearance-none text-white pr-8 outline-none">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Segments</label>
        <div className="relative gradient-border">
          <select value={segments} onChange={(e) => setSegments(parseInt(e.target.value))} className="w-full bg-[#120521] p-2 py-3 rounded-sm appearance-none text-white pr-8 outline-none">
            <option value="3">3</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="30">30</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Number of Bets */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Numbers of bet</label>
        <div className="gradient-border">
        <input type="number" className="w-full bg-[#120521] text-white p-2 py-3 rounded-sm outline-none" value={numberOfBets} onChange={(e) => setNumberOfBets(Number(e.target.value))} />
        </div>
      </div>

      {/* On Win */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">On win</label>
        <div className="flex gradient-border">
          <div className="bg-[#09011C] p-1 rounded-sm flex w-full">
            <div className="bg-[#420039] p-1 flex items-center rounded-sm w-[60vw]">
              <button className="w-full bg-gradient-to-r from-[#F1324D] to-[#2414E3]  rounded-sm py-2 text-white text-sm">Reset</button>
              <span className="w-full items-center justify-center text-white text-right pr-3 text-sm">Increase by:</span>
            </div>
            <div className="flex items-center px-2 w-[40vw]">
              <input type="number" className="bg-transparent outline-none border-none text-white w-full text-sm" value={winIncrease} onChange={(e) => setWinIncrease(e.target.value)} />
              <span className="text-xs text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* On Loss */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">On Loss</label>
        <div className="flex gradient-border">
          <div className="bg-[#09011C] p-1 rounded-sm flex w-full">
            <div className="bg-[#420039] p-1 flex items-center rounded-sm w-[60vw]">
              <button className="w-full bg-gradient-to-r from-[#F1324D] to-[#2414E3] rounded-sm py-2 text-white text-sm">Reset</button>
              <span className="w-full items-center justify-center text-white text-right pr-3 text-sm">Increase by:</span>
            </div>
            <div className="flex items-center px-2 w-[40vw]">
              <input type="number" className="bg-transparent outline-none border-none text-white w-full text-sm" value={lossIncrease} onChange={(e) => setWinIncrease(e.target.value)} />
              <span className="text-xs text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stop on Profit */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Stop on profit</label>
        <div className="gradient-border">
        <div className="flex items-center bg-[#120521] p-2 py-3 rounded-sm">
          <input type="number" className="bg-transparent outline-none border-none text-white w-full" value={stopProfit} onChange={(e) => setStopProfit(e.target.value)} />
          <span className="ml-2 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">$</span>
        </div>
        </div>
      </div>

      {/* Stop on Loss */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Stop on Loss</label>
        <div className="gradient-border">
        <div className="flex items-center bg-[#120521] p-2 py-3 rounded-sm">
          <input type="number" className="bg-transparent outline-none border-none text-white w-full" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
          <span className="ml-2 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">$</span>
        </div>
        </div>
      </div>

      {/* Start AutoBet Button */}
      <button
        onClick={handleAutoBetStart}
        disabled={isSpinning || betAmount <= 0 || betAmount > balance}
        className={`py-3 mt-4 rounded-lg text-center font-semibold transition-all w-full ${
          isSpinning || betAmount <= 0 || betAmount > balance
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#F1324D] to-[#2414E3] text-white hover:from-[#e82f49] hover:to-[#2112e1]"
        }`}
      >
        Start Autobet
      </button>
    </div>
  );
};

export default BettingPanel;