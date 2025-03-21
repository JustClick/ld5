/*
  # Create invoices collection

  1. Collections
    - `invoices`
      - `id` (auto-generated)
      - `invoiceNumber` (string)
      - `workCode` (string)
      - `clientId` (string)
      - `clientName` (string)
      - `clientCompany` (string)
      - `serviceType` (string)
      - `amount` (number)
      - `materials` (string, optional)
      - `paymentTerms` (string)
      - `status` (string: pending, paid, overdue)
      - `date` (timestamp)
      - `dueDate` (timestamp)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
      - `details` (object)
        - `hoursWorked` (number)
        - `ratePerHour` (number)
      - `notes` (string, optional)

  2. Indexes
    - `invoiceNumber` (ascending)
    - `clientId` (ascending)
    - `status` (ascending)
    - `date` (descending)
*/

-- Create invoices collection
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL,
  work_code TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id),
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  service_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  materials TEXT,
  payment_terms TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
  date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB NOT NULL,
  notes TEXT,
  UNIQUE(invoice_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date DESC);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can insert invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'super_admin'
  ));

CREATE POLICY "Super admins can update invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'super_admin'
  ));