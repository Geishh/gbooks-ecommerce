import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent"></div>
          <span className="text-lg md:text-xl font-bold">gBooks</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-accent" : "text-foreground hover:text-accent"
            }`}
          >
            Beranda
          </a>
          <a
            href="/catalog"
            className={`text-sm font-medium transition-colors ${
              isActive("/catalog")
                ? "text-accent"
                : "text-foreground hover:text-accent"
            }`}
          >
            Katalog
          </a>
          {isAuthenticated && (
            <a
              href="/orders"
              className={`text-sm font-medium transition-colors ${
                isActive("/orders")
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              Pesanan Saya
            </a>
          )}
          {user?.role === "admin" && (
            <a
              href="/admin"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              Admin
            </a>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <a
            href="/cart"
            className="relative p-2 hover:bg-muted/10 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </a>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.name || "User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <a href={getLoginUrl()}>
              <Button variant="default" size="sm">
                Login
              </Button>
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-3">
            <a
              href="/"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Beranda
            </a>
            <a
              href="/catalog"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Katalog
            </a>
            {isAuthenticated && (
              <a
                href="/orders"
                className="block text-sm font-medium hover:text-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pesanan Saya
              </a>
            )}
            {user?.role === "admin" && (
              <a
                href="/admin"
                className="block text-sm font-medium hover:text-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </a>
            )}
            <div className="pt-3 border-t border-border">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {user?.name || "User"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button variant="default" size="sm" className="w-full">
                    Login
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
