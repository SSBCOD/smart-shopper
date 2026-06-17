import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/store';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Smart Shop — Ақылды сатып алу тізімі' },
      { name: 'description', content: 'Smart Shopping List — сатып алуларды жоспарлауға арналған интернет-дүкен' },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts().slice(0, 4));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-success to-primary py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground">
              🛒 Ақылды сатып алу
            </span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Smart Shopping List
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Сатып алуларды оңай жоспарлаңыз. Сапалы өнімдер, қолайлы бағалар.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/catalog"
                className="flex h-12 items-center gap-2 rounded-full bg-card px-6 text-sm font-semibold text-foreground shadow-lg transition-all hover:shadow-xl"
              >
                Каталогқа өту
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Жылдам жеткізу', desc: 'Тапсырысты 24 сағат ішінде жеткіземіз' },
              { icon: Shield, title: 'Сапа кепілдігі', desc: 'Барлық өнімдер сертификатталған' },
              { icon: ShoppingBag, title: 'Қолайлы бағалар', desc: 'Ең тиімді бағалар мен жеңілдіктер' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground">Танымал өнімдер</h2>
            <Link
              to="/catalog"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Барлығын көру <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
