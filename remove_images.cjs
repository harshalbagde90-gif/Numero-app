const fs = require('fs');

const path = 'd:/NumGuru/src/components/ResultPreview.tsx';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

// 1. Cosmic Wheel Start
const cosmicWheelStartIdx = lines.findIndex(l => l.includes('{/* Cosmic Wheel 2-Column Layout */}'));
if (cosmicWheelStartIdx !== -1) {
  lines.splice(cosmicWheelStartIdx, 5, '              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">');
}

// 2. Cosmic Wheel End
const cosmicWheelImageIdx = lines.findIndex(l => l.includes('{/* Right Column: Cosmic Wheel Image */}'));
if (cosmicWheelImageIdx !== -1) {
  // Remove 2 divs before it, the comment itself, and 8 lines of image code
  // Wait, let's just find the exact lines
  lines.splice(cosmicWheelImageIdx - 2, 11);
}

// 3. Color Alchemy Start
const colorAlchemyStartIdx = lines.findIndex(l => l.includes('{/* Color Alchemy 2-Column Layout */}'));
if (colorAlchemyStartIdx !== -1) {
  lines.splice(colorAlchemyStartIdx, 11, '              <div className="grid lg:grid-cols-2 gap-8 md:gap-12">');
}

// 4. Color Alchemy End
const challengingTonesIdx = lines.findIndex(l => l.includes('Challenging Tones'));
if (challengingTonesIdx !== -1) {
  let mapEndIdx = lines.findIndex((l, i) => i > challengingTonesIdx && l.includes('))}'));
  if (mapEndIdx !== -1) {
    let targetLineIdx = mapEndIdx + 3;
    if (lines[targetLineIdx].includes('</div>')) {
      // Revert from 3 divs back to 1 div
      lines[targetLineIdx] = `              </div>`;
    }
  }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Images removed successfully');
