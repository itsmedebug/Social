interface SidebarProps {
  currentView: string;
  onNavigate: (view: "home" | "map" | "reports" | "social" | "profile" | "user-dashboard" | "authority-dashboard" | "volunteer-dashboard") => void;
  userRole: "user" | "authority" | "volunteer";
}

export default function Sidebar({ currentView, onNavigate, userRole }: SidebarProps) {
  const baseNavItems = [
    { id: "home", label: "Home", icon: "fas fa-home" },
    { id: "map", label: "Interactive Map", icon: "fas fa-map-marked-alt" },
    { id: "reports", label: "My Reports", icon: "fas fa-exclamation-triangle" },
    { id: "social", label: "Social Feed", icon: "fab fa-twitter" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

  const dashboardNavItems = {
    user: [
      { id: "user-dashboard", label: "My Dashboard", icon: "fas fa-tachometer-alt" },
    ],
    authority: [
      { id: "authority-dashboard", label: "Authority Dashboard", icon: "fas fa-shield-alt" },
    ],
    volunteer: [
      { id: "volunteer-dashboard", label: "Volunteer Dashboard", icon: "fas fa-hands-helping" },
    ],
  };

  const navItems = [...baseNavItems, ...dashboardNavItems[userRole]];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
          <nav className="flex-1 px-4 space-y-1">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentView === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Role Badge */}
            <div className="px-3 py-2">
              <div className="mb-4">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <i className={`${userRole === 'authority' ? 'fas fa-shield-alt' : userRole === 'volunteer' ? 'fas fa-hands-helping' : 'fas fa-user'} mr-1`}></i>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </div>
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Stats</h3>
              <div className="space-y-2">
                {userRole === 'user' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">My Reports</span>
                      <span className="font-medium text-accent">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Verified</span>
                      <span className="font-medium text-secondary">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trust Score</span>
                      <span className="font-medium text-primary">8.1/10</span>
                    </div>
                  </>
                )}
                {userRole === 'authority' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unreviewed</span>
                      <span className="font-medium text-accent">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">High Urgency</span>
                      <span className="font-medium text-destructive">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jurisdiction</span>
                      <span className="font-medium text-primary">West Coast</span>
                    </div>
                  </>
                )}
                {userRole === 'volunteer' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assigned</span>
                      <span className="font-medium text-accent">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium text-secondary">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rank</span>
                      <span className="font-medium text-primary">#12</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
