"use client";

import {
    ShieldCheck,
    AlertTriangle,
    CreditCard,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function PaymentTestNotice() {
    return (
        <section className="w-full max-w-7xl px-3 min-[480px]:px-6 py-12 flex flex-col gap-5">

            {/* Main Notice */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-5 flex flex-col sm:flex-row gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#5B3A21]/10 dark:bg-[#A68A64]/10 text-[#5B3A21] dark:text-[#A68A64] shrink-0">
                    <ShieldCheck size={22} />
                </div>

                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            Test Environment
                        </h3>
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#5B3A21]/10 dark:bg-[#A68A64]/10 text-[#5B3A21] dark:text-[#A68A64]">
                            Encrypted
                        </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-zinc-300">
                        All card details are encrypted and handled securely.
                        Payments are currently running in <strong>Test Mode</strong>.
                        Live payments will be enabled soon.
                    </p>
                </div>
            </div>

            {/* Warning */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#5B3A21] dark:text-[#A68A64] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-6">
                    Mada cards are not available during the testing environment.
                </p>
            </div>

            {/* Cards */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <CreditCard size={18} className="text-[#5B3A21] dark:text-[#A68A64]" />
                    <h3 className="text-base font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                        Test Cards
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Success */}
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-4 flex flex-col gap-3">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-600"/>
                                <span className="text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                    Successful Payment
                                </span>
                            </div>
                            <span className="rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[11px] px-2 py-1 font-medium">
                                Approved
                            </span>
                        </div>

                        <div className="font-mono text-sm text-gray-700 dark:text-zinc-300">
                            <p>Visa</p>
                            <p>4111 1111 1111 1111</p>
                            <p>Exp: 12 / 28</p>
                            <p>CVC: 123</p>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-5">
                            You will be redirected to the bank's page,
                            and then you will return with a response confirming that the payment has been completed.
                        </p>
                    </div>

                    {/* Failed */}
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-[#F9F7F3] dark:bg-[#1F1B17] p-4 flex flex-col gap-3">
                        <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <XCircle size={16} className="text-red-600" />
                                <span className="text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                    Failed Payment
                                </span>
                            </div>
                            <span className="rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[11px] px-2 py-1 font-medium">
                                Declined
                            </span>
                        </div>

                        <div className="font-mono text-sm text-gray-700 dark:text-zinc-300">
                            <p>Declined Card</p>
                            <p>4000 0000 0000 0002</p>
                            <p>Exp: 12 / 28</p>
                            <p>CVC: 123</p>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-5">
                            You'll be redirected to the bank page, then back with
                            a declined payment response.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}