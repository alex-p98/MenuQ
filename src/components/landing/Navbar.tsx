import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              MenuQ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <a href="#features" className="text-sm hover:text-primary">
              Features
            </a>
            <a href="#pricing" className="text-sm hover:text-primary">
              Pricing
            </a>
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => setShowAuth(true)}>Sign In</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 space-y-2">
            <a
              href="#features"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Pricing
            </a>
            {user ? (
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  setShowAuth(true);
                  setShowMobileMenu(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </nav>
  );
}
