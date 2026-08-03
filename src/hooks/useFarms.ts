import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmService, Farm, Field, SoilRecord } from '../services/farmService';

export const useFarms = (search?: string) => {
  return useQuery({
    queryKey: ['farms', search],
    queryFn: () => farmService.getFarms(search),
  });
};

export const useFarmDetails = (farmId: string) => {
  return useQuery({
    queryKey: ['farm', farmId],
    queryFn: () => farmService.getFarm(farmId),
    enabled: !!farmId,
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Farm>) => farmService.createFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
};

export const useFields = (farmId?: string) => {
  return useQuery({
    queryKey: ['fields', farmId],
    queryFn: () => farmService.getFields(farmId),
    enabled: !!farmId,
  });
};

export const useCreateField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Field>) => farmService.createField(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fields', variables.farm] });
      queryClient.invalidateQueries({ queryKey: ['farm', variables.farm] });
    },
  });
};

export const useSoilRecords = (fieldId?: string) => {
  return useQuery({
    queryKey: ['soil-records', fieldId],
    queryFn: () => farmService.getSoilRecords(fieldId),
    enabled: !!fieldId,
  });
};

export const useCreateSoilRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SoilRecord>) => farmService.createSoilRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['soil-records', variables.field] });
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });
};
