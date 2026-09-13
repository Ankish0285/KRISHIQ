import AppRoutes from "./routes/AppRoutes.jsx";
import SeoManager from "./seo/SeoManager.jsx";

export default function App() {
  return (
    <>
      <SeoManager />
      <AppRoutes />
    </>
  );
}
