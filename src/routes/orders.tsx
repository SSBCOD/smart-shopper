import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCustomerId, isLoggedIn } from '@/lib/auth';
import { ClipboardList, Banknote, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneLogin } from '@/components/PhoneLogin';

export const Route = createFileRoute('/orders')({
  head: () => ({
    meta: [
      { title: 'Менің тапсырыстарым — Smart Shop' },
      { name: 'description', content: 'Тапсырыстар тарихы' },
    ],
  }),
  component: OrdersPage,
});

interface OrderItem { product_name: string; product_price: number; quantity: number }
interface Order {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const statusLabel: Record<string, { text: string; cls: string }> = {
  pending: { text: 'Күтуде', cls: 'bg-yellow-100 text-yellow-800' },
  accepted: { text: 'Қабылданды', cls: 'bg-blue-100 text-blue-800' },
  in_delivery: { text: 'Жеткізілуде', cls: 'bg-indigo-100 text-indigo-800' },
  completed: { text: 'Аяқталды', cls: 'bg-green-100 text-green-800' },
  rejected: { text: 'Қабылданбады', cls: 'bg-red-100 text-red-800' },
};

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [authed, setAuthed] = useState(false);

  const fetchMine = async () => {
    const customerId = getCustomerId();
    if (!customerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: ordersData } = await supabase
      .from('orders')
      .select('id, total, status, payment_method, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    const result: Order[] = [];
    for (const o of ordersData || []) {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_name, product_price, quantity')
        .eq('order_id', o.id);
      result.push({ ...o, items: items || [] });
    }
    setOrders(result);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setAuthed(true);
      fetchMine();
    } else {
      setLoading(false);
    }
    const handler = () => {
      const v = isLoggedIn();
      setAuthed(v);
      if (v) fetchMine();
    };
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <ClipboardList className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Жүйеге кіріңіз</h1>
        <p className="mt-2 text-muted-foreground">Тапсырыстарыңызды көру үшін кіруіңіз керек</p>
        <button
          onClick={() => setShowLogin(true)}
          className="mt-6 flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          Кіру
        </button>
        <AnimatePresence>
          {showLogin && (
            <PhoneLogin onSuccess={() => { setShowLogin(false); setAuthed(true); fetchMine(); }} onClose={() => setShowLogin(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Менің тапсырыстарым</h1>
      <p className="mt-1 text-muted-foreground">Барлық сатып алу тарихыңыз</p>

      {loading && <p className="mt-8 text-center text-muted-foreground">Жүктелуде...</p>}

      {!loading && orders.length === 0 && (
        <div className="mt-12 flex flex-col items-center text-muted-foreground">
          <Package className="h-12 w-12 opacity-40" />
          <p className="mt-3">Сізде әлі тапсырыс жоқ</p>
          <Link to="/catalog" className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Каталогқа өту</Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map(order => (
          <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabel[order.status]?.cls || 'bg-secondary text-foreground'}`}>
                    {statusLabel[order.status]?.text || order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('kk-KZ')}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Banknote className="h-3 w-3" /> Қолма-қол
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-primary">{order.total.toLocaleString()} ₸</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">{it.product_name} × {it.quantity}</span>
                  <span className="text-foreground">{(it.product_price * it.quantity).toLocaleString()} ₸</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
