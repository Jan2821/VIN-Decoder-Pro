export interface TechnicalData {
  engineType: string;
  displacement: string; // Hubraum
  horsepower: number;
  kilowatts: number;
  torque: string; // Drehmoment
  fuelType: string;
  transmission: string;
  drivetrain: string; // Antrieb
  topSpeed: string;
  acceleration: string; // 0-100
  fuelConsumption: string;
  co2Emissions: string;
}

export interface Equipment {
  category: string;
  items: string[];
}

export interface VehicleData {
  vin: string;
  make: string;
  model: string;
  year: number;
  trimLevel: string; // Ausstattungslinie
  bodyType: string;
  technicalData: TechnicalData;
  standardEquipment: Equipment[];
  optionalEquipment: Equipment[]; // Sonderausstattung
  summary: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
