
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS password text NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cash';

ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'in_delivery';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'completed';
