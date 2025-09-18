interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: "home" | "map" | "reports" | "social" | "profile") => void;
}

export default function MobileNav({ isOpen, onClose, currentView, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: "fas fa-home" },
    { id: "map", label: "Interactive Map", icon: "fas fa-map-marked-alt" },
    { id: "reports", label: "My Reports", icon: "fas fa-exclamation-triangle" },
    { id: "social", label: "Social Feed", icon: "fab fa-twitter" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        data-testid="mobile-nav-overlay"
      />
      <nav className={`fixed top-0 left-0 w-64 h-full bg-card border-r border-border transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              data-testid="close-mobile-nav"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id as any)}
                  className={`w-full text-left block px-3 py-2 rounded-lg transition-colors ${
                    currentView === item.id
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`mobile-nav-${item.id}`}
                >
                  <i className={`${item.icon} mr-3`}></i>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
