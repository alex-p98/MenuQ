import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";

import TranslationPanel from "./TranslationPanel";
import QRCodeGenerator from "./QRCodeGenerator";
import MobilePreview from "./MobilePreview";
import MobilePreviewCustomizer from "./MobilePreviewCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import MenuEditor from "./MenuEditor";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
}

const Home = ({
  userName = "Restaurant Owner",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=owner",
}: HomeProps) => {
  const [activeTab, setActiveTab] = useState("menu");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={userName} userAvatar={userAvatar} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Menu Translation Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Upload your menu, manage translations, and generate QR codes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="p-6 bg-white">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="menu">Menu Editor</TabsTrigger>
                  <TabsTrigger value="translations">Translations</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                </TabsList>

                <TabsContent value="menu">
                  <MenuEditor />
                </TabsContent>

                <TabsContent value="translations">
                  <TranslationPanel />
                </TabsContent>

                <TabsContent value="qr">
                  <QRCodeGenerator />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="relative">
            <div className="flex gap-4">
              <MobilePreview />
              <div className="sticky top-4">
                <MobilePreviewCustomizer />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
