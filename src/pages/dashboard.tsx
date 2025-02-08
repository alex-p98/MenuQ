import React from "react";
import MenuUploadSection from "@/components/MenuUploadSection";
import TranslationManager from "@/components/TranslationManager";
import QRCodeSection from "@/components/QRCodeSection";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Languages, QrCode } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  translations?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}

export default function Dashboard() {
  const [selectedLanguages, setSelectedLanguages] = React.useState([
    "es",
    "fr",
  ]);
  const [menu, setMenu] = React.useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil, and olive oil",
      price: "$14.99",
      translations: {
        es: {
          name: "Pizza Margherita",
          description:
            "Tomates frescos, mozzarella, albahaca y aceite de oliva",
        },
        fr: {
          name: "Pizza Margherita",
          description: "Tomates fraîches, mozzarella, basilic et huile d'olive",
        },
      },
    },
  ]);

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language],
    );
  };

  const handleTranslate = () => {
    console.log("Translating menu items...");
  };

  const handleEditTranslation = (itemId: string, language: string) => {
    console.log("Editing translation:", itemId, language);
  };

  const handleApproveTranslation = (itemId: string, language: string) => {
    console.log("Approving translation:", itemId, language);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-[1400px] mx-auto bg-white shadow-sm">
        <Tabs defaultValue="upload" className="w-full">
          <div className="px-6 pt-6">
            <h1 className="text-3xl font-bold mb-6">
              Menu Translation Dashboard
            </h1>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Menu
              </TabsTrigger>
              <TabsTrigger
                value="translate"
                className="flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                Translate
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-6 space-y-6">
              <TabsContent value="upload">
                <MenuUploadSection onFileUpload={handleFileUpload} />
              </TabsContent>

              <TabsContent value="translate">
                <TranslationManager
                  menu={menu}
                  selectedLanguages={selectedLanguages}
                  onLanguageToggle={handleLanguageToggle}
                  onTranslate={handleTranslate}
                  onEditTranslation={handleEditTranslation}
                  onApproveTranslation={handleApproveTranslation}
                />
              </TabsContent>

              <TabsContent value="qr">
                <QRCodeSection
                  onLogoUpload={(file) => console.log("Logo uploaded:", file)}
                  onSizeChange={(size) => console.log("QR size changed:", size)}
                  onCustomize={() => console.log("Customizing QR code...")}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
}
