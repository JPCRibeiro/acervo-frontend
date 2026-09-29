import { create } from 'zustand';
import type { SourceCitation } from '@/types';

type LastSourcesState = {
  question: string | null;
  sources: SourceCitation[];
  setLastSources: (question: string, sources: SourceCitation[]) => void;
  clear: () => void;
};

export const useLastSources = create<LastSourcesState>((set) => ({
  question: null,
  sources: [],
  setLastSources: (question, sources) => set({ question, sources }),
  clear: () => set({ question: null, sources: [] }),
}));