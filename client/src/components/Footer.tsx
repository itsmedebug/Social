export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-waves text-primary-foreground text-sm"></i>
              </div>
              <h3 className="text-lg font-bold text-foreground">Pragyan Chakra</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering coastal communities through citizen-driven ocean hazard reporting and real-time safety information sharing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-facebook">
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-instagram">
                <i className="fab fa-instagram text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-how-it-works">How it Works</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-community-guidelines">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-verification">Verification Process</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-safety-tips">Safety Tips</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">&copy; 2025 Pragyan Chakra. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Emergency: 1077</span>
              <span>•</span>
              <span>Coast Guard: 1554</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
