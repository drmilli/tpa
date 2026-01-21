import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Politician {
  id: string;
  firstName: string;
  lastName: string;
  partyAffiliation: string;
  performanceScore: number;
}

interface PoliticianState {
  politicians: Politician[];
  selectedPolitician: Politician | null;
  filters: {
    state?: string;
    party?: string;
    office?: string;
  };
}

const initialState: PoliticianState = {
  politicians: [],
  selectedPolitician: null,
  filters: {},
};

const politicianSlice = createSlice({
  name: 'politician',
  initialState,
  reducers: {
    setPoliticians: (state, action: PayloadAction<Politician[]>) => {
      state.politicians = action.payload;
    },
    setSelectedPolitician: (state, action: PayloadAction<Politician | null>) => {
      state.selectedPolitician = action.payload;
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
  },
});

export const { setPoliticians, setSelectedPolitician, setFilters } = politicianSlice.actions;
export default politicianSlice.reducer;
