"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const GameHistory = ({ gameHistory }) => {
  const [activeTab, setActiveTab] = useState("my-bet");
  const [entriesShown, setEntriesShown] = useState(10);
  
  return (
    <div className="bg-[#070005] rounded-xl overflow-hidden mt-4">
      <div className="flex border-b border-purple-900/30">
        <button
          className={cn(
            "py-2 px-4 text-sm transition-colors",
            activeTab === "my-bet"
              ? "border-b-2 border-pink-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          )}
          onClick={() => setActiveTab("my-bet")}
        >
          My Bet
        </button>
        <button
          className={cn(
            "py-2 px-4 text-sm transition-colors",
            activeTab === "game-description"
              ? "border-b-2 border-pink-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          )}
          onClick={() => setActiveTab("game-description")}
        >
          Game description
        </button>
      </div>
      
      {activeTab === "my-bet" && (
        <div>
          <div className="flex justify-between items-center p-4">
            <span className="font-medium">Game</span>
            <div className="flex items-center space-x-2">
              <select 
                className="bg-[#120521] text-white text-sm p-1 rounded border border-purple-900/30"
                value={entriesShown}
                onChange={(e) => setEntriesShown(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#120521] text-left">
                <tr>
                  <th className="py-2 px-4 font-medium">Game</th>
                  <th className="py-2 px-4 font-medium">Time</th>
                  <th className="py-2 px-4 font-medium">Bet amount</th>
                  <th className="py-2 px-4 font-medium">Multiplier</th>
                  <th className="py-2 px-4 font-medium">Payout</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.length > 0 ? (
                  gameHistory.slice(0, entriesShown).map((item) => (
                    <tr key={item.id} className="border-t border-purple-900/20 hover:bg-purple-900/10">
                      <td className="py-3 px-4">{item.game}</td>
                      <td className="py-3 px-4">{item.time}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center">
                          {item.betAmount.toFixed(10)}
                          <span className="ml-1 bg-blue-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">$</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.multiplier}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center">
                          {item.payout.toFixed(10)}
                          <span className="ml-1 bg-blue-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">$</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No game history yet. Place your first bet!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === "game-description" && (
        <div className="p-4 text-sm text-gray-300">
          <h3 className="font-medium mb-2">Crazy Times</h3>
          <p>
            Crazy Times is an exciting game of chance where you place bets on a spinning wheel. 
            Select your bet amount, risk level, and the number of segments on the wheel.
            The wheel will spin and land on a multiplier, which determines your payout.
            Higher risk levels can lead to higher multipliers but may be less likely to hit.
          </p>
          <h4 className="font-medium mt-4 mb-2">How to play:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Enter your bet amount</li>
            <li>Select your risk level (Low, Medium, High)</li>
            <li>Choose the number of segments for the wheel</li>
            <li>Click the "Bet" button to spin the wheel</li>
            <li>If the wheel lands on a multiplier, your bet amount will be multiplied accordingly</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default GameHistory;