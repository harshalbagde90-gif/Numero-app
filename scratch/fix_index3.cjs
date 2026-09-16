const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// 1. Remove useRazorpay import
content = content.replace('import { useRazorpay } from "@/hooks/useRazorpay";\n', '');

// 2. Add CheckoutModal import
if (!content.includes('CheckoutModal')) {
    content = content.replace('import { ResultPreview } from "@/components/ResultPreview";', 
        'import { ResultPreview } from "@/components/ResultPreview";\nimport { CheckoutModal } from "@/components/CheckoutModal";');
}

// 3. Remove initiatePayment destructuring
content = content.replace('  const { initiatePayment } = useRazorpay();\n', '');

// 4. Add isCheckoutOpen state
if (!content.includes('isCheckoutOpen')) {
    content = content.replace('const [isBrowseOpen, setIsBrowseOpen] = useState(false);',
        'const [isBrowseOpen, setIsBrowseOpen] = useState(false);\n  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);');
}

// 5. Create new handler text
const newHandlers = `  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setIsLoading(false);
    setState("preview");
    window.scrollTo({ top: 0, behavior: "instant" });
    toast({
      title: "Report Unlocked! 🎉",
      description: "Your full numerology reading is now unlocked.",
    });
  };

  const handleFullSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = fullName.trim();
    if (!name) return;
    if (!fullDob) {
      toast({
        title: "Invalid Date",
        description: "Please select a date of birth.",
        variant: "destructive",
      });
      return;
    }

    const newReading = generateReading(name, fullDob);
    setReading(newReading);
    setIsCheckoutOpen(true);
  };

  const handleUnlock = () => {
    if (!reading) return;
    setIsCheckoutOpen(true);
  };
`;

// 6. Find handleFullSubmit in the file
const startSearch = 'const handleFullSubmit = (e: React.FormEvent) => {';
const endSearch = '  if (state === "landing" || !reading) {';

const startIndex = content.indexOf(startSearch);
const endIndex = content.indexOf(endSearch);

if (startIndex !== -1 && endIndex !== -1) {
    const stringToReplace = content.substring(startIndex, endIndex);
    content = content.replace(stringToReplace, newHandlers + '\n');
}

// 7. Update returns
if (!content.includes('<CheckoutModal') && content.includes('<Footer />')) {
    content = content.replace('        <Footer />\n      </div >',
        '        <Footer />\n        <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      </div >');
}

if (content.includes('return (\n    <ResultPreview')) {
    content = content.replace('  return (\n    <ResultPreview',
        '  return (\n    <>\n      <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} onSuccess={handlePaymentSuccess} />\n      <ResultPreview');
    content = content.replace('      isLoading={isLoading}\n    />\n  );',
        '      isLoading={isLoading}\n    />\n    </>\n  );');
}

fs.writeFileSync('src/pages/Index.tsx', content);
console.log('Fixed Index.tsx completely.');
