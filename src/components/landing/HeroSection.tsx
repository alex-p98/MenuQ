import { useState } from "react";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";
import AuthModal from "../auth/AuthModal";

export default function HeroSection() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-10 blur-[100px]" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              🌍 95+ Languages Supported
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
              Transform Your Menu Into Any Language
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Serve international guests with confidence using AI-powered
              translations and smart recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white"
                onClick={() => setShowAuth(true)}
              >
                <Globe className="mr-2 h-4 w-4" />
                Start Translating
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent group-hover:text-white transition-colors">
                  Watch Demo
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 translate-y-[101%] group-hover:translate-y-0 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right column - Preview */}
          <div className="relative lg:ml-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-violet-600 rounded-2xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-white dark:bg-gray-900 border rounded-2xl shadow-2xl p-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60"
                  alt="Menu Preview"
                  className="w-full rounded-lg object-cover aspect-[4/3]"
                />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm font-medium animate-bounce">
              🎯 100% Accuracy
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm font-medium animate-bounce delay-150">
              ⚡️ Instant Translation
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
