const fs = require('fs');
let c = fs.readFileSync('src/pages/Index.tsx', 'utf8');

c = c.replace(
  'className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"',
  'className="group flex items-center gap-3 px-6 py-3 rounded-full border border-secondary/50 text-secondary hover:bg-secondary hover:text-black transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]"'
);

c = c.replace(
  '<div className="grid grid-cols-1 md:grid-cols-3 gap-8">',
  '<Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="w-full relative"><CarouselContent className="py-4 -ml-4">'
);

c = c.replace(
  /\{latestPosts\.map\(\(post, i\) => \([\s\S]*?<Link[\s\S]*?key=\{i\}/,
  '{latestPosts.map((post, i) => (\n<CarouselItem key={i} className="pl-4 md:basis-1/3 sm:basis-1/2 basis-full">\n<Link'
);

c = c.replace(
  /className="group relative overflow-hidden rounded-\[2rem\] border border-white\/5 bg-white\/\[0\.02\] transition-all duration-500 hover:border-secondary\/30 hover:bg-white\/\[0\.05\]"/g,
  'className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-secondary/30 hover:bg-white/[0.05] flex flex-col h-full"'
);

c = c.replace(
  '<div className="p-8">',
  '<div className="p-8 flex flex-col items-center text-center flex-grow">'
);

c = c.replace(
  '<p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">',
  '<p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 font-medium flex-grow">'
);

c = c.replace(
  /<div className="flex items-center gap-2 text-white\/40 text-\[9px\] font-black uppercase tracking-widest group-hover:text-white transition-colors">[\s\S]*?Read Investigation[\s\S]*?<ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" \/>[\s\S]*?<\/div>/g,
  '<div className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]">Read More<ChevronRight className="h-3 w-3" /></div>'
);

c = c.replace(
  /<\/Link>\s*\)\)}\s*<\/div>\s*<\/div>\s*<\/section>/,
  '</Link>\n</CarouselItem>\n))}\n</CarouselContent>\n<div className="flex justify-center items-center gap-6 mt-10">\n<CarouselPrevious className="static bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all h-12 w-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)] translate-y-0" />\n<CarouselNext className="static bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all h-12 w-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)] translate-y-0" />\n</div>\n</Carousel>\n</div>\n</section>'
);

fs.writeFileSync('src/pages/Index.tsx', c);
console.log('Done');
