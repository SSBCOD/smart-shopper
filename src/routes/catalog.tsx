import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';
import type { Product } from '@/lib/store';

export const Route = createFileRoute('/catalog')({
  head: () => ({
    meta: [
      { title: 'Каталог — Smart Shop' },
      { name: 'description', content: 'Барлық өнімдер каталогы — Smart Shopping List' },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Барлығы');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setProducts(getProducts());
    setCategories(['Барлығы', ...getCategories()]);
  }, []);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'Барлығы' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Өнімдер каталогы</h1>
      <p className="mt-2 text-muted-foreground">Сапалы өнімдерді таңдаңыз</p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Өнімді іздеу..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none ring-ring focus:ring-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          Өнімдер табылмады
        </div>
      )}
    </div>
  );
}
