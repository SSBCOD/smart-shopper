import { motion } from 'framer-motion';
import { CheckCircle, Printer } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  orderId: string;
  phone: string;
  items: ReceiptItem[];
  total: number;
  date: string;
}

export function Receipt({ orderId, phone, items, total, date }: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="mb-6 flex justify-center"
      >
        <CheckCircle className="h-16 w-16 text-primary" />
      </motion.div>

      <h1 className="text-center font-heading text-2xl font-bold text-foreground">
        Тапсырыс қабылданды!
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Тапсырысыңыз админге жіберілді
      </p>

      {/* Receipt Card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm print:shadow-none">
        <div className="mb-4 border-b border-dashed border-border pb-4 text-center">
          <h2 className="font-heading text-lg font-bold text-foreground">Smart Shop</h2>
          <p className="text-xs text-muted-foreground">Чек / Квитанция</p>
        </div>

        <div className="mb-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тапсырыс №:</span>
            <span className="font-mono text-xs text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Телефон:</span>
            <span className="text-foreground">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Күні:</span>
            <span className="text-foreground">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Төлем әдісі:</span>
            <span className="text-foreground">Қолма-қол (наличка)</span>
          </div>
        </div>

        <div className="border-t border-dashed border-border pt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2 text-left font-medium">Өнім</th>
                <th className="pb-2 text-center font-medium">Саны</th>
                <th className="pb-2 text-right font-medium">Сома</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="py-1.5 text-foreground">{item.name}</td>
                  <td className="py-1.5 text-center text-muted-foreground">{item.quantity}</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 border-t border-dashed border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">Барлығы:</span>
            <span className="font-heading text-xl font-bold text-primary">
              {total.toLocaleString()} ₸
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Сатып алғаныңыз үшін рахмет! 🙏
        </p>
      </div>

      <div className="mt-6 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Printer className="h-4 w-4" />
          Басып шығару
        </button>
        <Link
          to="/catalog"
          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          Каталогқа оралу
        </Link>
      </div>
    </div>
  );
}
