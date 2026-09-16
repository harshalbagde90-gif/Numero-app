const fs = require('fs');
const file = 'd:/NumGuru/src/components/ResultPreview.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<ReportModuleItem\s+id="([^"]+)"([\s\S]*?)\/>/g, (match, id, rest) => {
  if (id === 'growth' || id === 'guidance') {
    return match;
  }
  if (match.includes('isLocked')) {
    return match;
  }
  return '<ReportModuleItem\n                        id="' + id + '"' + rest + 'isLocked={!isUnlocked}\n                        onUnlock={onUnlock}\n                      />';
});

const bottomBanner = `
      {/* Sticky Bottom Paywall Banner */}
      {!isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-[#0a0518]/90 backdrop-blur-xl border-t border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-full duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shrink-0">
              <Lock className="h-6 w-6 text-black" />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-lg leading-tight">Unlock Your Ultimate Destiny Blueprint</h4>
              <p className="text-amber-100/70 text-sm">Get full access to Career, Relationships, Lucky Matrix & Color Alchemy.</p>
            </div>
          </div>
          <Button
            onClick={onUnlock}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black tracking-widest uppercase text-sm shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-all"
          >
            {isLoading ? "Processing..." : "Unlock Full Report Now"}
          </Button>
        </div>
      )}
    </div>
  );
}
`;

content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, bottomBanner);

fs.writeFileSync(file, content);
console.log("Success");
