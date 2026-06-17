import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, X, Save, Package, Upload, ImageIcon, ClipboardList, Check, XCircle, Phone, Lock, LogOut, Truck, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/store';
import { isAdmin, setAdmin, logoutAdmin, ADMIN_LOGIN, ADMIN_PASSWORD } from '@/lib/auth';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Админ панель — Smart Shop' },
      { name: 'description', content: 'Өнімдерді басқару панелі' },
    ],
  }),
  component: AdminPage,
});

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  imagePreview: '',
  inStock: true,
};

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  payment_method: string;
  customer: { phone: string } | null;
  items: { product_name: string; product_price: number; quantity: number }[];
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(isAdmin());
  }, []);

  useEffect(() => {
    if (!authed) return;
    setProducts(getProducts());
    fetchOrders();
  }, [authed]);

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('id, total, status, created_at, customer_id, payment_method')
      .order('created_at', { ascending: false });

    if (!ordersData) return;

    const enriched: Order[] = [];
    for (const o of ordersData) {
      const { data: customer } = await supabase
        .from('customers')
        .select('phone')
        .eq('id', o.customer_id)
        .maybeSingle();

      const { data: items } = await supabase
        .from('order_items')
        .select('product_name, product_price, quantity')
        .eq('order_id', o.id);

      enriched.push({
        id: o.id,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
        payment_method: o.payment_method,
        customer: customer,
        items: items || [],
      });
    }
    setOrders(enriched);
  };

  const refresh = () => setProducts(getProducts());

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      category: p.category,
      image: p.image,
      imagePreview: p.image,
      inStock: p.inStock,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      inStock: form.inStock,
    };
    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    refresh();
  };

  const handleOrderStatus = async (orderId: string, status: 'accepted' | 'rejected' | 'in_delivery' | 'completed') => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
  };

  const statusLabel: Record<string, { text: string; cls: string }> = {
    pending: { text: 'Күтуде', cls: 'bg-yellow-100 text-yellow-800' },
    accepted: { text: 'Қабылданды', cls: 'bg-blue-100 text-blue-800' },
    in_delivery: { text: 'Жеткізілуде', cls: 'bg-indigo-100 text-indigo-800' },
    completed: { text: 'Аяқталды', cls: 'bg-green-100 text-green-800' },
    rejected: { text: 'Қабылданбады', cls: 'bg-red-100 text-red-800' },
  };

  if (!authed) {
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (loginForm.login === ADMIN_LOGIN && loginForm.password === ADMIN_PASSWORD) {
        setAdmin();
        setAuthed(true);
      } else {
        setLoginError('Қате логин немесе құпия сөз');
      }
    };
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground">Админ кіру</h1>
          <p className="mt-1 text-sm text-muted-foreground">Логин және құпия сөзді енгізіңіз</p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input
              value={loginForm.login}
              onChange={e => setLoginForm({ ...loginForm, login: e.target.value })}
              placeholder="Логин"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
              autoFocus
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Құпия сөз"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
            />
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <button type="submit" className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">
              Кіру
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Админ панель</h1>
          <p className="mt-1 text-muted-foreground">Өнімдерді және тапсырыстарды басқару</p>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'products' && (
            <button
              onClick={openAdd}
              className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Жаңа өнім
            </button>
          )}
          <button
            onClick={() => { logoutAdmin(); setAuthed(false); }}
            className="flex h-10 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Шығу
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab('products')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          <Package className="h-4 w-4" />
          Өнімдер
        </button>
        <button
          onClick={() => { setTab('orders'); fetchOrders(); }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Тапсырыстар
        </button>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {editingId ? 'Өнімді өзгерту' : 'Жаңа өнім қосу'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Атауы</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                    placeholder="Өнім атауы"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Сипаттамасы</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="h-20 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                    placeholder="Өнім сипаттамасы"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Бағасы (₸)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Санаты</label>
                    <input
                      required
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                      placeholder="Жемістер"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Сурет</label>
                  <div className="flex items-center gap-3">
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-border" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-input bg-secondary/50">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm text-foreground transition-colors hover:bg-secondary">
                      <Upload className="h-4 w-4" />
                      Файлды таңдау
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = reader.result as string;
                              setForm({ ...form, image: result, imagePreview: result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={e => setForm({ ...form, inStock: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  <label className="text-sm text-foreground">Қоймада бар</label>
                </div>
                <button
                  type="submit"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Сақтау' : 'Қосу'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Сурет</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Атауы</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Санаты</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Бағасы</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Қоймада</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Әрекеттер</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">
                      {p.price.toLocaleString()} ₸
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.inStock ? 'bg-success' : 'bg-destructive'}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="rounded-lg bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground"
                            >
                              Иә
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-foreground"
                            >
                              Жоқ
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="flex flex-col items-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 opacity-40" />
              <p className="mt-3">Өнімдер жоқ</p>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 && (
            <div className="flex flex-col items-center py-16 text-muted-foreground">
              <ClipboardList className="h-12 w-12 opacity-40" />
              <p className="mt-3">Тапсырыстар жоқ</p>
            </div>
          )}
          {orders.map(order => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabel[order.status]?.cls || ''}`}>
                      {statusLabel[order.status]?.text || order.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {order.customer?.phone || 'Белгісіз'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString('kk-KZ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg font-bold text-primary">{order.total.toLocaleString()} ₸</p>
                  <p className="text-xs text-muted-foreground">{order.payment_method === 'cash' ? 'Қолма-қол' : order.payment_method}</p>
                </div>
              </div>

              {/* Order items */}
              <div className="mt-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.product_name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                    <span className="text-muted-foreground">{(item.product_price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => handleOrderStatus(order.id, 'accepted')} className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">
                      <Check className="h-4 w-4" /> Қабылдау
                    </button>
                    <button onClick={() => handleOrderStatus(order.id, 'rejected')} className="flex h-9 items-center gap-1.5 rounded-lg bg-destructive/10 px-4 text-sm font-medium text-destructive hover:bg-destructive/20">
                      <XCircle className="h-4 w-4" /> Қабылдамау
                    </button>
                  </>
                )}
                {order.status === 'accepted' && (
                  <button onClick={() => handleOrderStatus(order.id, 'in_delivery')} className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">
                    <Truck className="h-4 w-4" /> Жеткізуге беру
                  </button>
                )}
                {order.status === 'in_delivery' && (
                  <button onClick={() => handleOrderStatus(order.id, 'completed')} className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">
                    <CheckCheck className="h-4 w-4" /> Аяқтау
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
