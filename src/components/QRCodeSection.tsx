import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Image as ImageIcon, Settings2 } from "lucide-react";
import QRPreview from "./QRPreview";

interface QRCodeSectionProps {
  onLogoUpload?: (file: File) => void;
  onSizeChange?: (size: number) => void;
  onCustomize?: () => void;
  qrCodeUrl?: string;
  size?: number;
}

const QRCodeSection = ({
  onLogoUpload = () => {},
  onSizeChange = () => {},
  onCustomize = () => {},
  qrCodeUrl = "https://api.dicebear.com/7.x/initials/svg?seed=QR",
  size = 250,
}: QRCodeSectionProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLogoUpload(file);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold">QR Code Customization</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Restaurant Logo</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>QR Code Size</Label>
              <Slider
                defaultValue={[size]}
                max={400}
                min={100}
                step={10}
                onValueChange={(values) => onSizeChange(values[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>100px</span>
                <span>400px</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onCustomize}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Advanced Customization
            </Button>
          </div>
        </Card>

        <QRPreview qrCodeUrl={qrCodeUrl} size={size} />
      </div>
    </div>
  );
};

export default QRCodeSection;
