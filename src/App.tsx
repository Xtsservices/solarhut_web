import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ScrollToTop } from './components/shared/ScrollToTop';

import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';
import { LandingPage } from './components/website/LandingPage';
import { ContactPage } from './components/website/ContactPage';
import { EnquiryPage } from './components/website/EnquiryPage';
import { AboutPage } from './components/website/AboutPage';
import { GroundMountedPage } from './components/website/GroundMountedPage';
import { ResidentialSolutionsPage } from './components/website/ResidentialSolutionsPage';
import { CommercialSolutionsPage } from './components/website/CommercialSolutionsPage';
import { IndustrialSolutionsPage } from './components/website/IndustrialSolutionsPage';
import { SolarWaterHeatersPage } from './components/website/SolarWaterHeatersPage';
import { TestimonialsPage } from './components/website/TestimonialsPage';
import { ProjectsPage } from './components/website/ProjectsPage';
import { GalleryPage } from './components/website/GalleryPage';
import TeamsPage from './components/website/TeamsPage';
import ContactModal from './components/website/ContactModal';
import { EnquiryFormPopup } from './components/website/EnquiryFormPopup';


import { PortalSidebar } from './components/shared/PortalSidebar';
import { PortalHeader } from './components/shared/PortalHeader';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { EnquiriesPage } from './components/admin/EnquiriesPage';
import { EmployeesPage } from './components/admin/EmployeesPage';
import { PackagesPage } from './components/admin/PackagesPage';
import { PaymentsPage } from './components/admin/PaymentsPage';
import { JobRequestsPage } from './components/admin/JobRequestsPage';
import { WorkProgressPage } from './components/admin/WorkProgressPage';
import { NotificationsPage } from './components/shared/NotificationsPage';
import { SettingsPage } from './components/shared/SettingsPage';
import { ProfilePage } from './components/shared/ProfilePage';

import { SalesDashboard } from './components/sales/SalesDashboard';
import { AssignedEnquiries } from './components/sales/AssignedEnquiries';

import { FieldDashboard } from './components/field/FieldDashboard';
import { AssignedJobs } from './components/field/AssignedJobs';
import { PaymentStatusPage } from './components/field/PaymentStatusPage';

import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
// @ts-ignore: Vite virtual asset provided at build time
import logoImage from './assets/image.png';


type UserRole = 'guest' | 'admin' | 'sales' | 'field';
type AuthState = {
  role: UserRole;
  email: string;
};

