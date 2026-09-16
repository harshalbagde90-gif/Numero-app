const fs = require('fs');
const logPath = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7e557373-4ca1-4dbe-ab74-3ac5e66115fe\\.system_generated\\tasks\\task-2700.log';
const log = fs.readFileSync(logPath, 'utf8');

const diffStart = log.indexOf('diff --git');
if (diffStart !== -1) {
    const patch = log.substring(diffStart);
    fs.writeFileSync('scratch/lost_changes.patch', patch);
    console.log('Patch extracted to scratch/lost_changes.patch');
} else {
    console.log('Could not find diff in log.');
}
