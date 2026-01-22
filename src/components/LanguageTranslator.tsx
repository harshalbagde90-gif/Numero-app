import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Globe, Orbit, CheckCircle2, X } from 'lucide-react';

interface Language {
    code: string;
    name: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ur', name: 'اردو (Urdu)' },
];

const messages = [
    "Decoding cosmic frequencies...",
    "Aligning your vibrational matrix...",
    "Translating destiny patterns...",
    "Preparing your celestial blueprint...",
    "Harmonizing number vibrations...",
    "Finalizing your mystical report..."
];

const LanguageTranslator: React.FC<{ id?: string, isLarge?: boolean }> = ({ isLarge }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLang, setCurrentLang] = useState('English');
    const [tempLang, setTempLang] = useState<Language | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingMsg, setLoadingMsg] = useState(messages[0]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Init saved language
        const savedLang = localStorage.getItem('selected_language_name') || 'English';
        setCurrentLang(savedLang);

        (window as any).googleTranslateElementInit = () => {
            if ((window as any).google && (window as any).google.translate) {
                new (window as any).google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'hi,en,ta,te,mr,gu,bn,pa,kn,ml,ur',
                    autoDisplay: false
                }, 'google_translate_hidden_holder');
            }
        };

        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const handleConfirmLanguage = () => {
        if (!tempLang) return;

        setIsModalOpen(false);

        // Set Cookies, LocalStorage and Reload immediately
        const cookieVal = `/en/${tempLang.code}`;
        document.cookie = `googtrans=${cookieVal}; path=/`;
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;

        localStorage.setItem('selected_language_name', tempLang.name);
        localStorage.setItem('translation_in_progress', 'true');

        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <div className="relative lang-selector-container skiptranslate shrink-0">
            <div id="google_translate_hidden_holder" style={{ display: 'none' }}></div>

            <button
                onClick={() => {
                    setTempLang(languages.find(l => l.name === currentLang) || languages[0]);
                    setIsModalOpen(true);
                }}
                className={`flex items-center gap-2 rounded-full transition-all active:scale-95 group whitespace-nowrap notranslate ${isLarge
                    ? 'px-8 py-3.5 bg-secondary/10 border-2 border-secondary/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
                    : 'px-4 py-2 bg-white/5 border border-secondary/30 hover:border-secondary'
                    }`}
            >
                <div className={`flex items-center gap-2 flex-nowrap ${isLarge ? 'gap-3' : 'gap-2'}`}>
                    <Globe className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-secondary animate-pulse shrink-0`} />
                    <span className={`${isLarge ? 'text-xs md:text-sm' : 'text-[10px] sm:text-xs'} font-bold text-secondary uppercase tracking-[0.1em] pointer-events-none`}>
                        Language :
                    </span>
                    <span className={`${isLarge ? 'text-xs md:text-sm' : 'text-[10px] sm:text-xs'} font-black text-white uppercase tracking-tight shrink-0 min-w-[70px] text-left`}>
                        {currentLang.split(' ')[0]}
                    </span>
                </div>
                <ChevronDown className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-secondary shrink-0`} />
            </button>

            {/* Selection Modal (Portal to body) */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[1000000] flex items-start justify-center p-4 pt-10 sm:pt-8 overflow-y-auto custom-scrollbar notranslate">
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

                    <div className="relative w-full max-w-md bg-[#0d000d] border border-secondary/30 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="px-6 pt-6 pb-2 text-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">Select Language</h2>
                            <p className="text-white/40 text-[10px] font-medium uppercase tracking-[0.1em]">Translate your report instantly</p>
                        </div>

                        <div className="px-5 py-3 grid grid-cols-2 gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setTempLang(lang)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${tempLang?.code === lang.code
                                        ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-[11px] font-bold">{lang.name}</span>
                                    {tempLang?.code === lang.code && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 pt-2">
                            <button
                                onClick={handleConfirmLanguage}
                                className="w-full py-4 rounded-xl bg-secondary text-black font-black uppercase text-xs tracking-[0.15em] shadow-[0_8px_25px_rgba(234,179,8,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Confirm & Update
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-reverse-spin { animation: reverse-spin 8s linear infinite; }
                @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                .goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, .goog-te-balloon-frame, .goog-tooltip { 
                    display: none !important; 
                }
                body { 
                    top: 0px !important; 
                    position: static !important;
                }
                .skiptranslate {
                    display: none !important;
                }
                .lang-selector-container.skiptranslate {
                    display: block !important;
                }
            `}} />
        </div>
    );
};

export default LanguageTranslator;
