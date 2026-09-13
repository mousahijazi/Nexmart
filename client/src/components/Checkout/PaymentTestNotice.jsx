"use client"; 
import {ShieldCheck, AlertTriangle, CreditCard, CheckCircle2, XCircle} from "lucide-react"; 
import { useTranslations } from "next-intl"; 
 
export default function PaymentTestNotice() { 
    const t = useTranslations(); 
 
    return ( 
        <section className="w-full max-w-7xl min-[480px]:px-6 py-12 flex flex-col gap-5"> 
            <div className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-cream)] dark:bg-[var(--color-cream)] p-3 min-[480px]:p-5 flex flex-col sm:flex-row gap-4"> 
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-green)]/10 dark:bg-[var(--color-gold)]/10 text-[var(--color-green)] dark:text-[var(--color-gold-light)] shrink-0"> 
                    <ShieldCheck size={22} /> 
                </div> 
 
                <div className="flex-1"> 
                    <div className="flex flex-wrap items-center gap-2"> 
                        <h3 className="text-base font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]"> 
                            {t("checkout.payPage.Test.title")} 
                        </h3> 
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-[var(--color-green)]/10 dark:bg-[var(--color-gold)]/10 text-[var(--color-green)] dark:text-[var(--color-gold-light)]"> 
                            {t("checkout.payPage.Test.secondTitle")} 
                        </span> 
                    </div> 
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)] dark:text-[var(--color-soft-2)]"> 
                        {t.rich("checkout.payPage.Test.Desc", { 
                            bold: (chunks) => <strong>{chunks}</strong>, 
                        })} 
                    </p> 
                </div> 
            </div> 
 
            <div className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] p-4 flex items-start gap-3"> 
                <AlertTriangle size={18} className="text-[var(--color-gold)] dark:text-[var(--color-gold-light)] shrink-0 mt-0.5" /> 
                <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-soft-2)] leading-6"> 
                    {t("checkout.payPage.Test.availableCard")} 
                </p> 
            </div> 
 
            <div className="rounded-2xl min-[480px]:border border-[var(--color-border)] dark:border-[var(--color-border)] min-[480px]:bg-[var(--color-surface)] min-[480px]:dark:bg-[var(--color-surface)] min-[480px]:p-6"> 
                <div className="flex items-center gap-2 mb-5"> 
                    <CreditCard size={18} className="text-[var(--color-green)] dark:text-[var(--color-gold-light)]" /> 
                    <h3 className="text-base font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]"> 
                        {t("checkout.payPage.Test.card.title")} 
                    </h3> 
                </div> 
 
                <div className="grid gap-4 md:grid-cols-2"> 
                    <div className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-cream)] dark:bg-[var(--color-cream)] p-4 flex flex-col gap-3"> 
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-2"> 
                            <div className="flex flex-wrap items-center gap-2"> 
                                <CheckCircle2 size={16} className="text-[var(--color-green)]"/> 
                                <span className="text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]"> 
                                    {t("checkout.payPage.Test.card.successfulCard.title")} 
                                </span> 
                            </div> 
                            <span className="rounded-full bg-[var(--color-green)]/10 dark:bg-[var(--color-green)]/20 text-[var(--color-green)] dark:text-[var(--color-soft)] text-[11px] px-2 py-1 font-medium"> 
                                {t("checkout.payPage.Test.card.successfulCard.approved")} 
                            </span> 
                        </div> 
 
                        <div dir="ltr" className="font-mono text-sm text-[var(--color-soft)] dark:text-[var(--color-soft)]"> 
                            <p>Visa</p> 
                            <p>4111 1111 1111 1111</p> 
                            <p>Exp: 12 / 28</p> 
                            <p>CVC: 123</p> 
                        </div> 
 
                        <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-soft-2)] leading-5"> 
                            {t("checkout.payPage.Test.card.successfulCard.Desc")} 
                        </p> 
                    </div> 
 
                    <div className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-cream)] dark:bg-[var(--color-cream)] p-4 flex flex-col gap-3"> 
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-2"> 
                            <div className="flex flex-wrap items-center gap-2"> 
                                <XCircle size={16} className="text-[var(--color-red)]" /> 
                                <span className="text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]"> 
                                    {t("checkout.payPage.Test.card.failedCard.title")} 
                                </span> 
                            </div> 
                            <span className="rounded-full bg-[var(--color-red)]/10 dark:bg-[var(--color-red)]/20 text-[var(--color-red)] dark:text-[var(--color-red)] text-[11px] px-2 py-1 font-medium"> 
                                {t("checkout.payPage.Test.card.failedCard.declined")} 
                            </span> 
                        </div> 
 
                        <div dir="ltr" className="font-mono text-sm text-[var(--color-soft)] dark:text-[var(--color-soft)]"> 
                            <p>{t("checkout.payPage.Test.card.failedCard.declinedCard")}</p> 
                            <p>4000 0000 0000 0002</p> 
                            <p>Exp: 12 / 28</p> 
                            <p>CVC: 123</p> 
                        </div> 
 
                        <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-soft-2)] leading-5"> 
                            {t("checkout.payPage.Test.card.failedCard.Desc")} 
                        </p> 
                    </div> 
 
                </div> 
            </div> 
        </section> 
    ); 
}