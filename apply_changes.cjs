const fs = require('fs');

const path = 'd:/NumGuru/src/components/ResultPreview.tsx';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

// 1. Transparent Navbar
const navIdx = lines.findIndex(l => l.includes('className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? \'bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 md:h-20\' : \'bg-transparent h-20 md:h-24\'}`}'));
if (navIdx !== -1) {
  lines[navIdx] = lines[navIdx].replace(
    'className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? \'bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 md:h-20\' : \'bg-transparent h-20 md:h-24\'}`}',
    'className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass-panel bg-background/70 border-b border-border ${scrolled ? "h-16 md:h-20" : "h-20 md:h-24"}`}'
  );
}

// 2. Cosmic Wheel Start
const cosmicWheelStartIdx = lines.findIndex(l => l.includes('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'));
if (cosmicWheelStartIdx !== -1) {
  lines[cosmicWheelStartIdx] = lines[cosmicWheelStartIdx].replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">',
    `              {/* Cosmic Wheel 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                {/* Left Column: Data */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">`
  );
}

// 3. Cosmic Wheel End
const challengingNumbersIdx = lines.findIndex(l => l.includes('Challenging Numbers Rectangle'));
if (challengingNumbersIdx !== -1) {
  let mapEndIdx = lines.findIndex((l, i) => i > challengingNumbersIdx && l.includes('))}'));
  if (mapEndIdx !== -1) {
    let targetLineIdx = mapEndIdx + 3;
    if (lines[targetLineIdx].includes('</div>')) {
      lines[targetLineIdx] = `                  </div>
                </div>
                {/* Right Column: Cosmic Wheel Image */}
                <div className="lg:col-span-5 flex items-center justify-center relative group h-full hidden lg:flex">
                  <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                  <div className="relative w-full aspect-square max-w-[450px] rounded-full overflow-hidden border border-white/5 group-hover:border-amber-500/20 transition-all duration-700 shadow-2xl flex items-center justify-center bg-[#050505]/40 backdrop-blur-sm">
                     <img src="/images/cosmic_number.png" alt="Cosmic Numerology Wheel" className="w-[110%] h-[110%] object-cover mix-blend-screen animate-[spin_120s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
                  </div>
                </div>
              </div>`;
    }
  }
}

// 4. Color Alchemy Start
const colorAlchemyStartIdx = lines.findIndex(l => l.includes('<div className="grid lg:grid-cols-2 gap-8 md:gap-12">'));
if (colorAlchemyStartIdx !== -1) {
  lines[colorAlchemyStartIdx] = lines[colorAlchemyStartIdx].replace(
    '<div className="grid lg:grid-cols-2 gap-8 md:gap-12">',
    `              {/* Color Alchemy 2-Column Layout */}
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
}

// 5. Color Alchemy End
const challengingTonesIdx = lines.findIndex(l => l.includes('Challenging Tones'));
if (challengingTonesIdx !== -1) {
  let mapEndIdx = lines.findIndex((l, i) => i > challengingTonesIdx && l.includes('))}'));
  if (mapEndIdx !== -1) {
    let targetLineIdx = mapEndIdx + 3;
    if (lines[targetLineIdx].includes('</div>')) {
      lines[targetLineIdx] = `                  </div>
                </div>
              </div>`; // Changed from 4 divs to 3 divs!
    }
  }
}

// 6. Dynamic Card Colors
const cards = [
  { text: 'Psychic Number (Mulank) Rectangle', color: 'cyan', rgb: '34,211,238' },
  { text: 'Expression Number (Bhagyank) Rectangle', color: 'emerald', rgb: '16,185,129' },
  { text: 'Soul Urge Number Rectangle', color: 'rose', rgb: '244,63,94' },
  { text: 'Personality Number Rectangle', color: 'indigo', rgb: '99,102,241' }
];

for (const card of cards) {
  const cardIdx = lines.findIndex(l => l.includes(card.text));
  if (cardIdx !== -1) {
    lines[cardIdx + 1] = lines[cardIdx + 1]
      .replace('border-amber-500/30', "border-" + card.color + "-500/30")
      .replace('hover:border-amber-400', "hover:border-" + card.color + "-400")
      .replace('hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]', "hover:shadow-[0_0_30px_rgba(" + card.rgb + ",0.2)]");
  }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Update applied perfectly');
