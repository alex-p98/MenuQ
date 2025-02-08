import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const restaurantName = formData.get("restaurantName") as string;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          restaurant_name: restaurantName,
        },
      },
    });

    if (signUpError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: signUpError.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      onSuccess();
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input id="restaurantName" name="restaurantName" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
