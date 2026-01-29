import { Orbit, ShieldCheck, Mail, MapPin, ExternalLink, Instagram, Facebook, Twitter, Chrome } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Decorative Glows */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand section */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
                            <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-all duration-500 shadow-lg shadow-secondary/5">
                                <Orbit className="h-7 w-7 text-secondary group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
                            </div>
                            <span className="font-bold text-3xl tracking-tighter text-white">NumGuru</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Unlock the secrets of the universe through Pythagorean numerology. We translate cosmic frequencies into actionable insights for your life's journey.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Instagram, label: "Instagram" },
                                { icon: Twitter, label: "Twitter" },
                                { icon: Facebook, label: "Facebook" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs">Explore</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-secondary transition-colors flex items-center gap-2 group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Home</a></li>
                            <li><a href="#what-is-numerology" className="hover:text-secondary transition-colors flex items-center gap-2 group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Wisdom Hub</a></li>
                            <li><a href="#premium-report" className="hover:text-secondary transition-colors flex items-center gap-2 group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Full Report</a></li>
                            <li><a href="#testimonials" className="hover:text-secondary transition-colors flex items-center gap-2 group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Soul Stories</a></li>
                            <li><Link to="/blog" className="hover:text-secondary transition-colors flex items-center gap-2 group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Wisdom Blog</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs">Trust & Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="hover:text-secondary transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/refund-policy" className="hover:text-secondary transition-colors">Refund Policy</Link></li>
                            <li>
                                <div className="flex items-center gap-2 text-emerald-400/80 font-medium">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Secure Payments</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/Contact */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs">Guardian Support</h4>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Mail className="w-5 h-5 text-secondary" />
                                <span className="text-sm">connectnumguru@gmail.com</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight italic">
                                Our cosmic guardians typically respond within 11:11 hours of your message.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-500 text-xs tracking-wide">
                            © {new Date().getFullYear()} <span className="text-slate-400 font-bold">NumGuru</span>. All cosmic rights reserved.
                        </p>
                        <p className="text-[10px] text-slate-600 font-medium">
                            Developed with precision by <span className="text-secondary/70 font-semibold tracking-wide">Harsh Bagde</span> <span className="opacity-50 text-[9px] uppercase tracking-tighter ml-1">(CSE Graduate)</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Systems Online</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Powered By</span>
                            <Chrome className="h-4 w-4 text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
