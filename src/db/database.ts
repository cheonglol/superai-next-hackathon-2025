/* eslint-disable */
// @ts-nocheck

export interface FinancialRecord {
  id?: number;
  file_id?: number;
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

class DatabaseManager {
  private dbName = "FinancialDataDB";
  private version = 2;
  private db: IDBDatabase | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await this.openDatabase();

      // Load default data if no data exists
      await this.loadDefaultDataIfEmpty();

      this.initialized = true;
      console.log("IndexedDB initialized successfully");
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
      throw error;
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create financial_records table
        if (!db.objectStoreNames.contains("financial_records")) {
          const recordsStore = db.createObjectStore("financial_records", {
            keyPath: "id",
            autoIncrement: true,
          });
          recordsStore.createIndex("section", "section", { unique: false });
          recordsStore.createIndex("item", "item", { unique: false });
          recordsStore.createIndex("file_id", "file_id", { unique: false });
        } else {
          // Add file_id index if it doesn't exist
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          const recordsStore = transaction?.objectStore("financial_records");
          if (recordsStore && !recordsStore.indexNames.contains("file_id")) {
            recordsStore.createIndex("file_id", "file_id", { unique: false });
          }
        }

        // Create imported_files table
        if (!db.objectStoreNames.contains("imported_files")) {
          const filesStore = db.createObjectStore("imported_files", {
            keyPath: "id",
            autoIncrement: true,
          });
          filesStore.createIndex("filename", "filename", { unique: false });
          filesStore.createIndex("upload_date", "upload_date", { unique: false });
        }
      };
    });
  }

  private async loadDefaultDataIfEmpty(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Check if we have already imported default data by looking at import history
    const importHistory = await this.getImportHistory();
    const hasDefaultData = importHistory.some((file) => file.filename === "0-data.csv (default)");

    if (!hasDefaultData) {
      console.log("Loading default financial data...");
      await this.importDefaultCSVData();
    }
  }

  private async importDefaultCSVData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Default CSV data from 0-data.csv
    const defaultData = [
      { section: "Period", item: "Period Length (months)", period1: 12, period2: 12, period3: 12, period4: 12 },
      { section: "Income Statement/Profit & Loss", item: "Revenue", period1: 3400000, period2: 5000000, period3: 5800000, period4: 6612000 },
      { section: "Income Statement/Profit & Loss", item: "Gross Profit", period1: 865000, period2: 1300000, period3: 1650000, period4: 1917500 },
      { section: "Income Statement/Profit & Loss", item: "Operating Profit", period1: 360000, period2: 467000, period3: 625000, period4: 701300 },
      { section: "Income Statement/Profit & Loss", item: "Net Profit (After Tax)", period1: 195400, period2: 280000, period3: 350000, period4: 410000 },
      { section: "Other Information", item: "Depreciation & Amortisation", period1: 74000, period2: 100000, period3: 100000, period4: 100000 },
      { section: "Other Information", item: "Interest Paid", period1: 50000, period2: 100000, period3: 150000, period4: 176000 },
      { section: "Other Information", item: "Extraordinary Income/Expenses", period1: 0, period2: 0, period3: 0, period4: 0 },
      { section: "Other Information", item: "Distributions/Dividends", period1: 45400, period2: 180000, period3: 100000, period4: 150000 },
      { section: "Balance Sheet", item: "Total Assets", period1: 2700000, period2: 3600000, period3: 4450000, period4: 5014000 },
      { section: "Balance Sheet", item: "Cash", period1: 160000, period2: 75000, period3: 0, period4: 0 },
      { section: "Balance Sheet", item: "Accounts Receivable", period1: 570000, period2: 900000, period3: 1200000, period4: 1443000 },
      { section: "Balance Sheet", item: "Inventory", period1: 600000, period2: 920000, period3: 1250000, period4: 1550000 },
      { section: "Balance Sheet", item: "Total Current Assets", period1: 1500000, period2: 2100000, period3: 2500000, period4: 3064000 },
      { section: "Balance Sheet", item: "Fixed Assets", period1: 1000000, period2: 1400000, period3: 1800000, period4: 1800000 },
      { section: "Liabilities", item: "Total Liabilities", period1: 2000000, period2: 2800000, period3: 3400000, period4: 3704000 },
      { section: "Liabilities", item: "Accounts Payable", period1: 300000, period2: 450000, period3: 500000, period4: 590000 },
      { section: "Liabilities", item: "Total Current Liabilities", period1: 800000, period2: 1600000, period3: 2150000, period4: 2454000 },
      { section: "Funding", item: "Bank Loans - Current", period1: 400000, period2: 1000000, period3: 1450000, period4: 1643000 },
      { section: "Funding", item: "Bank Loans - Non Current", period1: 1000000, period2: 1200000, period3: 1200000, period4: 1200000 },
    ];

    const transaction = this.db.transaction(["financial_records", "imported_files"], "readwrite");
    const recordsStore = transaction.objectStore("financial_records");
    const filesStore = transaction.objectStore("imported_files");

    // Record the default import first to get the file ID
    const importFile: Omit<ImportedFile, "id"> = {
      filename: "0-data.csv (default)",
      file_size: 0,
      upload_date: new Date().toISOString(),
      record_count: defaultData.length,
      status: "imported",
    };
    const fileId = await this.addRecordWithId(filesStore, importFile);

    // Insert default data with file association
    for (const record of defaultData) {
      const financialRecord: Omit<FinancialRecord, "id"> = {
        ...record,
        file_id: fileId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await this.addRecord(recordsStore, financialRecord);
    }

    console.log(`Loaded ${defaultData.length} default financial records with file ID: ${fileId}`);
  }

  private addRecord(store: IDBObjectStore, record: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.add(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private addRecordWithId(store: IDBObjectStore, record: unknown): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = store.add(record);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async importCSVData(csvContent: string, filename: string, fileSize: number): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      // Parse CSV content
      const lines = csvContent.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

      // Validate CSV format
      if (headers.length < 6) {
        throw new Error("CSV must have at least 6 columns: Section, Item, Period 1, Period 2, Period 3, Period 4");
      }

      const records: Omit<FinancialRecord, "id">[] = [];

      // Skip header and section header rows, process data rows
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        if (values.length < 6) continue;

        const section = values[0];
        const item = values[1];
        const period1 = values[2] ? parseFloat(values[2]) : null;
        const period2 = values[3] ? parseFloat(values[3]) : null;
        const period3 = values[4] ? parseFloat(values[4]) : null;
        const period4 = values[5] ? parseFloat(values[5]) : null;

        if (section && item) {
          records.push({
            section,
            item,
            period1,
            period2,
            period3,
            period4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      if (records.length === 0) {
        throw new Error("No valid data rows found in CSV");
      }

      // Store the import record first to get the file ID
      const transaction = this.db.transaction(["financial_records", "imported_files"], "readwrite");
      const recordsStore = transaction.objectStore("financial_records");
      const filesStore = transaction.objectStore("imported_files");

      // Record the import
      const importFile: Omit<ImportedFile, "id"> = {
        filename,
        file_size: fileSize,
        upload_date: new Date().toISOString(),
        record_count: records.length,
        status: "imported",
      };
      const fileId = await this.addRecordWithId(filesStore, importFile);

      // Insert new records with file association
      for (const record of records) {
        const financialRecord = {
          ...record,
          file_id: fileId,
        };
        await this.addRecord(recordsStore, financialRecord);
      }

      console.log(`Successfully imported ${records.length} records from ${filename} with file ID: ${fileId}`);
      return records.length;
    } catch (error) {
      // Record failed import
      const transaction = this.db.transaction(["imported_files"], "readwrite");
      const filesStore = transaction.objectStore("imported_files");

      const importFile: Omit<ImportedFile, "id"> = {
        filename,
        file_size: fileSize,
        upload_date: new Date().toISOString(),
        record_count: 0,
        status: "error",
      };
      await this.addRecord(filesStore, importFile);

      throw error;
    }
  }

  private clearStore(store: IDBObjectStore): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFinancialRecords(): Promise<FinancialRecord[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["financial_records"], "readonly");
      const store = transaction.objectStore("financial_records");
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result as FinancialRecord[];
        // Sort records by section order
        const sectionOrder = {
          Period: 1,
          "Income Statement/Profit & Loss": 2,
          "Other Information": 3,
          "Balance Sheet": 4,
          Liabilities: 5,
          Funding: 6,
        };

        records.sort((a, b) => {
          const aOrder = sectionOrder[a.section as keyof typeof sectionOrder] || 7;
          const bOrder = sectionOrder[b.section as keyof typeof sectionOrder] || 7;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return a.item.localeCompare(b.item);
        });

        resolve(records);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getFinancialRecordsByFileId(fileId: number): Promise<FinancialRecord[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["financial_records"], "readonly");
      const store = transaction.objectStore("financial_records");
      const index = store.index("file_id");
      const request = index.getAll(fileId);

      request.onsuccess = () => {
        const records = request.result as FinancialRecord[];
        // Sort records by section order
        const sectionOrder = {
          Period: 1,
          "Income Statement/Profit & Loss": 2,
          "Other Information": 3,
          "Balance Sheet": 4,
          Liabilities: 5,
          Funding: 6,
        };

        records.sort((a, b) => {
          const aOrder = sectionOrder[a.section as keyof typeof sectionOrder] || 7;
          const bOrder = sectionOrder[b.section as keyof typeof sectionOrder] || 7;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return a.item.localeCompare(b.item);
        });

        resolve(records);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getImportHistory(): Promise<ImportedFile[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["imported_files"], "readonly");
      const store = transaction.objectStore("imported_files");
      const request = store.getAll();

      request.onsuccess = () => {
        const files = request.result as ImportedFile[];
        // Sort by upload date descending
        files.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        resolve(files);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteImportedFile(fileId: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["imported_files", "financial_records"], "readwrite");
      const filesStore = transaction.objectStore("imported_files");
      const recordsStore = transaction.objectStore("financial_records");
      const recordsIndex = recordsStore.index("file_id");

      console.log(`Starting deletion of file ID: ${fileId}`);

      // First, get all associated financial records
      const getRecordsRequest = recordsIndex.getAll(fileId);

      getRecordsRequest.onsuccess = () => {
        const records = getRecordsRequest.result as FinancialRecord[];
        console.log(`Found ${records.length} records to delete for file ID: ${fileId}`);

        if (records.length === 0) {
          // No financial records to delete, just delete the file
          const deleteFileRequest = filesStore.delete(fileId);
          deleteFileRequest.onsuccess = () => {
            console.log(`Successfully deleted import record with ID: ${fileId} (no associated records)`);
            resolve();
          };
          deleteFileRequest.onerror = () => {
            console.error(`Failed to delete file with ID: ${fileId}`, deleteFileRequest.error);
            reject(deleteFileRequest.error);
          };
          return;
        }

        // Delete all associated financial records first
        let deletedRecordsCount = 0;
        let hasError = false;

        records.forEach((record) => {
          if (record.id && !hasError) {
            const deleteRecordRequest = recordsStore.delete(record.id);

            deleteRecordRequest.onsuccess = () => {
              deletedRecordsCount++;
              console.log(`Deleted financial record ${record.id}, progress: ${deletedRecordsCount}/${records.length}`);

              // When all financial records are deleted, delete the file
              if (deletedRecordsCount === records.length) {
                const deleteFileRequest = filesStore.delete(fileId);
                deleteFileRequest.onsuccess = () => {
                  console.log(`Successfully deleted import record with ID: ${fileId} and ${deletedRecordsCount} associated financial records`);
                  resolve();
                };
                deleteFileRequest.onerror = () => {
                  console.error(`Failed to delete file with ID: ${fileId} after deleting records`, deleteFileRequest.error);
                  reject(deleteFileRequest.error);
                };
              }
            };

            deleteRecordRequest.onerror = () => {
              if (!hasError) {
                hasError = true;
                console.error(`Failed to delete financial record ${record.id}`, deleteRecordRequest.error);
                reject(deleteRecordRequest.error);
              }
            };
          }
        });
      };

      getRecordsRequest.onerror = () => {
        console.error(`Failed to get records for file ID: ${fileId}`, getRecordsRequest.error);
        reject(getRecordsRequest.error);
      };
    });
  }

  async exportToCSV(): Promise<string> {
    const records = await this.getFinancialRecords();

    const headers = ["Section", "Item", "Period 1", "Period 2", "Period 3", "Period 4"];
    const csvLines = [headers.join(",")];

    // Add subsection header row
    csvLines.push("Section,Subsection,31-Dec-21,31-Dec-22,31-Dec-23,31-Dec-24");

    for (const record of records) {
      const row = [
        `"${record.section}"`,
        `"${record.item}"`,
        record.period1?.toString() || "",
        record.period2?.toString() || "",
        record.period3?.toString() || "",
        record.period4?.toString() || "",
      ];
      csvLines.push(row.join(","));
    }

    return csvLines.join("\n");
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.initialized = false;
  }

  // Helper function to reset database (clear all data)
  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const transaction = this.db.transaction(["financial_records", "imported_files"], "readwrite");
    const recordsStore = transaction.objectStore("financial_records");
    const filesStore = transaction.objectStore("imported_files");

    await this.clearStore(recordsStore);
    await this.clearStore(filesStore);

    console.log("Database reset completed");

    // Reload default data
    await this.loadDefaultDataIfEmpty();
  }

  async debugDatabaseState(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    console.log("=== DATABASE DEBUG STATE ===");

    // Check import history
    const importHistory = await this.getImportHistory();
    console.log("Import History:");
    importHistory.forEach((file) => {
      console.log(`  - ID: ${file.id}, Filename: ${file.filename}, Records: ${file.record_count}`);
    });

    // Check all financial records
    const allRecords = await this.getFinancialRecords();
    console.log(`\nTotal Financial Records: ${allRecords.length}`);

    // Group records by file_id
    const recordsByFileId = allRecords.reduce(
      (acc, record) => {
        const fileId = record.file_id || "null";
        if (!acc[fileId]) acc[fileId] = [];
        acc[fileId].push(record);
        return acc;
      },
      {} as Record<string, FinancialRecord[]>
    );

    console.log("Records grouped by file_id:");
    Object.entries(recordsByFileId).forEach(([fileId, records]) => {
      console.log(`  - file_id ${fileId}: ${records.length} records`);
    });

    console.log("=== END DEBUG STATE ===");
  }
}

// Singleton instance
export const dbManager = new DatabaseManager();
