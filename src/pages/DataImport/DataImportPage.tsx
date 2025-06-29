/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Download, RefreshCw, Database, Calendar, TrendingUp, X, Eye, Trash2, Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { dbManager, type FinancialRecord, type ImportedFile } from "@/db/database";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedFile, clearSelectedFile } from "@/store/slices/dataImportSlice";

const DataImportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedFile: selectedImportedFile } = useAppSelector((state) => state.dataImport);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [importHistory, setImportHistory] = useState<ImportedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFileLocal] = useState<File | null>(null);
  const [loadingFileData, setLoadingFileData] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      await dbManager.initialize();
      await loadData();
    } catch (error) {
      console.error("Failed to initialize database:", error);
      setUploadStatus("error");
      setUploadMessage("Failed to initialize database");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Only load import history by default, not financial records
      // Financial records will be loaded when a file is selected
      const history = await dbManager.getImportHistory();
      setImportHistory(history);

      // Reset financial records and selected file when loading data
      setFinancialRecords([]);
      dispatch(clearSelectedFile());
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadFileData = async (file: ImportedFile) => {
    try {
      setLoadingFileData(true);
      dispatch(setSelectedFile(file));

      // Load only the records associated with this specific file
      if (file.id) {
        const records = await dbManager.getFinancialRecordsByFileId(file.id);
        setFinancialRecords(records);
      } else {
        setFinancialRecords([]);
      }
    } catch (error) {
      console.error("Failed to load file data:", error);
    } finally {
      setLoadingFileData(false);
    }
  };

  const showAllData = async () => {
    try {
      setLoadingFileData(true);
      dispatch(clearSelectedFile());

      // Clear financial records instead of loading all data
      // This ensures no data is shown when no file is selected
      setFinancialRecords([]);
    } catch (error) {
      console.error("Failed to clear data:", error);
    } finally {
      setLoadingFileData(false);
    }
  };

  const handleDeleteFile = async (file: ImportedFile) => {
    if (!file.id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${file.filename}"?\n\nThis will permanently remove the import record and all associated financial data (${file.record_count} records).`
    );

    if (!confirmDelete) return;

    try {
      setDeletingFileId(file.id);
      await dbManager.deleteImportedFile(file.id);

      // If the deleted file was selected, clear the selection
      if (selectedImportedFile?.id === file.id) {
        dispatch(clearSelectedFile());
        setFinancialRecords([]);
      }

      // Reload import history
      await loadData();

      setUploadStatus("success");
      setUploadMessage(`Successfully deleted "${file.filename}" and its ${file.record_count} associated records`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      setUploadStatus("error");
      setUploadMessage(`Failed to delete "${file.filename}": ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((file) => file.name.toLowerCase().endsWith(".csv"));

    if (csvFile) {
      setSelectedFileLocal(csvFile);
    } else {
      setUploadStatus("error");
      setUploadMessage("Please select a CSV file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileLocal(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("idle");
    setUploadMessage("");

    try {
      const csvContent = await selectedFile.text();
      const recordCount = await dbManager.importCSVData(csvContent, selectedFile.name, selectedFile.size);

      setUploadStatus("success");
      setUploadMessage(`Successfully imported ${recordCount} records from ${selectedFile.name}`);
      setSelectedFileLocal(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload data
      await loadData();
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(error instanceof Error ? error.message : "Failed to import CSV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const csvContent = await dbManager.exportToCSV();
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const clearSelection = () => {
    setSelectedFileLocal(null);
    setUploadStatus("idle");
    setUploadMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Data Import" description="Import and manage financial data from CSV files" icon={<Database className="w-8 h-8 text-blue-600" />} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Initializing database...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Data Import" description="Import and manage financial data from CSV files" icon={<Database className="w-8 h-8 text-blue-600" />} />

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Import CSV File</h3>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Upload File
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={async () => {
                  if (confirm("This will clear all data and reload defaults with proper file associations. Continue?")) {
                    await dbManager.resetDatabase();
                    await loadData();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset DB
              </button>
              <button
                onClick={async () => {
                  await dbManager.debugDatabaseState();
                  alert("Check browser console for database state details");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Debug DB
              </button>
            </div>
          </div>

          {/* Database Upgrade Notice */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">File-Specific Data Loading</p>
                <p className="text-sm text-blue-700 mt-1">
                  Each imported file now stores its data separately. Click on a file name to view only that file's data. If you have existing data from before this update, click
                  "Reset DB" to enable proper file associations.
                </p>
              </div>
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button onClick={clearSelection} className="p-1 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import Data
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop your CSV file here</p>
                  <p className="text-gray-600">or click "Upload File" to choose a file</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Expected format: Section, Item, Period 1, Period 2, Period 3, Period 4</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Status */}
          {uploadStatus !== "idle" && (
            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${uploadStatus === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              {uploadStatus === "success" ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
              <div>
                <p className={`font-medium ${uploadStatus === "success" ? "text-green-800" : "text-red-800"}`}>
                  {uploadStatus === "success" ? "Import Successful" : "Import Failed"}
                </p>
                <p className={`text-sm ${uploadStatus === "success" ? "text-green-700" : "text-red-700"}`}>{uploadMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Current Data Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{financialRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Import History</p>
                <p className="text-2xl font-bold text-green-600">{importHistory.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{selectedImportedFile ? "Latest Revenue" : "Revenue Data"}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedImportedFile ? formatCurrency(financialRecords.find((r) => r.item === "Revenue")?.period4 || 0) : <span className="text-gray-400">Select File</span>}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Import History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Import History</h3>
            {selectedImportedFile && (
              <button onClick={showAllData} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1" disabled={loadingFileData}>
                <X className="w-4 h-4" />
                Clear Selection
              </button>
            )}
          </div>
          {selectedImportedFile && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedImportedFile.filename}
                <span className="ml-2 text-blue-600">({selectedImportedFile.record_count} records)</span>
              </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">File Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Upload Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Records</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">File Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {importHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No import history available
                    </td>
                  </tr>
                ) : (
                  importHistory.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-b border-gray-100 transition-colors ${selectedImportedFile?.id === file.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => loadFileData(file)}
                          className={`font-medium text-left hover:underline transition-colors ${
                            selectedImportedFile?.id === file.id ? "text-blue-700" : "text-gray-900 hover:text-blue-600"
                          }`}
                          disabled={loadingFileData}
                        >
                          {file.filename}
                          {selectedImportedFile?.id === file.id && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Selected</span>}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(file.upload_date).toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{file.record_count}</td>
                      <td className="py-3 px-4 text-gray-600">{formatFileSize(file.file_size)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.status === "imported" ? "bg-green-100 text-green-800" : file.status === "error" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {selectedImportedFile?.id === file.id ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => loadFileData(file)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                              disabled={loadingFileData}
                              title="Select this file"
                            >
                              <Check className="w-3 h-3" />
                              Select
                            </button>
                          )}
                          <button
                            onClick={() => loadFileData(file)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            disabled={loadingFileData}
                            title="View data"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            disabled={deletingFileId === file.id || loadingFileData}
                            title="Delete from history"
                          >
                            {deletingFileId === file.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Data Preview - Only show when a file is selected */}
        {selectedImportedFile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Data from {selectedImportedFile.filename}</h3>
              {loadingFileData && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Loading...
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Section</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Item</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Period 1</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Period 2</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Period 3</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Period 4</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingFileData ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Loading financial data...
                        </div>
                      </td>
                    </tr>
                  ) : financialRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No financial data available
                      </td>
                    </tr>
                  ) : (
                    financialRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{record.section}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{record.item}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {record.item.includes("Revenue") ||
                          record.item.includes("Profit") ||
                          record.item.includes("Assets") ||
                          record.item.includes("Liabilities") ||
                          record.item.includes("Cash") ||
                          record.item.includes("Loans")
                            ? formatCurrency(record.period1)
                            : record.period1?.toLocaleString() || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {record.item.includes("Revenue") ||
                          record.item.includes("Profit") ||
                          record.item.includes("Assets") ||
                          record.item.includes("Liabilities") ||
                          record.item.includes("Cash") ||
                          record.item.includes("Loans")
                            ? formatCurrency(record.period2)
                            : record.period2?.toLocaleString() || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {record.item.includes("Revenue") ||
                          record.item.includes("Profit") ||
                          record.item.includes("Assets") ||
                          record.item.includes("Liabilities") ||
                          record.item.includes("Cash") ||
                          record.item.includes("Loans")
                            ? formatCurrency(record.period3)
                            : record.period3?.toLocaleString() || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {record.item.includes("Revenue") ||
                          record.item.includes("Profit") ||
                          record.item.includes("Assets") ||
                          record.item.includes("Liabilities") ||
                          record.item.includes("Cash") ||
                          record.item.includes("Loans")
                            ? formatCurrency(record.period4)
                            : record.period4?.toLocaleString() || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions when no file is selected */}
        {!selectedImportedFile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No File Selected</h3>
              <p className="text-gray-600 mb-4">Click on a file name in the Import History above to view its financial data</p>
              <div className="text-sm text-gray-500">
                <p>• Click on any file name to view its data</p>
                <p>• Use the eye icon (👁) to view file details</p>
                <p>• Upload new CSV files using the drag & drop area above</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataImportPage;
