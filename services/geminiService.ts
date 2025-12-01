import { GoogleGenAI, Type } from "@google/genai";
import { VehicleData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const decodeVin = async (vin: string): Promise<VehicleData> => {
  const modelId = "gemini-2.5-flash";

  // Prompt designed to be EXHAUSTIVE regarding Standard Equipment
  const prompt = `
    Role: Expert Automotive Product Manager & VIN Decoder.
    Task: Decode the VIN and generate a COMPLETE, CATALOG-STYLE FACTORY BUILD SHEET.
    
    VIN: ${vin}

    CRITICAL INSTRUCTIONS:

    1. **VIN & Generation Check (Digit 10):**
       - Analyze the 10th digit to identify the exact Model Year.
       - Ensure the Model Generation matches that year (e.g., Opel Corsa D vs E vs F).
       - VIN Year Codes: A=2010, B=2011, C=2012, D=2013... L=2020, M=2021, N=2022, P=2023.

    2. **COMPREHENSIVE STANDARD EQUIPMENT (MAIN PRIORITY):**
       - Do not summarize. You must list **EVERY SINGLE STANDARD FEATURE** available for this specific Trim Level (Ausstattungslinie).
       - **Be Granular:** Instead of "Airbags", write "Driver & Passenger Airbags, Side Airbags, Curtain Airbags". Instead of "Power Windows", write "Electric windows front with express up/down".
       - **Categories:** You MUST populate the following categories with at least 4-8 items each if applicable:
         - "Safety & Security" (ABS, ESP, Airbags, Isofix, TPMS...)
         - "Interior & Comfort" (Seats, Climate, Steering wheel, Storage...)
         - "Infotainment & Electronics" (Radio, Speakers, Connectivity, Display...)
         - "Exterior & Lighting" (Wheels, Headlights, Mirrors, Bumpers...)
         - "Mechanics & Performance" (Brakes, Suspension, Steering...)

    3. **Technical Data:**
       - Use factory specifications for the exact engine found in this VIN.

    4. **Optional Equipment:**
       - List common option packages that are popular for this specific model (e.g. "Winter Package", "Innovation Package").

    Output Schema: JSON only.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vin: { type: Type.STRING },
          make: { type: Type.STRING },
          model: { type: Type.STRING, description: "Full Model Name with Generation (e.g. Opel Corsa D 1.4)" },
          year: { type: Type.INTEGER },
          trimLevel: { type: Type.STRING, description: "Trim Line (e.g. Innovation, Satellite, GS Line)" },
          bodyType: { type: Type.STRING },
          summary: { type: Type.STRING },
          technicalData: {
            type: Type.OBJECT,
            properties: {
              engineType: { type: Type.STRING },
              displacement: { type: Type.STRING },
              horsepower: { type: Type.INTEGER },
              kilowatts: { type: Type.INTEGER },
              torque: { type: Type.STRING },
              fuelType: { type: Type.STRING },
              transmission: { type: Type.STRING },
              drivetrain: { type: Type.STRING },
              topSpeed: { type: Type.STRING },
              acceleration: { type: Type.STRING },
              fuelConsumption: { type: Type.STRING },
              co2Emissions: { type: Type.STRING },
            }
          },
          standardEquipment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          optionalEquipment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data received from AI service.");
  }

  try {
    const rawData = JSON.parse(text);
    // Robust parsing with defaults
    const techData = rawData.technicalData || {};

    const safeData: VehicleData = {
      vin: rawData.vin || vin,
      make: rawData.make || "Unknown Make",
      model: rawData.model || "Unknown Model",
      year: rawData.year || 0,
      trimLevel: rawData.trimLevel || "Standard",
      bodyType: rawData.bodyType || "Sedan",
      summary: rawData.summary || `Decoded info for ${vin}`,
      technicalData: {
        engineType: techData.engineType || "N/A",
        displacement: techData.displacement || "N/A",
        horsepower: techData.horsepower || 0,
        kilowatts: techData.kilowatts || 0,
        torque: techData.torque || "N/A",
        fuelType: techData.fuelType || "Petrol",
        transmission: techData.transmission || "Manual",
        drivetrain: techData.drivetrain || "FWD",
        topSpeed: techData.topSpeed || "N/A",
        acceleration: techData.acceleration || "N/A",
        fuelConsumption: techData.fuelConsumption || "N/A",
        co2Emissions: techData.co2Emissions || "N/A",
      },
      standardEquipment: Array.isArray(rawData.standardEquipment) ? rawData.standardEquipment : [],
      optionalEquipment: Array.isArray(rawData.optionalEquipment) ? rawData.optionalEquipment : [],
    };

    return safeData;
  } catch (e) {
    console.error("JSON Parsing Error:", e);
    throw new Error("Failed to process vehicle data.");
  }
};