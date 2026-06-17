import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/store';
import { addToCart } from '@/lib/store';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
              Қоймада жоқ
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-base font-semibold text-foreground">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">
            {product.price.toLocaleString()} ₸
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock || added}
            className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Қосылды
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Себетке
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
