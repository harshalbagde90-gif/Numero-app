import React, { useEffect, useState } from 'react';
import { Orbit } from 'lucide-react';

const technicalScripts = [
    "Initializing Data Transfer...",
    "Loading User Profile...",
    "Analyzing Numerical Matrix...",
    "Syncing Celestial Frequencies...",
    "Downloading Destiny Patterns...",
    "Decrypting Vibrational Bio-Data...",
    "Calibrating Cosmic Alignment...",
    "Finalizing Destined Report..."
];

const CosmicStartupLoader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scriptIndex, setScriptIndex] = useState(0);
    const [selectedLang, setSelectedLang] = useState('English');

    useEffect(() => {
        // Check language from localStorage
        const savedLang = localStorage.getItem('selected_language_name') || 'English';
        setSelectedLang(savedLang);

        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const googTrans = getCookie('googtrans');
        const translationFlag = localStorage.getItem('translation_in_progress') === 'true';
        const isTranslated = (googTrans && googTrans !== '/en/en') || translationFlag;

        if (isTranslated) {
            setIsVisible(true);

            // Artificial progress for the first 90%
            let currentProgress = 0;
            const progressInterval = setInterval(() => {
                currentProgress += 0.5; // Slow and smooth
                if (currentProgress >= 90) {
                    clearInterval(progressInterval);
                } else {
                    setProgress(Math.round(currentProgress));
                    // Update technical scripts based on progress
                    const scriptIdx = Math.floor((currentProgress / 100) * technicalScripts.length);
                    setScriptIndex(scriptIdx);
                }
            }, 30);

            // Wait for Google Translate
            const checkTranslation = setInterval(() => {
                const isLoaded = document.documentElement.classList.contains('translated-ltr') ||
                    document.documentElement.classList.contains('translated-rtl') ||
                    document.body.classList.contains('translated-ltr') ||
                    document.body.classList.contains('translated-rtl');

                if (isLoaded) {
                    clearInterval(checkTranslation);
                    clearInterval(progressInterval);

                    // Final push to 100% smooth
                    let finalProg = currentProgress;
                    const finalTimer = setInterval(() => {
                        finalProg += 1;
                        if (finalProg >= 100) {
                            setProgress(100);
                            setScriptIndex(technicalScripts.length - 1);
                            clearInterval(finalTimer);

                            // 3 second buffer for extra smoothness
                            setTimeout(() => {
                                localStorage.removeItem('translation_in_progress');
                                setIsVisible(false);
                            }, 3000);
                        } else {
                            setProgress(Math.round(finalProg));
                        }
                    }, 50);
                }
            }, 500);

            return () => {
                clearInterval(checkTranslation);
                clearInterval(progressInterval);
            };
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[2000000] bg-[#050005] flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden animate-in fade-in duration-700 notranslate">
            {/* Background Cosmic Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[130px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[130px] rounded-full animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-36 h-36 mb-12 flex items-center justify-center">
                    {/* Outer Rotating Orbits */}
                    <div className="absolute inset-0 border-2 border-secondary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 border border-primary/20 rounded-full animate-[spin_6s_linear_infinite_reverse]" />

                    {/* The Spinning NumGuru Icon */}
                    <div className="relative p-8 rounded-full bg-secondary/5 border border-secondary/20 shadow-[0_0_60px_rgba(234,179,8,0.25)] animate-[spin_12s_linear_infinite]">
                        <Orbit className="w-14 h-14 text-secondary" />
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-gradient-gold">
                        NumGuru
                    </h3>
                    <p className="text-[11px] font-bold text-secondary/70 uppercase tracking-[0.25em] animate-pulse h-4">
                        {technicalScripts[scriptIndex]}
                    </p>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full max-w-[320px] sm:max-w-[400px] space-y-4 px-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                        <div
                            className="h-full bg-secondary rounded-full shadow-[0_0_20px_#EAB308] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 px-1">
                        <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.15em] leading-none whitespace-nowrap">
                            Loading your {selectedLang} Report
                        </span>
                        <span className="text-[11px] font-black text-secondary tracking-widest leading-none">
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .text-gradient-gold {
                    background: linear-gradient(to bottom, #FDE68A, #EAB308, #B45309);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default CosmicStartupLoader;
