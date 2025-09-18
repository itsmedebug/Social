interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <i className="fas fa-waves text-primary-foreground text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Pragyan Chakra</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Ocean Safety Network</p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search reports, locations..." 
                className="w-full bg-muted border border-input rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="search-input"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              data-testid="notifications-button"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full"
                data-testid="user-avatar"
              />
              <span className="hidden sm:block text-sm font-medium">Alice Chen</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors" 
              onClick={onMobileMenuToggle}
              data-testid="mobile-menu-toggle"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
