export interface FinancialRecord {
  id?: number;
  section: string;
  item: string;
  period1: number | null;
  period2: number | null;
  period3: number | null;
  period4: number | null;
  created_at: string;
  updated_at: string;
}

export interface ImportedFile {
  id?: number;
  filename: string;
  file_size: number;
  upload_date: string;
  record_count: number;
  status: "pending" | "imported" | "error";
}

export interface DatabaseState {
  records: FinancialRecord[];
  importHistory: ImportedFile[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface ImportResult {
  success: boolean;
  recordCount: number;
  message: string;
  error?: string;
}
