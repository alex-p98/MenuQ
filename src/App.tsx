import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Landing from "./pages/landing";
import Menu from "./pages/menu";
import routes from "tempo-routes";

import { MenuProvider } from "./context/MenuContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured =
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== "https://your-project-url.supabase.co";

  // If Supabase isn't configured, just show the landing page without auth
  if (!isSupabaseConfigured) {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <MenuProvider>
          <div>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/menu/:menuId" element={<Menu />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </div>
        </MenuProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
