import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QRPreviewProps {
  qrCodeUrl?: string;
  size?: number;
  onDownload?: () => void;
  onShare?: () => void;
}

const QRPreview = ({
  qrCodeUrl = "https://api.dicebear.com/7.x/initials/svg?seed=QR",
  size = 250,
  onDownload = () => console.log("Download QR code"),
  onShare = () => console.log("Share QR code"),
}: QRPreviewProps) => {
  return (
    <Card className="p-6 bg-white w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <div
          className="border-2 border-gray-200 rounded-lg p-4"
          style={{ width: size, height: size }}
        >
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDownload}
                  className="w-10 h-10"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download QR Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onShare}
                  className="w-10 h-10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share QR Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default QRPreview;
