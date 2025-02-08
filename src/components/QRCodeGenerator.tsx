import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { generateQRCode } from "@/lib/qr";
import { supabase } from "@/lib/supabase";

interface QRCodeGeneratorProps {
  onGenerate?: (config: QRConfig) => void;
  isLoading?: boolean;
}

interface QRConfig {
  size: number;
  logo?: File;
}

const QRCodeGenerator = ({
  onGenerate = () => {},
  isLoading = false,
}: QRCodeGeneratorProps) => {
  const [size, setSize] = useState(200);
  const [logo, setLogo] = useState<File | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  const [qrCode, setQrCode] = useState<string>();

  const handleGenerate = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const qrDataUrl = await generateQRCode(user.id, {
        size,
        logo: logo || undefined,
      });
      setQrCode(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <Card className="w-[480px] p-6 bg-white">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">QR Code Generator</h2>
          <p className="text-gray-500">Customize your QR code appearance</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>QR Code Size</Label>
            <Slider
              value={[size]}
              onValueChange={(values) => setSize(values[0])}
              min={100}
              max={400}
              step={10}
              className="w-full"
            />
            <div className="text-sm text-gray-500">{size}px</div>
          </div>

          <div className="space-y-2">
            <Label>Restaurant Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                >
                  <Upload className="w-4 h-4" />
                  <span>{logo ? logo.name : "Upload logo"}</span>
                </Label>
              </div>
              {logo && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLogo(null)}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
          </div>

          {/* Preview Area */}
          <div className="mt-6 p-4 border rounded-lg flex items-center justify-center">
            <div
              className="bg-gray-100 rounded-lg flex items-center justify-center"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                maxWidth: "100%",
                maxHeight: "300px",
              }}
            >
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-gray-400 text-sm">QR Preview</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
