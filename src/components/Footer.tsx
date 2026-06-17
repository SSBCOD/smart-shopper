import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-sm font-bold text-foreground">Smart Shop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Smart Shopping List. Барлық құқықтар қорғалған.
          </p>
        </div>
      </div>
    </footer>
  );
}
