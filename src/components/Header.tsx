import { Link } from '@tanstack/react-router';
import { ShoppingCart, Store, Settings, Phone, LogOut, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCart } from '@/lib/store';
import { getPhone, isLoggedIn, logout } from '@/lib/auth';
import { AnimatePresence } from 'framer-motion';
import { PhoneLogin } from '@/components/PhoneLogin';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhoneState] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    const updateAuth = () => {
      setLoggedIn(isLoggedIn());
      setPhoneState(getPhone());
    };
    updateCount();
    updateAuth();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);
    window.addEventListener('auth-changed', updateAuth);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
      window.removeEventListener('auth-changed', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setPhoneState(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">
              Smart Shop
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-sm font-medium text-primary' }}
            >
              Басты бет
            </Link>
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-sm font-medium text-primary' }}
            >
              Каталог
            </Link>
            <Link
              to="/orders"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-sm font-medium text-primary' }}
            >
              Тапсырыстарым
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-sm font-medium text-primary' }}
            >
              Админ панель
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                  <Phone className="h-3 w-3" />
                  {phone}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Шығу"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden h-9 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent md:flex"
              >
                <Phone className="h-3.5 w-3.5" />
                Кіру
              </button>
            )}

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              className="hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 md:flex"
            >
              <Settings className="h-4 w-4" />
              Басқару
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showLogin && (
          <PhoneLogin
            onSuccess={() => setShowLogin(false)}
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
