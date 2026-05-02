const fs = require('fs');
const cheerio = require('cheerio');

// 1. Update index.html with data-pk for Why Travel With Us
function updateIndex() {
    const html = fs.readFileSync('index.html', 'utf8');
    const $ = cheerio.load(html);
    
    // Why Travel With Us section
    const whyTitles = $('section#why h3.font-serif');
    const whyDescs = $('section#why p.mt-2');
    whyTitles.eq(0).attr('data-pk', 'home_why1_t'); whyDescs.eq(0).attr('data-pk', 'home_why1_d');
    whyTitles.eq(1).attr('data-pk', 'home_why2_t'); whyDescs.eq(1).attr('data-pk', 'home_why2_d');
    whyTitles.eq(2).attr('data-pk', 'home_why3_t'); whyDescs.eq(2).attr('data-pk', 'home_why3_d');
    whyTitles.eq(3).attr('data-pk', 'home_why4_t'); whyDescs.eq(3).attr('data-pk', 'home_why4_d');

    // Unique Experiences
    const expTitles = $('section#experiences h3.font-serif');
    expTitles.eq(0).attr('data-pk', 'home_exp1');
    expTitles.eq(1).attr('data-pk', 'home_exp2');
    expTitles.eq(2).attr('data-pk', 'home_exp3');
    expTitles.eq(3).attr('data-pk', 'home_exp4');

    // Reviews
    const revNames = $('section#reviews .font-medium.text-foreground');
    const revTexts = $('section#reviews blockquote p');
    revNames.eq(0).attr('data-pk', 'home_rev1_name'); revTexts.eq(0).attr('data-pk', 'home_rev1_text');
    revNames.eq(1).attr('data-pk', 'home_rev2_name'); revTexts.eq(1).attr('data-pk', 'home_rev2_text');
    revNames.eq(2).attr('data-pk', 'home_rev3_name'); revTexts.eq(2).attr('data-pk', 'home_rev3_text');

    fs.writeFileSync('index.html', $.html(), 'utf8');
    console.log('Updated index.html');
}
updateIndex();
