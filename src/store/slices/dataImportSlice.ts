import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ImportedFile } from "@/db/database";

export interface DataImportState {
  selectedFile: ImportedFile | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataImportState = {
  selectedFile: null,
  loading: false,
  error: null,
};

const dataImportSlice = createSlice({
  name: "dataImport",
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<ImportedFile | null>) => {
      state.selectedFile = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
      state.error = null;
    },
  },
});

export const { setSelectedFile, setLoading, setError, clearSelectedFile } = dataImportSlice.actions;

export default dataImportSlice.reducer;
