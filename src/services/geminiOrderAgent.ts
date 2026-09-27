import { GoogleGenAI } from '@google/genai';
import { TechnicianTelemetry, ServiceCategory, WorkOrder } from '../types';

export type GeminiOrderAction =
  | { action: 'create_order'; serviceTitle: string; category: ServiceCategory; description: string; city: WorkOrder['city']; district: string; customerName?: string; customerPhone?: string; totalCost?: number }
  | { action: 'navigate'; target: 'customer' | 'technician' | 'operations' | 'sovereign' | 'register' | 'landing' }
  | { action: 'reply'; message: string };

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

function buildContext(orders: WorkOrder[], techs: TechnicianTelemetry[]) {
  return {
    orders: orders.slice(0, 12).map((o) => ({ orderNo: o.orderNo, serviceTitle: o.serviceTitle, category: o.serviceCategory, status: o.status, city: o.city, district: o.district, technician: o.technicianName, totalCost: o.totalCost })),
    technicians: techs.map((t) => ({ name: t.technicianName, status: t.status, city: t.city, district: t.district, activeOrderId: t.activeOrderId })),
  };
}

export async function runGeminiOrderAgent(userMessage: string, orders: WorkOrder[], techs: TechnicianTelemetry[]): Promise<GeminiOrderAction> {
  if (!apiKey) return { action: 'reply', message: 'مفتاح Gemini غير مضبوط. أضف VITE_GEMINI_API_KEY إلى بيئة التشغيل ثم أعد المحاولة.' };

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
أنت مساعد التشغيل الذكي لمنصة مُتقِن لخدمات الصيانة والتشغيل الميداني.
مهمتك فهم طلب المستخدم وتحويله إلى إجراء واضح داخل النظام.
- طلب خدمة أو إرسال فني => create_order.
- فتح بوابة => navigate.
- سؤال معلوماتي => reply.
- لا تخترع رقم هاتف أو اسم عميل أو موقعاً لم يذكره المستخدم.
- إذا نقصت معلومة أساسية لإنشاء الطلب، استخدم reply واطلب المعلومة الناقصة.
- category واحدة من: hvac, plumbing, electrical, appliances, carpentry, satellite, tiling, security.
- city واحدة من: الرياض, جدة, مكة المكرمة.
- أرجع JSON فقط بدون Markdown.

بيانات التشغيل الحالية:
${JSON.stringify(buildContext(orders, techs))}

رسالة المستخدم:
${userMessage}

صيغة JSON:
{"action":"create_order|navigate|reply", ...}
`;

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
  const text = response.text?.trim();
  if (!text) return { action: 'reply', message: 'لم أستطع استخراج إجراء من الطلب.' };

  try { return JSON.parse(text) as GeminiOrderAction; }
  catch { return { action: 'reply', message: 'وصل رد غير منظم من Gemini. جرّب صياغة الطلب بشكل أبسط.' }; }
}
