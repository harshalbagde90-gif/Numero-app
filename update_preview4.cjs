const fs = require('fs');

function updateFile() {
  let content = fs.readFileSync('d:/NumGuru/src/components/ResultPreview.tsx', 'utf8');

  // Find the exact line: <div className="max-w-4xl mx-auto pt-8">
  const targetStr = '<div className="max-w-4xl mx-auto pt-8">';
  if (content.includes(targetStr)) {
    content = content.replace(
       targetStr,
       `
                </div> {/* End inner grid */}
              </div> {/* End Right Column Content */}
            </div> {/* End 12-col grid */}

            <div className="max-w-4xl mx-auto pt-8">`
    );
    
    // We ALSO need to REMOVE the old closing </div> that was closing the original grid,
    // OR we just leave it and only add the two missing ones.
    // Wait, the original grid had ONE closing </div>.
    // My replacement added 3 `</div>`s. So we have 3 + 1 = 4 closing `</div>`s now, which is correct because we opened 3 + 1 = 4?
    // Wait, we replaced 1 opening div with 3 opening divs. So we need 3 closing divs total.
    // The original code had 1 closing div. So we only need to add 2 MORE closing divs!
    // My code above adds 3 closing divs. So we should replace `</div>\n\n              <div className="max-w-4xl mx-auto pt-8">`
    // with our 3 closing divs, so it overwrites the original 1 closing div.
  }

  // Let's do it safely by replacing the exact block before max-w-4xl.
  const regex = /<\/div>\s*<div className="max-w-4xl mx-auto pt-8">/;
  content = content.replace(regex, 
    `              </div> {/* End original grid closing, now inner grid */}
              </div> {/* End Right Column Content */}
            </div> {/* End 12-col grid */}

            <div className="max-w-4xl mx-auto pt-8">`
  );

  fs.writeFileSync('d:/NumGuru/src/components/ResultPreview.tsx', content, 'utf8');
  console.log('Update applied');
}

updateFile();
