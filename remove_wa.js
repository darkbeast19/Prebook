const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match the old whatsapp button pattern
  const oldBtnRegex = /<a href="[^"]*wa\.me[^"]*" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" class="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-elegant transition-smooth hover:scale-105" style="background:hsl\(142,70%,40%\)">[\s\S]*?<\/a>/g;
  
  if (oldBtnRegex.test(content)) {
    content = content.replace(oldBtnRegex, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed old WA button from', file);
  }
});
