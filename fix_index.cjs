const fs = require('fs');
const content = fs.readFileSync('src/pages/Index.tsx', 'utf8');
const lines = content.split(/\r?\n/);

// Line indices are 0-based in the array
// We want to remove lines from 1997 (index) to 2149 (index)
// In the previous view_file, line 1997 was index 1996.
// Let's verify the content around those indices first to be absolutely sure.

const startIndex = 1997; // This corresponds to line 1998 in the view_file output
const endIndex = 2148;   // This corresponds to line 2149 in the view_file output

const newLines = [
    '                    ))}',
    '                  </div>',
    '                  <CarouselNext className="static md:absolute md:-right-6 md:top-1/2 md:-translate-y-1/2 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all h-12 w-12 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)]" />',
    '                </div>',
    '              </Carousel>',
    '            </div>',
    '          </section>'
];

lines.splice(startIndex, endIndex - startIndex + 1, ...newLines);

fs.writeFileSync('src/pages/Index.tsx', lines.join('\n'));
console.log('Fixed');
