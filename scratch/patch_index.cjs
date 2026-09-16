const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// 1. Add Import
if (!content.includes('CheckoutModal')) {
    content = content.replace('import { Footer } from "../components/Footer";', 
        'import { Footer } from "../components/Footer";\nimport { CheckoutModal } from "../components/CheckoutModal";');
}

// 2. Add state
if (!content.includes('isCheckoutOpen')) {
    content = content.replace('const [isBrowseOpen, setIsBrowseOpen] = useState(false);',
        'const [isBrowseOpen, setIsBrowseOpen] = useState(false);\n  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);');
}

// 3. Add handlePaymentSuccess
const successFn = `
  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setIsLoading(false);
    setState("preview");
    window.scrollTo({ top: 0, behavior: "instant" });
    toast({
      title: "Report Unlocked! 🎉",
      description: "Your full numerology reading is now unlocked.",
    });
  };
`;
if (!content.includes('handlePaymentSuccess')) {
    content = content.replace('const handleUnlock = () => {', successFn + '\n  const handleUnlock = () => {\n    setIsCheckoutOpen(true);\n  };\n\n  /*');
    // We need to comment out the old handleUnlock body.
    content = content.replace('    }, 1000);\n  };\n\n  if (state === "landing" || !reading) {', '    }, 1000);\n  }; */\n\n  if (state === "landing" || !reading) {');
}

// 4. Update the first return (landing)
if (!content.includes('<CheckoutModal')) {
    content = content.replace('        <Footer />\n      </div >\n    );',
        '        <Footer />\n        <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      </div >\n    );');
}

// 5. Update the second return (preview)
if (!content.includes('CheckoutModal isOpen={isCheckoutOpen}')) {
    content = content.replace('  return (\n    <ResultPreview',
        '  return (\n    <>\n      <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      <ResultPreview');
    content = content.replace('      isLoading={isLoading}\n    />\n  );',
        '      isLoading={isLoading}\n    />\n    </>\n  );');
}

fs.writeFileSync('src/pages/Index.tsx', content);
console.log('Successfully updated Index.tsx');
