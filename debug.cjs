const fs = require('fs');
const content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

console.log('Has core grid:', content.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-6">') > -1);
console.log('Has color grid:', content.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">') > -1);
