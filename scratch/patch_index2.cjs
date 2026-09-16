const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// 1. Add Import (after ResultPreview)
if (!content.includes('CheckoutModal')) {
    content = content.replace('import { ResultPreview } from "@/components/ResultPreview";', 
        'import { ResultPreview } from "@/components/ResultPreview";\nimport { CheckoutModal } from "@/components/CheckoutModal";');
}

// 2. Add state
if (!content.includes('isCheckoutOpen')) {
    content = content.replace('const [isBrowseOpen, setIsBrowseOpen] = useState(false);',
        'const [isBrowseOpen, setIsBrowseOpen] = useState(false);\n  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);');
}

// 3. Rewrite handleUnlock and add handlePaymentSuccess
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

  const handleUnlock = () => {
    setIsCheckoutOpen(true);
  };
`;

if (!content.includes('handlePaymentSuccess')) {
    // We will find the EXACT handleUnlock string and replace it
    const oldHandleUnlock = `  const handleUnlock = () => {
    if (!reading) return;

    setIsLoading(true);
    // Mock successful payment since Razorpay was removed
    setTimeout(() => {
      setIsUnlocked(true);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      toast({
        title: "Report Unlocked! 🎉",
        description: "Your full numerology reading is now unlocked.",
      });
    }, 1000);
  };`;
    
    if (content.includes(oldHandleUnlock)) {
        content = content.replace(oldHandleUnlock, successFn);
    } else {
        console.error("Could not find exact handleUnlock string!");
    }
}

// 4. Update the first return (landing)
if (!content.includes('<CheckoutModal') && content.includes('<Footer />')) {
    content = content.replace('        <Footer />\n      </div >',
        '        <Footer />\n        <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      </div >');
}

// 5. Update the second return (preview)
// In the original file, it looks like:
//   return (
//     <ResultPreview
if (content.includes('return (\n    <ResultPreview')) {
    content = content.replace('  return (\n    <ResultPreview',
        '  return (\n    <>\n      <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      <ResultPreview');
    content = content.replace('      isLoading={isLoading}\n    />\n  );',
        '      isLoading={isLoading}\n    />\n    </>\n  );');
}

fs.writeFileSync('src/pages/Index.tsx', content);
console.log('Successfully updated Index.tsx');
