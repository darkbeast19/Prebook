const fs = require('fs');
const cheerio = require('cheerio');

function processHtml(filename, actions) {
    if (!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf8');
    const $ = cheerio.load(html);
    
    actions.forEach(action => {
        const el = $(action.selector).eq(action.index || 0);
        if (el.length) {
            el.attr('data-pk', action.key);
        }
    });

    fs.writeFileSync(filename, $.html(), 'utf8');
    console.log(`Updated ${filename}`);
}

// 1. About Page
processHtml('about.html', [
    { selector: 'h1.font-serif', key: 'about_title' },
    { selector: 'p.max-w-2xl', key: 'about_sub' },
    { selector: 'h2.font-serif', index: 0, key: 'about_story_title' },
    { selector: 'div.max-w-3xl p', index: 0, key: 'about_story_p1' },
    { selector: 'div.max-w-3xl p', index: 1, key: 'about_story_p2' },
    { selector: 'h2.font-serif', index: 1, key: 'about_team_title' },
    { selector: '.font-serif.text-xl', index: 0, key: 'about_val1_t' },
    { selector: '.text-muted-foreground.mt-2', index: 0, key: 'about_val1_d' },
    { selector: '.font-serif.text-xl', index: 1, key: 'about_val2_t' },
    { selector: '.text-muted-foreground.mt-2', index: 1, key: 'about_val2_d' },
    { selector: '.font-serif.text-xl', index: 2, key: 'about_val3_t' },
    { selector: '.text-muted-foreground.mt-2', index: 2, key: 'about_val3_d' },
]);

// 2. Contact Page
processHtml('contact.html', [
    { selector: 'h1.font-serif', key: 'contact_title' },
    { selector: 'p.max-w-2xl', key: 'contact_sub' },
    { selector: '.font-semibold.text-foreground', index: 0, key: 'contact_office1_city' },
    { selector: '.text-muted-foreground', index: 0, key: 'contact_office1_addr' },
    { selector: '.font-semibold.text-foreground', index: 1, key: 'contact_office2_city' },
    { selector: '.text-muted-foreground', index: 1, key: 'contact_office2_addr' },
    { selector: '.font-semibold.text-foreground', index: 2, key: 'contact_office3_city' },
    { selector: '.text-muted-foreground', index: 2, key: 'contact_office3_addr' }
]);
// For the map, we need to inject the URL dynamically, but since it's an iframe src, we can't just use data-pk on the text content. We will add data-pk="contact_map_url" to the iframe and let shared.js handle it differently, or just handle it directly in shared.js. Let's add data-pk to the iframe itself.
processHtml('contact.html', [
    { selector: 'iframe', key: 'contact_map_url' }
]);

// 3. Packages Page
processHtml('packages.html', [
    { selector: 'h1.font-serif', key: 'pkgpage_title' },
    { selector: 'p.max-w-2xl', key: 'pkgpage_sub' },
    { selector: 'h2.font-serif', index: 0, key: 'pkgpage_filter_title' },
    { selector: 'p.text-muted-foreground', index: 1, key: 'pkgpage_no_results' } // Assuming 0 is the subtitle
]);

// 4. Destinations Page
processHtml('destinations.html', [
    { selector: 'h1.font-serif', key: 'dest_title' },
    { selector: 'p.max-w-2xl', key: 'dest_sub' }
]);
