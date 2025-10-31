import { useState, useEffect, useRef } from 'react';
import { Toaster } from './components/ui/sonner';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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
const logoImage = '/assets/image.png';


type UserRole = 'guest' | 'admin' | 'sales' | 'field';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [currentPage, setCurrentPage] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const portalContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever page changes
  useEffect(() => {
    // Scroll main window to top (for public website)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Scroll portal content to top (for admin/sales/field portals)
    if (portalContentRef.current) {
      portalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (loginEmail.includes('admin')) {
      setUserRole('admin');
      setCurrentPage('dashboard');
    } else if (loginEmail.includes('sales') || loginEmail.includes('rahul')) {
      setUserRole('sales');
      setCurrentPage('dashboard');
    } else if (loginEmail.includes('field') || loginEmail.includes('manoj')) {
      setUserRole('field');
      setCurrentPage('dashboard');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserRole('guest');
    setCurrentPage('home');
    setLoginEmail('');
    setLoginPassword('');
  };

  // Handle navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Login Page
  if (userRole === 'guest' && currentPage === 'login') {
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
              <Button variant="link" onClick={() => setCurrentPage('home')} className="text-[#FFA500] hover:text-[#FF8C00]">
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
  if (userRole !== 'guest') {
    // Get user name based on role
    const userName = 
      userRole === 'admin' ? 'Admin User' : 
      userRole === 'sales' ? 'Rahul Verma' : 
      'Manoj Kumar';

    // Mock notification count
    const notificationCount = 5;

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <PortalHeader
          role={userRole}
          userName={userName}
          notificationCount={notificationCount}
          onNotificationsClick={() => handleNavigate('notifications')}
          onProfileClick={() => handleNavigate('profile')}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        {/* Sidebar and Content */}
        <div className="flex flex-1 overflow-hidden">
          <PortalSidebar
            role={userRole}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
          <div ref={portalContentRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            {/* Admin Pages */}
            {userRole === 'admin' && (
              <>
                {currentPage === 'dashboard' && <AdminDashboard />}
                {currentPage === 'enquiries' && <EnquiriesPage />}
                {currentPage === 'employees' && <EmployeesPage />}
                {currentPage === 'packages' && <PackagesPage />}
                {currentPage === 'payments' && <PaymentsPage />}
                {currentPage === 'job-requests' && <JobRequestsPage />}
                {currentPage === 'work-progress' && <WorkProgressPage />}
                {currentPage === 'notifications' && <NotificationsPage role="admin" />}
                {currentPage === 'settings' && <SettingsPage />}
                {currentPage === 'profile' && <ProfilePage role="admin" />}
              </>
            )}

            {/* Sales Pages */}
            {userRole === 'sales' && (
              <>
                {currentPage === 'dashboard' && <SalesDashboard />}
                {currentPage === 'assigned-enquiries' && <AssignedEnquiries />}
                {currentPage === 'notifications' && <NotificationsPage role="sales" />}
                {currentPage === 'profile' && <ProfilePage role="sales" />}
              </>
            )}

            {/* Field Pages */}
            {userRole === 'field' && (
              <>
                {currentPage === 'dashboard' && <FieldDashboard />}
                {currentPage === 'assigned-jobs' && <AssignedJobs />}
                {currentPage === 'payment-status' && <PaymentStatusPage />}
                {currentPage === 'notifications' && <NotificationsPage role="field" />}
                {currentPage === 'profile' && <ProfilePage role="field" />}
              </>
            )}
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Public Website
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === 'residential' && <ResidentialSolutionsPage onNavigate={handleNavigate} />}
      {currentPage === 'commercial' && <CommercialSolutionsPage onNavigate={handleNavigate} />}
      {currentPage === 'industrial' && <IndustrialSolutionsPage onNavigate={handleNavigate} />}
      {currentPage === 'solar-water-heaters' && <SolarWaterHeatersPage onNavigate={handleNavigate} />}
      {currentPage === 'ground-mounted' && <GroundMountedPage onNavigate={handleNavigate} />}
      {currentPage === 'testimonials' && <TestimonialsPage onNavigate={handleNavigate} />}
      {currentPage === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
      {currentPage === 'gallery' && <GalleryPage onNavigate={handleNavigate} />}
      {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      {currentPage === 'enquiry' && <EnquiryPage onNavigate={handleNavigate} />}
      
      <Footer onNavigate={handleNavigate} />

      <Toaster />
    </div>
  );
}
