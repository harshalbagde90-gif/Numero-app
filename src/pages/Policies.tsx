import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Orbit, Shield, FileText, RefreshCw } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
    icon: React.ReactNode;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, lastUpdated, children, icon }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-secondary/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 md:h-20">
                <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group transition-all active:scale-95">
                        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                            <Orbit className="h-5 w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
                        </div>
                        <span className="font-serif font-black text-xl text-white tracking-tight">NumGuru</span>
                    </Link>

                    <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 pb-24 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-16 space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
                            {icon}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight">
                            {title}
                        </h1>
                        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium uppercase tracking-widest">
                            <span>Effective Date:</span>
                            <span className="text-white/60">{lastUpdated}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm prose prose-invert prose-slate max-w-none">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export const PrivacyPolicy = () => {
    const { symbol, amount } = useCurrency();
    return (
        <PolicyLayout
            title="Privacy Policy"
            lastUpdated="January 18, 2026"
            icon={<Shield className="h-4 w-4" />}
        >
            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section className="space-y-4">
                    <p>At NumGuru (https://numguru.online/), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">What Information We Collect</h2>
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-3">For Free Reports:</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Date of Birth only</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-3">For Paid Reports ({symbol}{amount}):</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Full Name</li>
                                <li>Date of Birth</li>
                                <li>Payment information (processed securely by our payment gateway partner)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">How We Use Your Information</h2>
                    <p>We use your information only to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Generate your personalized numerology report based on Pythagorean numerology principles</li>
                        <li>Process your payment through our secure third-party payment gateway (such as Razorpay)</li>
                        <li>Send your report to your email address</li>
                        <li>Provide customer support if needed</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">What We DO NOT Do</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>We <strong>DO NOT</strong> sell your personal data to anyone</li>
                        <li>We <strong>DO NOT</strong> share your data with third parties (except our payment processor for transactions)</li>
                        <li>We <strong>DO NOT</strong> send promotional emails unless you subscribe separately</li>
                        <li>We <strong>DO NOT</strong> use your data for any purpose other than generating your report</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Data Storage and Security</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>We store minimal data required for operational purposes only</li>
                        <li>We do not maintain user accounts or login systems</li>
                        <li>Your payment information is handled entirely by our secure payment gateway partner</li>
                        <li>We use industry-standard security measures to protect your information</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Third-Party Services</h2>
                    <p>We use trusted third-party services like <strong>Razorpay</strong> to process payments securely. These services have their own privacy policies and security measures.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Your Rights</h2>
                    <p>You have the right to know what data we have collected about you, request deletion of your data, and ask questions about how your data is used.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Contact Us</h2>
                    <p>If you have any questions or concerns about your privacy, please contact us at:</p>
                    <p className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-secondary">
                        Email: connectnumguru@gmail.com
                    </p>
                </section>
            </div>
        </PolicyLayout>
    );
};

export const TermsConditions = () => {
    const { symbol, amount } = useCurrency();
    return (
        <PolicyLayout
            title="Terms & Conditions"
            lastUpdated="January 18, 2026"
            icon={<FileText className="h-4 w-4" />}
        >
            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section className="space-y-4">
                    <p>Welcome to NumGuru! By using our website and services, you agree to these Terms & Conditions. Please read them carefully.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">About Our Service</h2>
                    <p>NumGuru is a numerology guidance tool that provides insights based on Pythagorean numerology principles.</p>
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                        <h3 className="text-amber-500 font-bold uppercase tracking-widest text-[10px] mb-3 font-sans">Important Understanding:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm italic">
                            <li>Our reports are based on established numerology calculations and patterns</li>
                            <li>We provide guidance and insights, NOT predictions or guarantees</li>
                            <li>Numerology is a tool for self-reflection and personal understanding</li>
                            <li>We are NOT an astrology service or fortune-telling platform</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">What We Provide</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Free Reports:</strong> Basic snapshot and Life Path number calculation.</li>
                        <li><strong>Paid Reports ({symbol}{amount}):</strong> Detailed personality insights, Strengths/Balance areas, Lucky elements, and Ritual Remedies.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">User Responsibility</h2>
                    <p>By using NumGuru, you understand and agree that:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>You are 18 years of age or older.</li>
                        <li>Information provided (Name, DOB) is accurate.</li>
                        <li>You use our guidance as a tool for self-reflection, not absolute truth.</li>
                        <li>You take full responsibility for your life decisions.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">No Guarantees</h2>
                    <p>We provide our service "as is" without any guarantees for specific life outcomes or success. Numerology principles are not scientifically proven.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Limitation of Liability</h2>
                    <p>NumGuru and its owners shall not be held liable for any decisions you make or outcomes resulting from following the report's guidance. You use our service at your own risk.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Intellectual Property</h2>
                    <p>All content, designs, calculations, and interpretations are the intellectual property of NumGuru and are protected by copyright laws.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-white text-2xl font-serif font-bold">Governing Law</h2>
                    <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in India.</p>
                </section>
            </div>
        </PolicyLayout>
    );
};

export const RefundPolicy = () => (
    <PolicyLayout
        title="Refund Policy"
        lastUpdated="January 18, 2026"
        icon={<RefreshCw className="h-4 w-4" />}
    >
        <div className="space-y-8 text-slate-300 leading-relaxed">
            <section className="space-y-4">
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-rose-400 font-bold uppercase tracking-widest text-[10px] mb-2 font-sans">Important: Digital Product Policy</p>
                    <p className="text-sm italic">Once your numerology report has been generated and the lifetime access link has been delivered, we cannot offer refunds due to the instant nature of digital products.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-white text-2xl font-serif font-bold">When You MAY Receive a Refund</h2>
                <p>Refunds are considered only in exceptional cases:</p>
                <ul className="list-disc pl-5 space-y-4 mt-4">
                    <li>
                        <strong>Technical Error:</strong> Failed to generate report or charged but not received.
                    </li>
                    <li>
                        <strong>Payment Error:</strong> Multiple charges for the same transaction.
                    </li>
                    <li>
                        <strong>Non-Delivery:</strong> Paid but report not received within 24 hours.
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-white text-2xl font-serif font-bold">How to Request a Refund</h2>
                <p>Contact us within 7 days of purchase at <span className="text-secondary font-mono">connectnumguru@gmail.com</span> with your Full Name, Order Date, and Transaction ID.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-white text-2xl font-serif font-bold">Processing Time</h2>
                <p>Approved refunds are processed within 7-10 business days and credited back to the original payment method.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-white text-2xl font-serif font-bold">Cancellation</h2>
                <p>You can cancel any time <strong>before</strong> completing the payment. No cancellations are possible after the digital report is generated.</p>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <p className="text-white/60 text-sm font-light italic">
                    "We are committed to providing you with valuable numerology insights in a transparent and trustworthy manner."
                </p>
                <p className="text-slate-500 text-xs">Thank you for choosing NumGuru!</p>
            </section>
        </div>
    </PolicyLayout>
);
