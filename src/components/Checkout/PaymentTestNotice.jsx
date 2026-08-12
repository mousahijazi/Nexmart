"use client";
import {ShieldCheck, AlertTriangle, CreditCard, CheckCircle2, XCircle} from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentTestNotice() {
    const t = useTranslations();

    return (
        <section className="w-full max-w-7xl min-[480px]:px-6 py-12 flex flex-col gap-5">
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-3 min-[480px]:p-5 flex flex-col sm:flex-row gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#5B3A21]/10 dark:bg-[#A68A64]/10 text-[#5B3A21] dark:text-[#A68A64] shrink-0">
                    <ShieldCheck size={22} />
                </div>

                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            {t("checkout.payPage.Test.title")}
                        </h3>
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#5B3A21]/10 dark:bg-[#A68A64]/10 text-[#5B3A21] dark:text-[#A68A64]">
                            {t("checkout.payPage.Test.secondTitle")}
                        </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-zinc-300">
                        {t.rich("checkout.payPage.Test.Desc", {
                            bold: (chunks) => <strong>{chunks}</strong>,
                        })}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#5B3A21] dark:text-[#A68A64] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-6">
                    {t("checkout.payPage.Test.availableCard")}
                </p>
            </div>

            <div className="rounded-2xl min-[480px]:border border-gray-200 dark:border-zinc-800 min-[480px]:bg-white min-[480px]:dark:bg-zinc-900 min-[480px]:p-6">
                <div className="flex items-center gap-2 mb-5">
                    <CreditCard size={18} className="text-[#5B3A21] dark:text-[#A68A64]" />
                    <h3 className="text-base font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                        {t("checkout.payPage.Test.card.title")}
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-4 flex flex-col gap-3">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-600"/>
                                <span className="text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                    {t("checkout.payPage.Test.card.successfulCard.title")}
                                </span>
                            </div>
                            <span className="rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[11px] px-2 py-1 font-medium">
                                {t("checkout.payPage.Test.card.successfulCard.approved")}
                            </span>
                        </div>

                        <div dir="ltr" className="font-mono text-sm text-gray-700 dark:text-zinc-300">
                            <p>Visa</p>
                            <p>4111 1111 1111 1111</p>
                            <p>Exp: 12 / 28</p>
                            <p>CVC: 123</p>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-5">
                            {t("checkout.payPage.Test.card.successfulCard.Desc")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-4 flex flex-col gap-3">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <XCircle size={16} className="text-red-600" />
                                <span className="text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                    {t("checkout.payPage.Test.card.failedCard.title")}
                                </span>
                            </div>
                            <span className="rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[11px] px-2 py-1 font-medium">
                                {t("checkout.payPage.Test.card.failedCard.declined")}
                            </span>
                        </div>

                        <div dir="ltr" className="font-mono text-sm text-gray-700 dark:text-zinc-300">
                            <p>{t("checkout.payPage.Test.card.failedCard.declinedCard")}</p>
                            <p>4000 0000 0000 0002</p>
                            <p>Exp: 12 / 28</p>
                            <p>CVC: 123</p>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-5">
                            {t("checkout.payPage.Test.card.failedCard.Desc")}
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}