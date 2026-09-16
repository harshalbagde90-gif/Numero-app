const fs = require('fs');

function updateFile() {
  let content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

  // 1. Transparent Navbar
  content = content.replace(
    /<nav className=\{`fixed top-0 left-0 right-0 z-50 transition-all duration-500 \$\{scrolled \? 'bg-black\/80 backdrop-blur-xl border-b border-white\/10 h-16 md:h-20' : 'bg-transparent h-20 md:h-24'}`\}>/g,
    '<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass-panel bg-background/70 border-b border-border ${scrolled ? "h-16 md:h-20" : "h-20 md:h-24"}`}>\n        {/* Updated transparent glass navbar */}'
  );

  // 2. Color Alchemy Section (Prism/Aura Image)
  // We'll replace the `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">` that wraps the two color sections (Lucky/Supportive and Avoid/Challenging)
  const colorAlchemyStart = content.indexOf('<h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">');
  if (colorAlchemyStart > -1) {
    // Find the next grid that holds the color boxes
    const gridMatch = content.match(/<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">/);
    if (gridMatch) {
      content = content.replace(
        /<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">/,
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
`
      );

      // Now we need to close the extra divs. The original grid wrapped just the two color boxes.
      // The old structure was:
      // <div className="grid ...">
      //   <div> ... Supportive Tones ... </div>
      //   <div> ... Challenging Tones ... </div>
      // </div>
      // Then came the Use Case section.
      
      const useCaseStart = content.indexOf('<div className="relative group overflow-hidden rounded-[2rem] bg-[#050505]/40 border border-amber-500/20">');
      if (useCaseStart > -1) {
        content = content.replace(
          /<div className="relative group overflow-hidden rounded-\[2rem\] bg-\[#050505\]\/40 border border-amber-500\/20">/,
          `
                </div> {/* End inner 2-column grid */}
              </div> {/* End Right Column Content */}
            </div> {/* End 12-col grid */}

            <div className="relative group overflow-hidden rounded-[2rem] bg-[#050505]/40 border border-amber-500/20">`
        );
      }
    }
  }


  // 3. Cosmic Number Section (Wheel Image)
  // Let's find "Your Strategic Life Roadmap" which is the Blueprint section. Or wait, "Core Design" which is where the Cosmic Number is.
  // Wait, let's search for "Friendly Numbers" or "Core Design".
  const coreDesignSection = content.indexOf('id="core"');
  if (coreDesignSection > -1) {
    // The grid for Core Design is:
    // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //   ... Psychic, Expression, etc ...
    //   ... Friendly, Challenging ...
    // </div>
    // Let's change the layout to include the wheel image.
    const coreGridStart = content.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-6">', coreDesignSection);
    if (coreGridStart > -1) {
      content = content.replace(
        /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/,
        `
              {/* Cosmic Wheel 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                
                {/* Left Column: Data */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">`
      );

      // Close it at the end of the 2-column grid
      // The grid has 6 cards (Psychic, Expression, Soul Urge, Personality, Friendly, Challenging)
      // After Challenging Numbers Rectangle, there is the closing </div>
      // Then Color Alchemy section starts.
      
      const colorAlchemyID = content.indexOf('id="color"');
      if (colorAlchemyID > -1) {
        // Find the </div> right before id="color" section
        const endOfCoreGrid = content.lastIndexOf('</div>', colorAlchemyID);
        const endOfCoreGrid2 = content.lastIndexOf('</div>', endOfCoreGrid - 1);
        
        // Let's replace the last </div> before id="color" wrapper
        const sectionPattern = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{?\/\* --- Color Alchemy --- \*\/?\}/;
        content = content.replace(sectionPattern, 
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
            </div>
            </div>
            </div>

            {/* --- Color Alchemy --- */}
        `
        );
      }
    }
  }


  fs.writeFileSync('d:/NumGuru/src/components/ResultPreview.tsx', content, 'utf8');
  console.log('Update applied');
}

updateFile();
