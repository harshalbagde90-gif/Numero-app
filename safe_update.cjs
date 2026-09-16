const fs = require('fs');

function updateFile() {
  let content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

  // 1. Transparent Navbar
  content = content.replace(
    /className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 \${scrolled \? 'bg-black\/80 backdrop-blur-xl border-b border-white\/10 h-16 md:h-20' : 'bg-transparent h-20 md:h-24'}`}/,
    'className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass-panel bg-background/70 border-b border-border ${scrolled ? "h-16 md:h-20" : "h-20 md:h-24"}`}'
  );

  // 2. Cosmic Wheel 2-Column Layout
  content = content.replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">',
    `{/* Cosmic Wheel 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                
                {/* Left Column: Data */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">`
  );

  // Close the Cosmic Wheel layout exactly after the 6th card (Challenging Numbers)
  const challengingNumbersEndRegex = /(<!-- Challenging Numbers Rectangle -->[\s\S]*?<div className="flex flex-wrap gap-3">[\s\S]*?<\/div>\s*<\/div>)/;
  content = content.replace(
    challengingNumbersEndRegex,
    `$1
                  </div>
                </div>

                {/* Right Column: Cosmic Wheel Image */}
                <div className="lg:col-span-5 flex items-center justify-center relative group h-full hidden lg:flex">
                  <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                  <div className="relative w-full aspect-square max-w-[450px] rounded-full overflow-hidden border border-white/5 group-hover:border-amber-500/20 transition-all duration-700 shadow-2xl flex items-center justify-center bg-[#050505]/40 backdrop-blur-sm">
                     <img src="/images/cosmic_number.png" alt="Cosmic Numerology Wheel" className="w-[110%] h-[110%] object-cover mix-blend-screen animate-[spin_120s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                     {/* Core Glow */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
                  </div>
                </div>
                
              </div>`
  );

  // 3. Color Alchemy 2-Column Layout
  content = content.replace(
    '<div className="grid lg:grid-cols-2 gap-8 md:gap-12">',
    `{/* Color Alchemy 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              {/* Left Column: Prism Image */}
              <div className="lg:col-span-5 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-indigo-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                <div className="relative w-full aspect-square max-w-[400px] rounded-3xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-700 shadow-2xl">
                   <img src="/images/color_alchemy.png" alt="Color Alchemy Prism" className="w-full h-full object-cover mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-700" />
                </div>
              </div>
              
              {/* Right Column: Content */}
              <div className="lg:col-span-7 flex flex-col justify-center gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">`
  );

  // Close the Color Alchemy layout exactly before Deep Soul Analysis / Use Case
  const colorAlchemyEndRegex = /(<!-- Challenging Tones -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/;
  content = content.replace(
    colorAlchemyEndRegex,
    `$1
                </div> {/* End inner grid */}
              </div> {/* End Right Column Content */}
            </div> {/* End 12-col grid */}`
  );

  // 4. Dynamic Card Colors
  content = content.replace(
    /<!-- Psychic Number \(Mulank\) Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Psychic Number (Mulank) Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-cyan-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">'
  );

  content = content.replace(
    /<!-- Expression Number \(Bhagyank\) Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Expression Number (Bhagyank) Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-emerald-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">'
  );

  content = content.replace(
    /<!-- Soul Urge Number Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Soul Urge Number Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-rose-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">'
  );
  
  content = content.replace(
    /<!-- Personality Number Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Personality Number Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-indigo-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">'
  );

  fs.writeFileSync('d:/NumGuru/src/components/ResultPreview.tsx', content, 'utf8');
  console.log('Update applied');
}

updateFile();
