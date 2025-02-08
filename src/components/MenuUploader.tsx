import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, X, FileText, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface MenuUploaderProps {
  onUpload?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  isUploading?: boolean;
  uploadProgress?: number;
}

const MenuUploader = ({
  onUpload = () => {},
  acceptedFileTypes = [".pdf", ".doc", ".docx", ".txt"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  isUploading = false,
  uploadProgress = 0,
}: MenuUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    if (
      !acceptedFileTypes.some((type) => file.name.toLowerCase().endsWith(type))
    ) {
      setError("Invalid file type. Please upload a supported document format.");
      return false;
    }
    if (file.size > maxFileSize) {
      setError(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit.`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      onUpload(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <Card className="w-[480px] h-[320px] bg-white p-6">
      <div
        className={cn(
          "w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-200",
          error && "border-red-500",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file && !isUploading && (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drag & Drop Menu File
            </h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              or click to browse your files
              <br />
              Supported formats: {acceptedFileTypes.join(", ")}
            </p>
            <input
              type="file"
              className="hidden"
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInput}
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </>
        )}

        {file && !isUploading && (
          <div className="w-full">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Uploading menu...</p>
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              </div>
              {uploadProgress === 100 && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}
      </div>
    </Card>
  );
};

export default MenuUploader;
