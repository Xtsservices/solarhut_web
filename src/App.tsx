import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

// Direct imports instead of lazy loading to avoid timeout issues
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { ResidentialSolutionsPage } from "./pages/ResidentialSolutionsPage";
import { IndustrialSolutionsPage } from "./pages/IndustrialSolutionsPage";
import { CommercialSolutionsPage } from "./pages/CommercialSolutionsPage";
import { GroundMountedPage } from "./pages/GroundMountedPage";
import { SolarWaterHeatersPage } from "./pages/SolarWaterHeatersPage";
import { SolarInstallationsPage } from "./pages/SolarInstallationsPage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AwardsPage } from "./pages/AwardsPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { FAQPage } from "./pages/FAQPage";
import { SubsidyPage } from "./pages/SubsidyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReferEarnPage } from "./pages/ReferEarnPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/solutions/residential" element={<ResidentialSolutionsPage />} />
            <Route path="/solutions/industrial" element={<IndustrialSolutionsPage />} />
            <Route path="/solutions/commercial" element={<CommercialSolutionsPage />} />
            <Route path="/solutions/ground-mounted" element={<GroundMountedPage />} />
            <Route path="/solutions/solar-water-heaters" element={<SolarWaterHeatersPage />} />
            <Route path="/installations" element={<SolarInstallationsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/refer-earn" element={<ReferEarnPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/subsidy" element={<SubsidyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
  <Footer />
      </div>
    </Router>
  );
}