import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Plus } from "lucide-react";

interface MenuUploadSectionProps {
  onFileUpload?: (file: File) => void;
  onManualInput?: (data: {
    name: string;
    description: string;
    price: string;
  }) => void;
}

export default function MenuUploadSection({
  onFileUpload = () => {},
  onManualInput = () => {},
}: MenuUploadSectionProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useState<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full bg-white p-6 shadow-sm">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Menu
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Manual Input
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div
            className={`relative h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleChange}
              ref={(el) => inputRef[1](el)}
            />

            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-600 mb-2">
              Drag and drop your menu file here, or
              <Button
                variant="link"
                className="px-1"
                onClick={() => inputRef[0]?.click()}
              >
                browse
              </Button>
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV, Excel, and PDF formats
            </p>
          </div>
        </TabsContent>

        <TabsContent value="manual">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Menu Items</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 p-4 border rounded-lg">
                <Input placeholder="Item name" />
                <Input placeholder="Description" />
                <Input placeholder="Price" type="number" step="0.01" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
