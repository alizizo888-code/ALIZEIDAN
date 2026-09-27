import React, { useState } from 'react';
import { X, Database, Copy, Check, Shield, Workflow, Terminal } from 'lucide-react';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'sql' | 'workflow';
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({
  isOpen,
  onClose,
  mode = 'sql',
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'triggers' | 'rls' | 'workflows'>(
    mode === 'workflow' ? 'workflows' : 'sql'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const SQL_MIGRATION = `-- =========================================================================
-- مُتقن للصيانة (Mutqan Maintenance Platform)
-- Oxygen Maintenance & General Contracting Est.
-- General Engineering Supervision: Eng. Ali Talaat Zeidan (alizizo888@gmail.com)
-- Enterprise PostgreSQL & Supabase Migration with PostGIS & RLS
-- =========================================================================

-- Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. ENUMS DEFINITIONS
CREATE TYPE user_role_enum AS ENUM ('customer', 'technician', 'dispatcher', 'sovereign_owner');
CREATE TYPE order_status_enum AS ENUM ('draft', 'bidding', 'dispatched', 'in_progress', 'completed', 'disputed', 'cancelled');
CREATE TYPE escrow_status_enum AS ENUM ('held', 'released', 'refunded', 'held_for_sovereign_approval');
CREATE TYPE service_category_enum AS ENUM ('hvac', 'plumbing', 'electrical', 'carpentry', 'appliances', 'satellite', 'tiling', 'security');

-- 2. PROFILES TABLE (RBAC & Financial Ledgers)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    role user_role_enum NOT NULL DEFAULT 'customer',
    national_id TEXT,
    cr_number TEXT,
    wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cash_collected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PROPERTIES TABLE (SPL National Address & Coordinates)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_type TEXT NOT NULL DEFAULT 'villa',
    spl_building_no TEXT NOT NULL,
    spl_additional_no TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    coordinates geography(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. WORK ORDERS TABLE (Core State Machine)
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES profiles(id),
    technician_id UUID REFERENCES profiles(id),
    service_category service_category_enum NOT NULL,
    service_title TEXT NOT NULL,
    status order_status_enum NOT NULL DEFAULT 'draft',
    safe_otp TEXT NOT NULL, -- 4-digit physical handshake code
    live_location geography(Point, 4326),
    delta_t NUMERIC(5, 2), -- Air Conditioning Delta-T °C
    suction_pressure NUMERIC(6, 2), -- Low side PSI
    discharge_pressure NUMERIC(6, 2), -- High side PSI
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    platform_cut NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    escrow_status escrow_status_enum NOT NULL DEFAULT 'held',
    zatca_invoice_no TEXT,
    zatca_qr_payload TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. LIVE TRACKING TABLE (Sub-second Realtime Telemetry)
CREATE TABLE live_tracking (
    technician_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    current_location geography(Point, 4326) NOT NULL,
    heading NUMERIC(5, 2) DEFAULT 0,
    speed NUMERIC(5, 2) DEFAULT 0,
    battery_level INT CHECK (battery_level BETWEEN 0 AND 100),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PLATFORM SWITCHES TABLE (Reactive Sovereign Switchboard)
CREATE TABLE platform_switches (
    feature_name TEXT PRIMARY KEY,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_by TEXT NOT NULL DEFAULT 'alizizo888@gmail.com',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. AUDIT SECURITY LEDGER
CREATE TABLE audit_security_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    amount NUMERIC(12, 2),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. AUTOMATED TRIGGERS & FUNCTIONS

-- Function A: Safe OTP Door Handshake
CREATE OR REPLACE FUNCTION verify_safe_otp(p_order_id UUID, p_entered_otp TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_order_otp TEXT;
BEGIN
    SELECT safe_otp INTO v_order_otp FROM work_orders WHERE id = p_order_id;
    IF v_order_otp = p_entered_otp THEN
        UPDATE work_orders 
        SET status = 'in_progress', updated_at = now() 
        WHERE id = p_order_id;
        
        INSERT INTO audit_security_ledger (user_id, action, payload)
        VALUES (auth.uid(), 'SAFE_OTP_VERIFIED', jsonb_build_object('order_id', p_order_id));
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function B: Auto-Escrow & Commission Deduction on Completion
CREATE OR REPLACE FUNCTION auto_escrow_and_commission()
RETURNS TRIGGER AS $$
DECLARE
    v_commission_rate NUMERIC;
    v_cut NUMERIC;
    v_tech_earnings NUMERIC;
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Fetch dynamic platform commission (default 18.5%)
        SELECT COALESCE(
            (SELECT (payload->>'commission')::NUMERIC FROM audit_security_ledger WHERE action = 'SET_COMMISSION' ORDER BY created_at DESC LIMIT 1),
            18.5
        ) INTO v_commission_rate;

        v_cut := ROUND((NEW.total_cost * (v_commission_rate / 100.0)), 2);
        v_tech_earnings := NEW.total_cost - v_cut;

        NEW.platform_cut := v_cut;
        NEW.escrow_status := 'released';

        -- Credit technician wallet
        IF NEW.technician_id IS NOT NULL THEN
            UPDATE profiles 
            SET wallet_balance = wallet_balance + v_tech_earnings 
            WHERE id = NEW.technician_id;
        END IF;

        -- Log audit
        INSERT INTO audit_security_ledger (user_id, action, amount, payload)
        VALUES (NEW.technician_id, 'ORDER_ESCROW_RELEASED', v_tech_earnings, jsonb_build_object('order_no', NEW.order_no, 'platform_cut', v_cut));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_escrow_and_commission
BEFORE UPDATE ON work_orders
FOR EACH ROW EXECUTE FUNCTION auto_escrow_and_commission();

-- Function C: Sovereign Time-Lock Governance for Transactions > 10,000 SAR
CREATE OR REPLACE FUNCTION sovereign_timelock_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.amount > 10000.00 THEN
        NEW.action := 'HELD_FOR_SOVEREIGN_APPROVAL';
        INSERT INTO audit_security_ledger (user_id, action, amount, payload)
        VALUES (auth.uid(), 'TIME_LOCK_TRIGGERED', NEW.amount, jsonb_build_object('alert', 'Transaction exceeds 10,000 SAR limit. Requires manual signature of Eng. Ali Talaat Zeidan.'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_switches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_security_ledger ENABLE ROW LEVEL SECURITY;

-- SOVEREIGN OWNER ABSOLUTE BYPASS RULE (alizizo888@gmail.com / 0549423050)
CREATE POLICY sovereign_owner_full_bypass ON profiles
FOR ALL TO authenticated
USING (
    auth.jwt() ->> 'email' = 'alizizo888@gmail.com' OR 
    (SELECT phone FROM profiles WHERE id = auth.uid()) = '0549423050'
)
WITH CHECK (
    auth.jwt() ->> 'email' = 'alizizo888@gmail.com' OR 
    (SELECT phone FROM profiles WHERE id = auth.uid()) = '0549423050'
);

-- Tenant Isolation: Customers only see their own orders
CREATE POLICY customer_order_isolation ON work_orders
FOR ALL TO authenticated
USING (customer_id = auth.uid() OR auth.jwt() ->> 'email' = 'alizizo888@gmail.com');

-- Technicians only see assigned/broadcasted jobs
CREATE POLICY technician_order_access ON work_orders
FOR SELECT TO authenticated
USING (technician_id = auth.uid() OR status = 'bidding' OR auth.jwt() ->> 'email' = 'alizizo888@gmail.com');

-- Supabase Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE work_orders, live_tracking, platform_switches;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-5 border border-[#bccac0]/30 max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#bccac0]/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0b1c30]">
                  هندسة قاعدة البيانات السحابية (Cloud Architecture & DDL)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                  PostgreSQL 16 + PostGIS
                </span>
              </div>
              <p className="text-xs text-[#565e74]">
                مخطط Supabase الشامل، دوال الأمان والزناد (Triggers)، وسياسات الـ RLS السيادية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#565e74] flex items-center justify-center hover:bg-[#e5eeff] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-[#bccac0]/20 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#565e74]'
              }`}
            >
              مخطط DDL والجداول
            </button>
            <button
              onClick={() => setActiveTab('triggers')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'triggers'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#565e74]'
              }`}
            >
              الدوال والزناد (Triggers)
            </button>
            <button
              onClick={() => setActiveTab('rls')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rls'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#565e74]'
              }`}
            >
              سياسات RLS والسيادة
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'workflows'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#565e74]'
              }`}
            >
              أتمتة n8n و Make.com
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] text-xs font-bold flex items-center gap-1.5 border border-[#bccac0]/20 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto bg-[#213145] text-emerald-300 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-white/10" dir="ltr">
          {activeTab === 'workflows' ? (
            <div className="space-y-4 text-white font-sans text-right" dir="rtl">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-emerald-400 text-sm mb-1">
                  1. سير العمل A: حجز فوري وإشعار WhatsApp التلقائي
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  <strong>Trigger:</strong> New row inserted into Supabase `work_orders` table.
                  <br />
                  <strong>Action 1:</strong> Call WhatsApp Cloud API with template in Saudi dialect containing Tracking URL & Safe OTP:
                  <br />
                  <code className="text-emerald-300 block my-1 font-mono text-[11px] p-2 bg-black/30 rounded" dir="ltr">
                    "حياك الله أستاذ سعود، تم استلام طلب صيانة التكييف رقم #OXY-9082. كود الدخول الآمن للفني هو: 7412."
                  </code>
                  <strong>Action 2:</strong> Push broadcast to the 3 nearest qualified technicians based on PostGIS ST_DWithin radius &gt; 5 km.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-emerald-400 text-sm mb-1">
                  2. سير العمل B: المساعد الصوتي الذكي (Voice AI Inbound Booking Agent)
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  <strong>Trigger:</strong> Inbound call to 920031015 (Oxygen Hotline).
                  <br />
                  <strong>Action:</strong> AI Voice Agent trained on Saudi dialect extracts caller name, National Address SPL, and AC fault description. Automatically inserts record into `work_orders` without human dispatcher intervention.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-emerald-400 text-sm mb-1">
                  3. سير العمل C: خط إنتاج المحتوى الفني والـ SEO (Automated HVAC Authority Pipeline)
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  <strong>Trigger:</strong> Weekly cron schedule (كل سبت 08:00 صباحاً).
                  <br />
                  <strong>Action:</strong> Generates localized technical maintenance guides for Jeddah and Riyadh climates, auto-publishes to WordPress blog with rich JSON-LD Schema markup and pushes updates to field techs.
                </p>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">{SQL_MIGRATION}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
