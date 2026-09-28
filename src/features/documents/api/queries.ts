import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments, uploadDocument } from './requests';
import type { DocumentSummary } from '@/types';

export const documentsKey = ['documents'] as const;

const isProcessing = (docs: DocumentSummary[] | undefined) =>
  !!docs?.some((d) => d.status === 'PENDING' || d.status === 'PROCESSING');

export function useDocuments() {
  return useQuery({
    queryKey: documentsKey,
    queryFn: getDocuments,
    refetchInterval: (query) => (isProcessing(query.state.data) ? 2500 : false),
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey }),
  });
}