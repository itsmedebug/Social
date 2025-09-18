interface SidebarProps {
  currentView: string;
  onNavigate: (view: "home" | "map" | "reports" | "social" | "profile") => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: "fas fa-home" },
    { id: "map", label: "Interactive Map", icon: "fas fa-map-marked-alt" },
    { id: "reports", label: "My Reports", icon: "fas fa-exclamation-triangle" },
    { id: "social", label: "Social Feed", icon: "fab fa-twitter" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

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

            {/* Quick Stats */}
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Reports</span>
                  <span className="font-medium text-accent">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verified Reports</span>
                  <span className="font-medium text-secondary">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Community Points</span>
                  <span className="font-medium text-primary">245</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
