const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/ASUS/.gemini/antigravity-ide/brain/7e557373-4ca1-4dbe-ab74-3ac5e66115fe/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const output = [];
  
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if ((tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content') && tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('ResultPreview')) {
            output.push({
               step: obj.step_index,
               name: tc.name,
               args: tc.args
            });
          }
        }
      }
    } catch(e) {}
  }
  
  fs.writeFileSync('find-lines.json', JSON.stringify(output, null, 2));
  console.log('Saved find-lines.json with ' + output.length + ' entries.');
}

processLineByLine();
