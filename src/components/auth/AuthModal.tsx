import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to MenuLingo</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "signin" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm onSuccess={onClose} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
