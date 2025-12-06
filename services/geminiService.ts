import { GoogleGenAI } from "@google/genai";
import { GameState, Upgrade } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY is missing. Gemini features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export const getEnergyAdvice = async (gameState: GameState, availableUpgrades: Upgrade[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Advisor is offline (Missing API Key).";

  const systemInstruction = `
    You are an expert Australian Energy Consultant for a home energy simulation game. 
    You have access to the latest Australian Government energy policies, specifically focusing on Victoria (Melbourne).
    
    Key Knowledge Base:
    1. **Solar Homes Program**: Offers rebates (approx $1400) for solar PV and interest-free loans.
    2. **STCs (Small-scale Technology Certificates)**: Point-of-sale discount already factored into most solar prices, but worth mentioning as a government incentive.
    3. **Feed-in Tariffs (FiT)**: Currently low (approx 5c/kWh), meaning self-consumption is financially better than exporting.
    4. **Electrification**: Replacing gas with efficient electric appliances (Heat Pumps, Reverse Cycle A/C) is a key government strategy.
    5. **Battery Rebates**: Occasional state-based incentives to support grid stability.

    Your advice should always consider the financial return (ROI) and environmental impact (CO2 reduction).
  `;

  const prompt = `
    Analyze the following game state and provide a strategic recommendation (max 3 sentences).

    Current House State:
    - Cash Available: $${gameState.money.toFixed(2)}
    - Solar Capacity: ${gameState.solarCapacity} kW
    - Battery Capacity: ${gameState.batteryCapacity} kWh
    - Daily Average Load: ${gameState.baseConsumption * 24} kWh
    - CO2 Saved: ${gameState.co2Saved.toFixed(1)} kg
    - Total Government Subsidies Claimed: $${gameState.subsidySavings}
    
    Available Upgrades in Store:
    ${availableUpgrades.filter(u => !gameState.inventory.includes(u.id)).map(u => `- ${u.name} ($${u.cost}): ${u.description}`).join('\n')}

    Guidance:
    - If the user has low solar, prioritize solar (mentioning the rebate).
    - If the user has solar but no battery, check if they can afford a battery to soak up excess day generation (mentioning grid independence).
    - If they have older appliances, suggest heat pumps (mentioning efficiency grants).
    - Reference specific Australian contexts like "taking advantage of the sunny Australian climate" or "beating the high grid prices".
    - If the user has claimed subsidies, validate their good use of government funds.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "I couldn't generate advice right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The energy grid is noisy today. I couldn't reach the advice server.";
  }
};