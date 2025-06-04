// Game mechanics and calculation functions

const multipliersByRisk = {
  low: [1.00, 1.20, 1.50, 1.70, 2.00],
  medium: [1.00, 1.50, 2.00, 3.00, 4.00],
  high: [1.00, 2.00, 3.00, 5.00, 10.00]
};

// Probabilities for each risk level (must sum to 1)
const probabilities = {
  low: [0.45, 0.30, 0.15, 0.07, 0.03],
  medium: [0.40, 0.25, 0.20, 0.10, 0.05],
  high: [0.50, 0.25, 0.15, 0.07, 0.03]
};

/**
 * Calculate game result based on risk level and segments
 */
export const calculateResult = (risk, segments) => {
  // Get the appropriate multipliers array based on risk
  const availableMultipliers = multipliersByRisk[risk];
  const probabilitiesForRisk = probabilities[risk];
  
  // Random number between 0 and 1
  const random = Math.random();
  
  // Determine the multiplier based on probability
  let cumulativeProbability = 0;
  let selectedIndex = 0;
  
  for (let i = 0; i < probabilitiesForRisk.length; i++) {
    cumulativeProbability += probabilitiesForRisk[i];
    
    if (random <= cumulativeProbability) {
      selectedIndex = i;
      break;
    }
  }
  
  const multiplier = availableMultipliers[selectedIndex];
  
  // Calculate wheel position
  // This would be a random position for the wheel to spin to
  const segmentAngle = (Math.PI * 2) / segments;
  const randomSegment = Math.floor(Math.random() * segments);
  const position = randomSegment * segmentAngle;
  
  return {
    multiplier,
    position
  };
};

/**
 * Validate bet amount
 */
export const validateBet = (amount, balance) => {
  return amount > 0 && amount <= balance;
};

/**
 * Format currency for display
 */
export const formatCurrency = (value) => {
  return value.toFixed(10);
};