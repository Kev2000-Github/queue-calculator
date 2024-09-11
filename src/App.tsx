import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import HomePage from "./screens/home/home";
import RootLayout from "./layout/root";
import MMOnePage from "./screens/MMOne/MMOne";
import MMCPage from "./screens/MMC/MMC";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={routes.HOME} element={<HomePage />} />
          <Route path={routes.MM1} element={<MMOnePage />} />
          <Route path={routes.MMC} element={<MMCPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
