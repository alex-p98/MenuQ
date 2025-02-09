import React from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Palette, Type, Layout, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { useMenu } from "../context/MenuContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function MobilePreviewCustomizer() {
  const { mobileStyles, setMobileStyles } = useMenu();
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <Card className="w-[300px] h-full bg-white p-4 flex flex-col">
      <h3 className="font-semibold mb-4">Customize Mobile View</h3>

      <Tabs defaultValue="colors" className="w-full flex-1 overflow-auto">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input
              type="color"
              className="h-10"
              value={mobileStyles.primaryColor}
              onChange={(e) =>
                setMobileStyles({
                  ...mobileStyles,
                  primaryColor: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <Input
              type="color"
              className="h-10"
              value={mobileStyles.backgroundColor}
              onChange={(e) =>
                setMobileStyles({
                  ...mobileStyles,
                  backgroundColor: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Text Color</Label>
            <Input
              type="color"
              className="h-10"
              value={mobileStyles.textColor}
              onChange={(e) =>
                setMobileStyles({ ...mobileStyles, textColor: e.target.value })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Slider
              value={[mobileStyles.fontSize]}
              max={24}
              min={12}
              step={1}
              onValueChange={(value) =>
                setMobileStyles({ ...mobileStyles, fontSize: value[0] })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Line Height</Label>
            <Slider
              value={[mobileStyles.lineHeight]}
              max={2}
              min={1}
              step={0.1}
              onValueChange={(value) =>
                setMobileStyles({ ...mobileStyles, lineHeight: value[0] })
              }
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-2">
            <Label>Padding</Label>
            <Slider
              value={[mobileStyles.padding]}
              max={32}
              min={8}
              step={4}
              onValueChange={(value) =>
                setMobileStyles({ ...mobileStyles, padding: value[0] })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Card Radius</Label>
            <Slider
              value={[mobileStyles.borderRadius]}
              max={20}
              min={0}
              step={2}
              onValueChange={(value) =>
                setMobileStyles({ ...mobileStyles, borderRadius: value[0] })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Header Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                className="flex-1"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setMobileStyles({
                        ...mobileStyles,
                        headerImage: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {mobileStyles.headerImage && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setMobileStyles({ ...mobileStyles, headerImage: undefined })
                  }
                >
                  <Image className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t flex-shrink-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={async () => {
            if (!user) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "You must be logged in to save customizations.",
              });
              return;
            }

            try {
              const { data: existingStyle, error: fetchError } = await supabase
                .from("mobile_view_styles")
                .select("id")
                .eq("restaurant_id", user.id)
                .single();

              if (fetchError && fetchError.code !== "PGRST116") {
                throw fetchError;
              }

              const styleData = {
                restaurant_id: user.id,
                primary_color: mobileStyles.primaryColor,
                background_color: mobileStyles.backgroundColor,
                text_color: mobileStyles.textColor,
                font_size: mobileStyles.fontSize,
                line_height: mobileStyles.lineHeight,
                padding: mobileStyles.padding,
                border_radius: mobileStyles.borderRadius,
                header_image: mobileStyles.headerImage,
              };

              let saveError;
              if (existingStyle) {
                const { error } = await supabase
                  .from("mobile_view_styles")
                  .update(styleData)
                  .eq("id", existingStyle.id);
                saveError = error;
              } else {
                const { error } = await supabase
                  .from("mobile_view_styles")
                  .insert([styleData]);
                saveError = error;
              }

              if (saveError) throw saveError;

              toast({
                title: "Settings saved",
                description: "Your mobile view customizations have been saved.",
              });
            } catch (error) {
              console.error("Error saving mobile styles:", error);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save customizations. Please try again.",
              });
            }
          }}
        >
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
