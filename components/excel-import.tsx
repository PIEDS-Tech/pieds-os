"use client";

import { useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { parseFile, processImportedData, findDuplicatesInData, ImportPreview } from "@/lib/excel-import";
import { bulkImportContacts } from "@/lib/contacts-store";
import { Textarea } from "@/components/ui/textarea";

interface ExcelImportProps {
  onImportComplete?: (result: { added: number; skipped: number }) => void;
}

type ImportStep = "upload" | "mapping" | "preview" | "complete";

export function ExcelImport({ onImportComplete }: ExcelImportProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ added: number; skipped: number } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setLoading(true);

    try {
      const parsed = await parseFile(selectedFile);
      if (!parsed) {
        setError("Failed to parse file. Please check the format.");
        setLoading(false);
        return;
      }

      setPreview(parsed);
      setMappings(parsed.columnMappings);
      setStep("mapping");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (field: string, header: string) => {
    setMappings((prev) => ({
      ...prev,
      [field]: header,
    }));
  };

  const handleProceedToPreview = () => {
    if (!preview) return;
    setStep("preview");
  };

  const handleImport = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: preview.allData.length });

    try {
      // Process the imported data (use ALL data, not just preview)
      const processed = processImportedData(preview.allData, mappings);
      setProgress({ current: Math.floor(preview.allData.length * 0.5), total: preview.allData.length });

      const { valid } = findDuplicatesInData(processed);

      if (valid.length === 0) {
        setError("No valid contacts to import.");
        setLoading(false);
        return;
      }

      setProgress({ current: Math.floor(preview.allData.length * 0.75), total: preview.allData.length });

      // Bulk import
      const result = bulkImportContacts(valid);
      setProgress({ current: preview.allData.length, total: preview.allData.length });
      setImportResult(result);
      setStep("complete");
      onImportComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setPreview(null);
    setMappings({});
    setError(null);
    setImportResult(null);
  };

  return (
    <Card className="p-6 border-0">
      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Import Contacts from Excel/CSV</h3>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFileSelect(droppedFile);
            }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-semibold mb-1">Drag and drop your file here</p>
            <p className="text-xs text-muted-foreground">Or click to select</p>
            <p className="text-xs text-muted-foreground mt-2">Supported: .xlsx, .xls, .csv</p>
          </div>

          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Column Mapping */}
      {step === "mapping" && preview && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Map Your Columns</h3>
          <p className="text-sm text-muted-foreground">
            We've auto-detected columns. Please verify or adjust the mappings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "phone", "linkedin", "organization", "type"].map((field) => (
              <div key={field}>
                <label className="text-sm font-semibold block mb-2 capitalize">{field}</label>
                <select
                  value={mappings[field] || ""}
                  onChange={(e) => handleMappingChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                  <option value="">-- Skip this field --</option>
                  {preview.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700">
            <p className="font-semibold mb-1">Preview (First Row)</p>
            <div className="text-xs space-y-1">
              {preview.preview[0] && (
                <>
                  {Object.entries(preview.preview[0]).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold">{k}:</span> {String(v).substring(0, 50)}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Back
            </Button>
            <Button onClick={handleProceedToPreview} className="bg-primary hover:bg-primary/90">
              Continue to Preview
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && preview && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Review Import Preview</h3>
          <p className="text-sm text-muted-foreground">
            Showing first 5 rows of {preview.allData.length} total rows to import.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["name", "email", "phone", "organization"].map((field) => (
                    <th key={field} className="px-4 py-2 text-left font-semibold">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.preview.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-2">{String(row[mappings.name] || "")}</td>
                    <td className="px-4 py-2 text-muted-foreground">{String(row[mappings.email] || "")}</td>
                    <td className="px-4 py-2 text-muted-foreground">{String(row[mappings.phone] || "")}</td>
                    <td className="px-4 py-2 text-muted-foreground">{String(row[mappings.organization] || "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing contacts...</span>
                <span className="font-semibold">{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((progress.current / progress.total) * 100)}% complete
              </p>
            </div>
          )}

          {!loading && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("mapping")}>
                Back to Mapping
              </Button>
              <Button
                onClick={handleImport}
                className="bg-primary hover:bg-primary/90"
              >
                Import Contacts
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Complete */}
      {step === "complete" && importResult && (
        <div className="space-y-4 text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto" />
          <h3 className="text-lg font-bold">Import Complete!</h3>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-green-700 mb-2">
              ✓ <span className="font-semibold">{importResult.added}</span> contacts added
            </p>
            {importResult.skipped > 0 && (
              <p className="text-sm text-yellow-700">
                ⚠ <span className="font-semibold">{importResult.skipped}</span> duplicates skipped
              </p>
            )}
          </div>
          <Button onClick={handleReset} className="bg-primary hover:bg-primary/90">
            Import More Contacts
          </Button>
        </div>
      )}
    </Card>
  );
}
