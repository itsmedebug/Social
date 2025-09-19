import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import Map from "@/components/Map";
import SocialFeed from "@/components/SocialFeed";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import UserDashboard from "@/components/UserDashboard";
import AuthorityDashboard from "@/components/AuthorityDashboard";
import VolunteerDashboard from "@/components/VolunteerDashboard";

type ViewType = "home" | "map" | "reports" | "social" | "profile" | "user-dashboard" | "authority-dashboard" | "volunteer-dashboard";

// Mock user role - in a real app this would come from auth context
const CURRENT_USER_ROLE = "volunteer"; // Can be "user", "authority", or "volunteer"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMobileMenuToggle={() => setIsMobileNavOpen(true)} 
      />
      
      <div className="flex max-w-7xl mx-auto">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView}
          userRole={CURRENT_USER_ROLE}
        />
        
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {currentView === "home" && <Feed />}
            {currentView === "map" && <Map />}
            {currentView === "social" && <SocialFeed />}
            {currentView === "reports" && <Feed />}
            {currentView === "profile" && <Feed />}
            {currentView === "user-dashboard" && <UserDashboard />}
            {currentView === "authority-dashboard" && <AuthorityDashboard />}
            {currentView === "volunteer-dashboard" && <VolunteerDashboard />}
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-80">
          <div className="sticky top-20 p-6 space-y-6">
            {/* Current Alerts */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <i className="fas fa-exclamation-triangle text-accent mr-2"></i>
                Current Alerts
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-2 bg-destructive/10 rounded-lg">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">High Tide Warning</p>
                    <p className="text-xs text-muted-foreground">Chennai Coast</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-accent/10 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Strong Currents</p>
                    <p className="text-xs text-muted-foreground">Kochi Port</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <i className="fas fa-cloud-sun text-primary mr-2"></i>
                Ocean Conditions
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wave Height</span>
                  <span className="font-medium">2.1m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Temp</span>
                  <span className="font-medium">28°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tide Status</span>
                  <span className="font-medium text-primary">Rising</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind Speed</span>
                  <span className="font-medium">15 km/h</span>
                </div>
              </div>
            </div>

            {/* Community Leaderboard */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <i className="fas fa-trophy text-secondary mr-2"></i>
                Top Contributors
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-xs font-bold">1</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Priya Sharma</p>
                    <p className="text-xs text-muted-foreground">342 reports</p>
                  </div>
                  <div className="text-xs text-secondary font-medium">95% accuracy</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">2</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Raj Patel</p>
                    <p className="text-xs text-muted-foreground">289 reports</p>
                  </div>
                  <div className="text-xs text-secondary font-medium">92% accuracy</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">3</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maya Singh</p>
                    <p className="text-xs text-muted-foreground">256 reports</p>
                  </div>
                  <div className="text-xs text-secondary font-medium">94% accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
      
      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileNavOpen(false);
        }}
        userRole={CURRENT_USER_ROLE}
      />

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 z-40"
        onClick={() => {
          // Scroll to upload form or show modal
          const uploadForm = document.getElementById('upload-form');
          if (uploadForm) {
            uploadForm.scrollIntoView({ behavior: 'smooth' });
            uploadForm.querySelector('textarea')?.focus();
          }
        }}
        data-testid="fab-upload"
      >
        <i className="fas fa-plus text-lg"></i>
      </button>
    </div>
  );
}
