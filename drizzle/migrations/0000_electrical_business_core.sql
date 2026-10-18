CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'sales', 'inventory', 'accountant');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_read_self ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.provision_owner_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER provision_owner_role_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.provision_owner_role();

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_read_owner ON public.categories FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY categories_write_owner ON public.categories FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY categories_update_owner ON public.categories FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY categories_delete_owner ON public.categories FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL CHECK (kind IN ('customer', 'supplier', 'both')),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 160),
  phone text,
  email text,
  gstin text,
  address text,
  credit_limit numeric(14,2) NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
  payment_terms_days integer NOT NULL DEFAULT 0 CHECK (payment_terms_days >= 0),
  lead_time_days integer NOT NULL DEFAULT 0 CHECK (lead_time_days >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, name, kind)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY contacts_read_owner ON public.contacts FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY contacts_insert_owner ON public.contacts FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY contacts_update_owner ON public.contacts FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'inventory'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY contacts_delete_owner ON public.contacts FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  sku text NOT NULL CHECK (length(trim(sku)) BETWEEN 1 AND 64),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 180),
  barcode text,
  brand text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text,
  unit text NOT NULL DEFAULT 'piece',
  purchase_price numeric(14,2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  retail_price numeric(14,2) NOT NULL DEFAULT 0 CHECK (retail_price >= 0),
  wholesale_price numeric(14,2) NOT NULL DEFAULT 0 CHECK (wholesale_price >= 0),
  gst_rate numeric(5,2) NOT NULL DEFAULT 18 CHECK (gst_rate BETWEEN 0 AND 100),
  hsn_code text,
  stock_qty numeric(14,3) NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  minimum_stock numeric(14,3) NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
  reorder_level numeric(14,3) NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  preferred_supplier_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  location text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'discontinued')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, sku)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_read_owner ON public.products FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY products_insert_owner ON public.products FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY products_update_owner ON public.products FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY products_delete_owner ON public.products FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));
CREATE INDEX products_owner_name_idx ON public.products(owner_id, name);
CREATE INDEX products_owner_stock_idx ON public.products(owner_id, stock_qty);

CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  supplier_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  invoice_number text,
  order_date date NOT NULL DEFAULT current_date,
  due_date date,
  status text NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'part_received', 'received', 'cancelled')),
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax_total numeric(14,2) NOT NULL DEFAULT 0,
  freight numeric(14,2) NOT NULL DEFAULT 0 CHECK (freight >= 0),
  total numeric(14,2) NOT NULL DEFAULT 0,
  paid_amount numeric(14,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY purchases_read_owner ON public.purchases FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY purchases_insert_owner ON public.purchases FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY purchases_update_owner ON public.purchases FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY purchases_delete_owner ON public.purchases FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  purchase_id uuid NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity_ordered numeric(14,3) NOT NULL CHECK (quantity_ordered > 0),
  quantity_received numeric(14,3) NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
  unit_cost numeric(14,2) NOT NULL CHECK (unit_cost >= 0),
  discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  gst_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (gst_rate BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_items TO authenticated;
GRANT ALL ON public.purchase_items TO service_role;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY purchase_items_read_owner ON public.purchase_items FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY purchase_items_insert_owner ON public.purchase_items FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY purchase_items_update_owner ON public.purchase_items FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY purchase_items_delete_owner ON public.purchase_items FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  invoice_number text NOT NULL,
  customer_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  sale_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled', 'returned')),
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  discount_total numeric(14,2) NOT NULL DEFAULT 0,
  tax_total numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  paid_amount numeric(14,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, invoice_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY sales_read_owner ON public.sales FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY sales_insert_owner ON public.sales FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'sales')));
CREATE POLICY sales_update_owner ON public.sales FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY sales_delete_owner ON public.sales FOR DELETE TO authenticated USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'owner'));
CREATE INDEX sales_owner_date_idx ON public.sales(owner_id, sale_date DESC);

CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  sku text,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  gst_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (gst_rate BETWEEN 0 AND 100),
  line_total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY sale_items_read_owner ON public.sale_items FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY sale_items_insert_owner ON public.sale_items FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'sales')));
CREATE POLICY sale_items_update_owner ON public.sale_items FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY sale_items_delete_owner ON public.sale_items FOR DELETE TO authenticated USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  sale_id uuid REFERENCES public.sales(id) ON DELETE SET NULL,
  purchase_id uuid REFERENCES public.purchases(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  direction text NOT NULL CHECK (direction IN ('received', 'paid')),
  method text NOT NULL CHECK (method IN ('cash', 'upi', 'bank', 'card', 'credit', 'other')),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  reference text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (sale_id IS NOT NULL OR purchase_id IS NOT NULL OR contact_id IS NOT NULL)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_read_owner ON public.payments FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY payments_insert_owner ON public.payments FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'accountant')));
CREATE POLICY payments_update_owner ON public.payments FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'accountant'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY payments_delete_owner ON public.payments FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  movement_type text NOT NULL CHECK (movement_type IN ('purchase_received', 'sale', 'sale_return', 'purchase_return', 'adjustment', 'damage', 'transfer_in', 'transfer_out')),
  quantity_change numeric(14,3) NOT NULL CHECK (quantity_change <> 0),
  reason text NOT NULL CHECK (length(trim(reason)) BETWEEN 1 AND 300),
  reference_type text,
  reference_id uuid,
  unit_cost numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY movements_read_owner ON public.stock_movements FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY movements_insert_owner ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'inventory')));
CREATE POLICY movements_update_owner ON public.stock_movements FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'owner')) WITH CHECK (owner_id = auth.uid());
CREATE POLICY movements_delete_owner ON public.stock_movements FOR DELETE TO authenticated USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'owner'));
CREATE INDEX movements_product_date_idx ON public.stock_movements(owner_id, product_id, created_at DESC);

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  category text NOT NULL CHECK (length(trim(category)) BETWEEN 1 AND 80),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  expense_date date NOT NULL DEFAULT current_date,
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank', 'card', 'other')),
  reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY expenses_read_owner ON public.expenses FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY expenses_insert_owner ON public.expenses FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'accountant')));
CREATE POLICY expenses_update_owner ON public.expenses FOR UPDATE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'accountant'))) WITH CHECK (owner_id = auth.uid());
CREATE POLICY expenses_delete_owner ON public.expenses FOR DELETE TO authenticated USING (owner_id = auth.uid() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'manager')));

CREATE TABLE public.alert_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  alert_key text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'snoozed')),
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, alert_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alert_actions TO authenticated;
GRANT ALL ON public.alert_actions TO service_role;
ALTER TABLE public.alert_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY alerts_read_owner ON public.alert_actions FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY alerts_insert_owner ON public.alert_actions FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY alerts_update_owner ON public.alert_actions FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY alerts_delete_owner ON public.alert_actions FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  actor_id uuid NOT NULL DEFAULT auth.uid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_read_owner ON public.audit_logs FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY audit_insert_owner ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND actor_id = auth.uid());
