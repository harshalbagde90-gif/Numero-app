const fs = require('fs');

function updateFile() {
  let content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

  // 1. Color Alchemy Section (Prism/Aura Image)
  const colorAlchemyGridStr = '<div className="grid lg:grid-cols-2 gap-8 md:gap-12">';
  if (content.includes(colorAlchemyGridStr)) {
    content = content.replace(
      colorAlchemyGridStr,
      `
            {/* Color Alchemy 2-Column Layout */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
`
    );

    // Close the div after Use Case section
    const useCaseEndIndex = content.indexOf('</div>', content.indexOf('Use Case of Vibrational'));
    // The structure is:
    // <div className="space-y-8"> ... Supportive Tones ... </div>
    // <div className="space-y-8"> ... Challenging Tones ... </div>
    // </div> <-- This closes the grid lg:grid-cols-2
    // We replaced the grid opening. We need to add the closing divs for our new layout exactly where that old grid closed.
    
    // So find the </div> that closes the color boxes grid.
    // The next thing after the grid is `<div className="relative group overflow-hidden ... bg-[#050505]/40 ...">` for Use Case.
    const useCaseStr = '<div className="relative group overflow-hidden rounded-[2rem] bg-[#050505]/40';
    if (content.includes(useCaseStr)) {
       content = content.replace(
          useCaseStr,
          `
                </div> {/* End inner grid */}
              </div> {/* End Right Column Content */}
            </div> {/* End 12-col grid */}

            <div className="relative group overflow-hidden rounded-[2rem] bg-[#050505]/40`
       );
    }
  }

  // 2. Cosmic Number Section (Wheel Image)
  const coreGridStr = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
  if (content.includes(coreGridStr)) {
    content = content.replace(
      coreGridStr,
      `
              {/* Cosmic Wheel 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                
                {/* Left Column: Data */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">`
    );
    
    // Find the end of this grid. The next section is Karmic Blueprint or Color Alchemy.
    // The next section after Core Design is `<div className="space-y-12" id="color">`
    const colorSectionStr = '<div className="space-y-12" id="color">';
    if (content.includes(colorSectionStr)) {
       // We need to replace the </div> that closes the core grid, right before `id="color"`.
       // Let's replace the id="color" line to prepend the closing tags and the right column image.
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
            
              <div className="space-y-12" id="color">`
       );
    }
  }

  fs.writeFileSync('d:/NumGuru/src/components/ResultPreview.tsx', content, 'utf8');
  console.log('Update applied');
}

updateFile();
