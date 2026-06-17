import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal } from '@/lib/store';
import { getPhone, getCustomerId, isLoggedIn } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Banknote, QrCode, CreditCard, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneLogin } from '@/components/PhoneLogin';
import { Receipt } from '@/components/Receipt';
import type { CartItem } from '@/lib/store';
import kaspiQrImage from '@/assets/kaspi-qr.png';

export const Route = createFileRoute('/cart')({
  head: () => ({
    meta: [
      { title: 'Себет — Smart Shop' },
      { name: 'description', content: 'Сіздің сатып алу себетіңіз' },
    ],
  }),
  component: CartPage,
});

interface OrderResult {
  orderId: string;
  phone: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  date: string;
}

function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'kaspi'>('cash');
  const [showKaspiQr, setShowKaspiQr] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = getCartTotal(cart);

  const handleRemove = (id: string) => {
    const updated = removeFromCart(id);
    setCart(updated);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleQty = (id: string, qty: number) => {
    const updated = updateCartQuantity(id, qty);
    setCart(updated);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn()) {
      setShowLogin(true);
    } else {
      setShowCheckout(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    try {
      const customerId = getCustomerId();
      const phone = getPhone();
      if (!customerId || !phone) return;

      // Create order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({ customer_id: customerId, total, payment_method: paymentMethod })
        .select('id')
        .single();

      if (orderErr) throw orderErr;

      // Create order items
      const items = cart.map(item => ({
        order_id: order.id,
        product_name: item.product.name,
        product_price: item.product.price,
        product_image: item.product.image,
        quantity: item.quantity,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(items);

      if (itemsErr) throw itemsErr;

      // Set result for receipt
      setOrderResult({
        orderId: order.id,
        phone,
        items: cart.map(i => ({
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total,
        date: new Date().toLocaleString('kk-KZ'),
      });

      // Clear cart
      clearCart();
      setCart([]);
      window.dispatchEvent(new Event('cart-updated'));
      setShowCheckout(false);
      setShowKaspiQr(false);
    } catch (err) {
      console.error('Order error:', err);
      alert('Қате орын алды. Қайталап көріңіз.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show receipt
  if (orderResult) {
    return (
      <Receipt
        orderId={orderResult.orderId}
        phone={orderResult.phone}
        items={orderResult.items}
        total={orderResult.total}
        date={orderResult.date}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Себет бос</h1>
        <p className="mt-2 text-muted-foreground">Каталогтан өнімдерді қосыңыз</p>
        <Link
          to="/catalog"
          className="mt-6 flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Каталогқа оралу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Сатып алу себеті</h1>
      <p className="mt-1 text-muted-foreground">{cart.length} өнім</p>

      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {cart.map(item => (
            <motion.div
              key={item.product.id}
              layout
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-heading text-sm font-semibold text-foreground">{item.product.name}</h3>
                <p className="text-sm text-primary font-semibold">
                  {item.product.price.toLocaleString()} ₸
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQty(item.product.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-accent"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQty(item.product.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-accent"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="w-20 text-right font-heading text-sm font-bold text-foreground">
                {(item.product.price * item.quantity).toLocaleString()} ₸
              </span>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-foreground">Жалпы сома:</span>
          <span className="font-heading text-2xl font-bold text-primary">{total.toLocaleString()} ₸</span>
        </div>
        <button
          onClick={handleCheckoutClick}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Тапсырысты рәсімдеу
        </button>
      </div>

      {/* Phone Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <PhoneLogin onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <h2 className="font-heading text-lg font-bold text-foreground">Тапсырысты растау</h2>
              <p className="mt-1 text-sm text-muted-foreground">Телефон: {getPhone()}</p>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Төлем әдісі</p>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-secondary/50'}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Banknote className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Қолма-қол</p>
                    <p className="text-xs text-muted-foreground">Жеткізу кезінде төлейсіз</p>
                  </div>
                  {paymentMethod === 'cash' && <span className="h-3 w-3 rounded-full bg-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kaspi')}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${paymentMethod === 'kaspi' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-secondary/50'}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Kaspi QR</p>
                    <p className="text-xs text-muted-foreground">QR кодты сканерлеп төлеңіз</p>
                  </div>
                  {paymentMethod === 'kaspi' && <span className="h-3 w-3 rounded-full bg-primary" />}
                </button>
                <div className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3 opacity-60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">Карта арқылы <Lock className="h-3 w-3" /></p>
                    <p className="text-xs text-muted-foreground">Әзірленуде</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                    <span className="text-foreground">{(item.product.price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">Барлығы:</span>
                <span className="font-heading text-lg font-bold text-primary">{total.toLocaleString()} ₸</span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Артқа
                </button>
                <button
                  onClick={() => {
                    if (paymentMethod === 'kaspi') {
                      setShowKaspiQr(true);
                    } else {
                      handleConfirmOrder();
                    }
                  }}
                  disabled={submitting}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Күтіңіз...' : paymentMethod === 'kaspi' ? 'QR кодты көрсету' : 'Растау'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kaspi QR Modal */}
      <AnimatePresence>
        {showKaspiQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={() => setShowKaspiQr(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <h2 className="text-center font-heading text-lg font-bold text-foreground">Kaspi QR арқылы төлеу</h2>
              <p className="mt-1 text-center text-sm text-muted-foreground">Сома: <span className="font-semibold text-primary">{total.toLocaleString()} ₸</span></p>
              <div className="mt-4 flex justify-center">
                <img src={kaspiQrImage} alt="Kaspi QR" className="w-full max-w-xs rounded-xl" />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">Kaspi.kz қолданбасынан QR кодты сканерлеп, төлемді жасаңыз</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowKaspiQr(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Артқа
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Күтіңіз...' : 'Төледім'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
