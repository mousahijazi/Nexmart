"use client";
import { ShieldCheck, AlertTriangle, CreditCard, CheckCircle2, XCircle } from "lucide-react";

export default function PaymentTestNotice() {
    return (
        <div className="w-full max-w-7xl flex flex-col gap-4 text-xs font-sans px-3 min-[480px]:px-6 py-12">
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 shrink-0">
                    <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                    <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
                        <span>بيئة اختبار تجريبية (Test Mode)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200">
                            بيانات مشفرة 100%
                        </span>
                    </div>
                    <p className="mt-1 text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
                        جميع البيانات المدخلة مشفرة وآمنة تماماً. هذه العملية في الوضع التجريبي حالياً ونحن نعمل على تفعيل الدفع الحقيقي قريباً لتتمكن من الشراء الفعلي.
                    </p>
                </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 flex items-center gap-2.5 text-rose-800 dark:text-rose-300">
                <AlertTriangle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
                <span className="font-semibold">
                    تنبيه: لا يمكن استخدام بطاقات مدى (Mada) في الوقت الحالي أثناء البيئة التجريبية.
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/90 dark:bg-zinc-900/70 border border-gray-200/80 dark:border-zinc-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#5B3A21] dark:text-[#A68A64]">
                    <CreditCard size={18} />
                    <span>بيانات البطاقات المتاحة للتجربة:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="p-3 rounded-xl bg-[#f1f1f1] dark:bg-zinc-800/80 border border-emerald-100 dark:border-emerald-950/40 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center gap-2 justify-between font-bold text-emerald-700 dark:text-emerald-400">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} /> Visa / Mastercard (تسمح بالدفع)
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800">
                                ناجحة
                            </span>
                        </div>
                        <div className="font-mono text-gray-700 dark:text-gray-300 space-y-1">
                            <div><strong className="text-gray-600">Visa:</strong> 4111 1111 1111 1111</div>
                            <div><strong className="text-gray-600">Mastercard:</strong> 5555 5555 5555 4444</div>
                            <div className="text-[11px] text-gray-700">Exp: 12/28 | CVC: 123</div>
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f1f1f1] dark:bg-zinc-800/80 border border-rose-100 dark:border-rose-950/40 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center gap-2 justify-between font-bold text-rose-700 dark:text-rose-400">
                            <span className="flex items-center gap-1.5">
                                <XCircle size={14} /> بطاقة مرفوضة (اختبار الفشل)
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 rounded border border-rose-200 dark:border-rose-800">
                                مرفوضة
                            </span>
                        </div>
                        <div className="font-mono text-gray-700 dark:text-gray-300 space-y-1">
                            <div><strong className="text-gray-600">Declined Card:</strong> 4000 0000 0000 0002</div>
                            <div className="text-[11px] text-gray-600">Exp: 12/28 | CVC: 123</div>
                            <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-1">
                                * توجهك لصفحة البنك ثم ترجع برسالة "Card Declined".
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}