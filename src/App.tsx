import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Landing from "./pages/landing";
import PublicMenu from "./pages/PublicMenu";
import routes from "tempo-routes";

import { MenuProvider } from "./context/MenuContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <MenuProvider>
          <div>
            {/* For the tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/m/:menuId" element={<PublicMenu />} />

              {/* Add this before the catchall route */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
          </div>
        </MenuProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
