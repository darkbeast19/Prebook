const fs = require('fs');
const path = require('path');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let removedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const waRegex = /<a[^>]+href=\"https:\/\/wa\.me\/[^\"]+\"[^>]*>[\s\S]*?<span[^>]*animate-ping[^>]*>[\s\S]*?<\/a>/ig;
  if (waRegex.test(content)) {
    content = content.replace(waRegex, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed from ' + file);
    removedCount++;
  }
}
console.log('Removed hardcoded WA button from ' + removedCount + ' files.');
