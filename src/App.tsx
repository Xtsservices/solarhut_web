import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import MastersPage from './components/admin/MastersPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
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

import LoginPage from './components/shared/LoginPage';
import { useDispatch, useSelector } from 'react-redux';
import { apiCurrentUserData } from './api';

interface RootState {
  currentUserData: any;
}

type UserRole = 'guest' | 'admin' | 'sales' | 'field';
type AuthState = {
  role: UserRole;
  email: string;
};

function AppContent() {
  const user = useSelector((state: RootState) => state.currentUserData);
  const location = useLocation();
  const background = location.state?.background;
  const token = localStorage.getItem("authToken");

  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { role: 'guest', email: '' };
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

   const getCurrentUserData = async () => {
    try {

      console.log("Fetching user data from API");
      
      const response = await apiCurrentUserData();

      const userData = response.data || response;
      console.log("userDatafrom app.jsx", userData)

      if (userData) {
        dispatch({
          type: "currentUserData",
          payload: userData,
        });
       

      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


    useEffect(() => {
    if (token && !user) {
      getCurrentUserData()
    }
  }, [user])

  // Handle login from LoginPage component
  const handleLogin = (mobile: string, otp: string) => {
    // Get user data from localStorage (set during OTP verification)
    const employeeData = localStorage.getItem('employeeData');
    let role: UserRole = 'guest';
    let userInfo = { mobile, name: 'User' };

    if (employeeData) {
      try {
        const userData = JSON.parse(employeeData);
        userInfo.name = userData.first_name || 'User';
        
        // Determine role based on user data or mobile number
        if (userData.role) {
          const userRole = userData.role.toLowerCase();
          if (userRole.includes('admin')) role = 'admin';
          else if (userRole.includes('sales')) role = 'sales';
          else if (userRole.includes('field')) role = 'field';
          else role = 'admin';
        } else {
          // Fallback: determine role based on mobile number for demo
          if (mobile === '9876543210') role = 'admin';
          else if (mobile === '9876543211') role = 'sales';
          else if (mobile === '9876543212') role = 'field';
          else role = 'admin';
        }
      } catch (error) {
        console.error('Error parsing employee data:', error);
        // Fallback role assignment
        if (mobile === '9876543210') role = 'admin';
        else if (mobile === '9876543211') role = 'sales';
        else if (mobile === '9876543212') role = 'field';
        else role = 'admin';
      }
    } else {
      // Fallback role assignment for demo
      if (mobile === '9876543210') role = 'admin';
      else if (mobile === '9876543211') role = 'sales';
      else if (mobile === '9876543212') role = 'field';
      else role = 'admin';
    }
    
    setAuth({ role, email: mobile }); // Using mobile as email for compatibility
    navigate('/dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setAuth({ role: 'guest', email: '' });
    localStorage.removeItem('auth');
    localStorage.removeItem('authToken');
    localStorage.removeItem('employeeData');
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
    return <LoginPage onLogin={handleLogin} />;
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
                <Route path="/masters" element={<MastersPage />} />
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
        <Route path="/contact" element={<ContactPage />} />
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
