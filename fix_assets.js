const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace relative asset paths with absolute paths from the Lovable app
html = html.replace(/="\/assets\//g, '="https://preview--vale-voyage-hub.lovable.app/assets/');

fs.writeFileSync('index.html', html);
console.log('Fixed asset URLs in index.html');
