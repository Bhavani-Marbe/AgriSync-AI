export type UserRole = 'FARMER' | 'FARM_MANAGER' | 'AGRONOMIST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  areaAcres: number;
  soilType: 'Black Cotton' | 'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Red Loam' | 'Alluvial';
  waterSource: 'Borewell' | 'Canal' | 'Rainfed' | 'Drip Irrigation' | 'River';
  currentCrop?: string;
  cropHistory: { year: number; crop: string; yieldTons: number }[];
  soilHealth: {
    nitrogen: number; // kg/ha
    phosphorus: number; // kg/ha
    potassium: number; // kg/ha
    ph: number;
    organicCarbon: number; // %
  };
}

export interface CropRecommendationRequest {
  temperature: number;
  humidity: number;
  rainfall: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  location: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Whole Year';
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

export interface CropRecommendationResult {
  recommendedCrop: string;
  confidenceScore: number;
  alternativeCrops: { crop: string; confidence: number; yieldEstimate: string }[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedYieldTonsPerAcre: number;
  profitEstimationINRPerAcre: number;
  explainableAI: {
    primaryReason: string;
    advantages: string[];
    possibleRisks: string[];
    featureImportances: FeatureImportance[];
    soilSuitability: string;
    climateFit: string;
  };
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  cause: string;
  symptoms: string[];
  treatment: string[];
  medicines: { name: string; dosage: string; type: string }[];
  prevention: string[];
  nearbySupport: { name: string; contact: string; distanceKm: number; address: string }[];
}

export interface SmartIrrigationRecommendation {
  waterQuantityLitersPerAcre: number;
  recommendedTimeOfDay: string;
  irrigationFrequencyDays: number;
  nextScheduledDate: string;
  weatherAdjustments: string;
  moistureDeficitPercentage: number;
  actionRequired: boolean;
}

export interface FertilizerRecommendation {
  targetCrop: string;
  deficienciesDetected: string[];
  recommendedFertilizers: {
    name: string;
    quantityKgPerAcre: string;
    timing: string;
    method: string;
  }[];
  applicationSchedule: { day: string; task: string; details: string }[];
  scientificReasoning: string;
}

export interface WeatherData {
  city: string;
  currentTemp: number;
  condition: string;
  humidity: number;
  windSpeedKmH: number;
  rainProbabilityPercent: number;
  uvIndex: number;
  forecast7Days: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProb: number;
  }[];
  farmingSuggestions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
}

export interface MarketPriceTrend {
  crop: string;
  currentPricePerQuintalINR: number;
  priceChange24hPercent: number;
  historicalPrices: { date: string; price: number }[];
  bestSellingTime: string;
  demandStatus: 'HIGH' | 'MODERATE' | 'LOW';
  nearbyMarkets: { marketName: string; priceINR: number; distanceKm: number }[];
  forecastNextMonth: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'WEATHER' | 'DISEASE' | 'MARKET' | 'HARVEST' | 'IRRIGATION' | 'SCHEME';
  timestamp: string;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface SystemMetric {
  cpuUsagePercent: number;
  ramUsageMB: number;
  activeCeleryWorkers: number;
  redisCacheHitRatePercent: number;
  averageLatencyMs: number;
  totalPredictionsCount: number;
}
