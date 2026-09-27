import React, { useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { TechnicianTelemetry, WorkOrder } from '../types';
import { runGeminiOrderAgent } from '../services/geminiOrderAgent';

interface GeminiCommandCenterProps {
  orders: WorkOrder[];
  techs: TechnicianTelemetry[];
  onCreateOrder: (order: Partial<WorkOrder>) => void;
  onNavigate: (target: 'customer' | 'technician' | 'operations' | 'sovereign' | 'register' | 'landing') => void;
}

export const GeminiCommandCenter: React.FC<GeminiCommandCenterProps> = ({
  orders,
  techs,
  onCreateOrder,
  onNavigate,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!message.trim() || busy) return;
    setBusy(true);
    setAnswer('');
    try {
      const result = await runGeminiOrderAgent(message.trim(), orders, techs);
      if (result.action === 'create_order') {
        onCreateOrder({
          customerName: result.customerName || 'عميل جديد',
          customerPhone: result.customerPhone || '',
          serviceCategory: result.category,
          serviceTitle: result.serviceTitle,
          description: result.description,
          city: result.city,
          district: result.district,
          status: 'pending',
          totalCost: result.totalCost || 0,
          platformCutPercentage: 18.5,
          platformCutAmount: result.totalCost ? result.totalCost * 0.185 : 0,
          technicianCutAmount: result.totalCost ? result.totalCost * 0.815 : 0,
          escrowStatus: 'held',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setAnswer('تم تحويل كلامك إلى طلب خدمة فعلي وتسجيله في النظام.');
      } else if (result.action === 'navigate') {
        onNavigate(result.target);
        setAnswer('تم فتح القسم المطلوب.');
      } else {
        setAnswer(result.message);
      }
    } catch {
      setAnswer('حصل خطأ أثناء الاتصال بمساعد Gemini. تأكد من إعداد مفتاح البيئة ثم جرّب مرة أخرى.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" dir="rtl">
      {open && (
        <div className="mb-3 w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-[#bccac0]/30 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#0b1c30] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#85f8c4]" />
              <div>
                <div className="text-sm font-black">مساعد مُتقِن الذكي</div>
                <div className="text-[10px] text-white/70">Gemini • أوامر وتشغيل</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-xs leading-6 text-[#565e74]">اكتب مثلاً: «عايز فني تكييف في الرياض لإصلاح المكيف» أو «افتح غرفة العمليات».</p>
            {answer && <div className="rounded-2xl bg-[#eff4ff] p-3 text-xs font-bold leading-6 text-[#0b1c30]">{answer}</div>}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void submit(); } }}
              placeholder="اكتب الأمر هنا..."
              className="min-h-24 w-full resize-none rounded-2xl border border-[#d8dfdb] p-3 text-sm outline-none focus:border-[#006948]"
            />
            <button onClick={() => void submit()} disabled={busy || !message.trim()} className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#006948] text-sm font-black text-white disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {busy ? 'جاري التنفيذ...' : 'نفّذ الأمر'}
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#006948] text-white shadow-xl ring-4 ring-white">
        <Bot className="h-6 w-6" />
      </button>
    </div>
  );
};
