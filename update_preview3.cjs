const fs = require('fs');

function updateFile() {
  let content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

  // 1. Cosmic Number Section (Wheel Image)
  // Find the Cosmic Number grid that we started modifying in the last script
  // We left it hanging because the closing wasn't replaced properly.
  const coreGridStr = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">';
  if (content.includes(coreGridStr)) {
    // Check if image is already there (if we somehow ran it again)
    if (!content.includes('cosmic_number.png')) {
       const colorSectionStr = '<div id="color" className="space-y-16 pt-12">';
       if (content.includes(colorSectionStr)) {
          // Replace it
          content = content.replace(
             colorSectionStr,
             `
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
                
              </div>
            
              <div id="color" className="space-y-16 pt-12">`
          );
       }
    }
  }

  // 2. Dynamic Colors for the 6 Cards
  // We'll replace the amber classes with dynamic ones for the specific cards
  
  // Psychic Number (cyan)
  content = content.replace(
    /<!-- Psychic Number \(Mulank\) Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Psychic Number (Mulank) Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-cyan-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">'
  );

  // Expression Number (emerald)
  content = content.replace(
    /<!-- Expression Number \(Bhagyank\) Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Expression Number (Bhagyank) Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-emerald-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">'
  );

  // Soul Urge Number (rose)
  content = content.replace(
    /<!-- Soul Urge Number Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Soul Urge Number Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-rose-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">'
  );
  
  // Personality Number (indigo)
  content = content.replace(
    /<!-- Personality Number Rectangle -->[\s\S]*?<div className="group relative overflow-hidden rounded-\[2rem\] bg-\[#050505\] p-8 border border-amber-500\/30 transition-all duration-700 hover:scale-\[1\.03\] hover:border-amber-400 hover:shadow-\[0_0_30px_rgba\(234,179,8,0\.2\)\]">/,
    '<!-- Personality Number Rectangle -->\n                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-indigo-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">'
  );

  fs.writeFileSync('d:/NumGuru/src/components/ResultPreview.tsx', content, 'utf8');
  console.log('Update applied');
}

updateFile();
