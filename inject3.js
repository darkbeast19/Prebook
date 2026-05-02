const fs=require('fs'); const cheerio=require('cheerio'); 
const h=fs.readFileSync('index.html','utf8'); 
const $=cheerio.load(h); 
$('img[src="hero-kashmir.jpg"]').attr('data-pk', 'home_hero_img'); 
fs.writeFileSync('index.html', $.html(), 'utf8');
