import api from './api';

export interface Farm {
  id: string;
  owner: string;
  owner_name: string;
  name: string;
  description?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  total_area_hectares: number;
  is_active: boolean;
  fields: Field[];
  created_at: string;
  updated_at: string;
}

export interface Field {
  id: string;
  farm: string;
  name: string;
  area_hectares: number;
  current_crop?: string;
  soil_type: 'CLAY' | 'SANDY' | 'LOAM' | 'SILT' | 'PEAT' | 'CHALKY';
  irrigation_type: 'DRIP' | 'SPRINKLER' | 'CENTER_PIVOT' | 'FLOOD' | 'RAINFED';
  status: 'ACTIVE' | 'FALLOW' | 'PREPARATION' | 'HARVESTED';
  boundary_coordinates?: Record<string, any>;
  soil_records?: SoilRecord[];
  crop_histories?: CropHistory[];
  created_at: string;
}

export interface SoilRecord {
  id: string;
  field: string;
  sampled_at: string;
  ph_level: number;
  nitrogen_mg_kg: number;
  phosphorus_mg_kg: number;
  potassium_mg_kg: number;
  organic_matter_percentage: number;
  moisture_percentage: number;
  electrical_conductivity: number;
  health_score: number;
  recommendations?: string;
  created_at: string;
}

export interface CropHistory {
  id: string;
  field: string;
  crop_name: string;
  variety?: string;
  planting_date: string;
  harvest_date?: string;
  yield_tonnes_per_hectare?: number;
  season?: string;
  notes?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const farmService = {
  async getFarms(search?: string): Promise<PaginatedResponse<Farm>> {
    const params = search ? { search } : {};
    const response = await api.get<PaginatedResponse<Farm>>('/platform/farms/', { params });
    return response.data;
  },

  async getFarm(id: string): Promise<Farm> {
    const response = await api.get<Farm>(`/platform/farms/${id}/`);
    return response.data;
  },

  async createFarm(data: Partial<Farm>): Promise<Farm> {
    const response = await api.post<Farm>('/platform/farms/', data);
    return response.data;
  },

  async updateFarm(id: string, data: Partial<Farm>): Promise<Farm> {
    const response = await api.put<Farm>(`/platform/farms/${id}/`, data);
    return response.data;
  },

  async getFields(farmId?: string): Promise<PaginatedResponse<Field>> {
    const params = farmId ? { farm: farmId } : {};
    const response = await api.get<PaginatedResponse<Field>>('/platform/fields/', { params });
    return response.data;
  },

  async createField(data: Partial<Field>): Promise<Field> {
    const response = await api.post<Field>('/platform/fields/', data);
    return response.data;
  },

  async getSoilRecords(fieldId?: string): Promise<PaginatedResponse<SoilRecord>> {
    const params = fieldId ? { field: fieldId } : {};
    const response = await api.get<PaginatedResponse<SoilRecord>>('/platform/soil-records/', { params });
    return response.data;
  },

  async createSoilRecord(data: Partial<SoilRecord>): Promise<SoilRecord> {
    const response = await api.post<SoilRecord>('/platform/soil-records/', data);
    return response.data;
  },

  async getFarmAnalytics(farmId: string): Promise<Record<string, any>> {
    const response = await api.get<Record<string, any>>(`/platform/farms/${farmId}/analytics/`);
    return response.data;
  },
};