function AppContent() {
  // Add location state to track background
  const location = useLocation();
  const background = location.state?.background;

  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { role: 'guest', email: '' };
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let role: UserRole = 'guest';
    if (loginEmail.includes('admin')) role = 'admin';
    else if (loginEmail.includes('sales') || loginEmail.includes('rahul')) role = 'sales';
    else if (loginEmail.includes('field') || loginEmail.includes('manoj')) role = 'field';
    
    setAuth({ role, email: loginEmail });
    navigate('/dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setAuth({ role: 'guest', email: '' });
    setLoginEmail('');
    setLoginPassword('');
    localStorage.removeItem('auth');
    navigate('/');
  };

  // Add state for enquiry popup
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);

  // Modify handleNavigate
  const handleNavigate = (page: string) => {
    if (page === 'enquiry') {
      setShowEnquiryPopup(true);
      return;
    }
    navigate('/' + page);
  };

  // Login Page
  if (auth.role === 'guest' && window.location.pathname === '/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img
                  src={logoImage}
                  alt="Solar Hut Solutions Logo"
                  className="h-24 sm:h-24 w-auto object-contain"
                />
              </div>
              <h1 className="text-gray-900 mb-2">Portal Login</h1>
              <p className="text-gray-600">Access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white">
                Login
              </Button>
            </form>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-orange-700">Admin: admin@solarhut.com</p>
              <p className="text-xs text-orange-700">Sales: rahul.verma@solarhut.com</p>
              <p className="text-xs text-orange-700">Field: manoj.kumar@solarhut.com</p>
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate('/')} className="text-[#FFA500] hover:text-[#FF8C00]">
                Back to Landing Page
              </Button>
            </div>
          </CardContent>
        </Card>
        <Toaster />
        
      </div>
    );
  }

  // Portal Pages (Admin/Sales/Field)
  if (auth.role !== 'guest') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <PortalHeader
          role={auth.role}
          userName={auth.role === 'admin' ? 'Admin User' : auth.role === 'sales' ? 'Rahul Verma' : 'Manoj Kumar'}
          notificationCount={5}
          onNotificationsClick={() => navigate('/notifications')}
          onProfileClick={() => navigate('/profile')}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        {/* Sidebar and Content */}
        <div className="flex flex-1 overflow-hidden">
          <PortalSidebar
            role={auth.role}
            currentPage={window.location.pathname.replace('/', '') || 'dashboard'}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
          <div ref={portalContentRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <Routes>
              {/* Admin Routes */}
              {auth.role === 'admin' && <>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/enquiries" element={<EnquiriesPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/job-requests" element={<JobRequestsPage />} />
                <Route path="/work-progress" element={<WorkProgressPage />} />
                <Route path="/notifications" element={<NotificationsPage role={auth.role} />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage role={auth.role} />} />
                <Route path="*" element={<AdminDashboard />} />
              </>}
              {/* Sales Routes */}
              {auth.role === 'sales' && <>
                <Route path="/dashboard" element={<SalesDashboard />} />
                <Route path="/assigned-enquiries" element={<AssignedEnquiries />} />
                <Route path="/notifications" element={<NotificationsPage role={auth.role} />} />
                <Route path="/profile" element={<ProfilePage role={auth.role} />} />
                <Route path="*" element={<SalesDashboard />} />
              </>}
              {/* Field Routes */}
              {auth.role === 'field' && <>
                <Route path="/dashboard" element={<FieldDashboard />} />
                <Route path="/assigned-jobs" element={<AssignedJobs />} />
                <Route path="/notifications" element={<NotificationsPage role={auth.role} />} />
                <Route path="/profile" element={<ProfilePage role={auth.role} />} />
                <Route path="*" element={<FieldDashboard />} />
              </>}
            </Routes>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Public Website
  // Sync currentPage with the current route
  const { pathname } = window.location;
  let currentPage = 'home';
  if (pathname === '/' || pathname === '/home') currentPage = 'home';
  else if (pathname === '/about') currentPage = 'about';
  else if (pathname === '/contact') currentPage = 'contact';
  else if (pathname === '/enquiry') currentPage = 'enquiry';
  else if (pathname === '/ground-mounted') currentPage = 'ground-mounted';
  else if (pathname === '/residential') currentPage = 'residential';
  else if (pathname === '/commercial') currentPage = 'commercial';
  else if (pathname === '/industrial') currentPage = 'industrial';
  else if (pathname === '/solar-water-heaters') currentPage = 'solar-water-heaters';
  else if (pathname === '/teams') currentPage = 'teams';
  else if (pathname === '/testimonials') currentPage = 'testimonials';
  else if (pathname === '/projects') currentPage = 'projects';
  else if (pathname === '/gallery') currentPage = 'gallery';

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {/* Main Routes - always render current page */}
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
        <Route path="/home" element={<LandingPage onNavigate={handleNavigate} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage open={true} onClose={() => navigate("/")} />} />
        <Route path="/ground-mounted" element={<GroundMountedPage />} />
        <Route path="/residential" element={<ResidentialSolutionsPage />} />
        <Route path="/commercial" element={<CommercialSolutionsPage />} />
        <Route path="/industrial" element={<IndustrialSolutionsPage />} />
        <Route path="/solar-water-heaters" element={<SolarWaterHeatersPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="*" element={<LandingPage onNavigate={handleNavigate} />} />
      </Routes>

      {/* Enquiry popup overlays current page */}
      {showEnquiryPopup && (
        <EnquiryFormPopup 
          selectedType="residential"
          open={true}
          onClose={() => setShowEnquiryPopup(false)}
          onSuccess={() => {
            toast.success("Thank you for your enquiry!");
            setShowEnquiryPopup(false);
          }}
        />
      )}

      <Footer onNavigate={handleNavigate} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
