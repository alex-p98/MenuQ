import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Landing from "./pages/landing";
import Menu from "./pages/menu";
import routes from "tempo-routes";

import { MenuProvider } from "./context/MenuContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <MenuProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/menu/:menuId" element={<Menu />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </MenuProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
