import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Delete from profiles table first
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Delete from auth.users table
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id,
      );
      if (authError) throw authError;

      // Sign out the user
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete account. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-destructive">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all associated data.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
