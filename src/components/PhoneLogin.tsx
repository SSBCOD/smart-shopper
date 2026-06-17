import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { setAuth } from '@/lib/auth';

interface PhoneLoginProps {
  onSuccess: () => void;
  onClose?: () => void;
}

export function PhoneLogin({ onSuccess, onClose }: PhoneLoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) {
      setError('Телефон нөмірін дұрыс енгізіңіз');
      return;
    }
    if (password.length < 4) {
      setError('Құпия сөз кемінде 4 таңбадан тұруы керек');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: existing } = await supabase
        .from('customers')
        .select('id, password')
        .eq('phone', cleaned)
        .maybeSingle();

      if (mode === 'login') {
        if (!existing) {
          setError('Мұндай қолданушы табылмады. Тіркеліңіз.');
          return;
        }
        if (existing.password !== password) {
          setError('Құпия сөз қате');
          return;
        }
        setAuth(cleaned, existing.id);
        onSuccess();
      } else {
        if (existing) {
          setError('Бұл нөмір тіркелген. Кіріңіз.');
          return;
        }
        const { data: newCustomer, error: insertErr } = await supabase
          .from('customers')
          .insert({ phone: cleaned, password })
          .select('id')
          .single();
        if (insertErr) throw insertErr;
        setAuth(cleaned, newCustomer.id);
        onSuccess();
      }
    } catch (err) {
      setError('Қате орын алды. Қайталап көріңіз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          {mode === 'login' ? 'Кіру' : 'Тіркелу'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Телефон нөмірі мен құпия сөз
        </p>

        <div className="mt-4 flex gap-1 rounded-xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Кіру
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Тіркелу
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+7 777 123 4567"
              className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-base text-foreground outline-none ring-ring focus:ring-2"
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Құпия сөз"
              className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-base text-foreground outline-none ring-ring focus:ring-2"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Күтіңіз...' : (
              <>
                {mode === 'login' ? 'Кіру' : 'Тіркелу'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
