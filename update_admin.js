const fs = require('fs');

let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add home_hero_img input
html = html.replace(
  '<div><label class="pk-label">Hero Main Title</label>',
  '<div><label class="pk-label">Hero Image URL</label><input id="home-hero-img" class="pk-input" placeholder="e.g. image.jpg or https://..."></div>\n            <div><label class="pk-label">Hero Main Title</label>'
);

// 2. Add Why Travel With Us section
const whyHtml = `
        <div class="rounded-2xl bg-card p-6 shadow-card-soft">
          <h3 class="font-semibold text-foreground mb-4">🌟 Why Travel With Us</h3>
          <div class="space-y-3">
            <div><label class="pk-label">Point 1 Title & Desc</label><input id="home-why1-t" class="pk-input mb-1" placeholder="Title"><input id="home-why1-d" class="pk-input" placeholder="Description"></div>
            <div><label class="pk-label">Point 2 Title & Desc</label><input id="home-why2-t" class="pk-input mb-1" placeholder="Title"><input id="home-why2-d" class="pk-input" placeholder="Description"></div>
            <div><label class="pk-label">Point 3 Title & Desc</label><input id="home-why3-t" class="pk-input mb-1" placeholder="Title"><input id="home-why3-d" class="pk-input" placeholder="Description"></div>
            <div><label class="pk-label">Point 4 Title & Desc</label><input id="home-why4-t" class="pk-input mb-1" placeholder="Title"><input id="home-why4-d" class="pk-input" placeholder="Description"></div>
          </div>
        </div>
`;
html = html.replace(
  '<div class="rounded-2xl bg-card p-6 shadow-card-soft">\n          <h3 class="font-semibold text-foreground mb-4">✨ Experiences Section</h3>',
  whyHtml + '\n        <div class="rounded-2xl bg-card p-6 shadow-card-soft">\n          <h3 class="font-semibold text-foreground mb-4">✨ Experiences Section</h3>'
);

// 3. Add Experiences Items
html = html.replace(
  '<div><label class="pk-label">Section Title</label><input id="home-exp-title" class="pk-input" placeholder="Beyond Sightseeing"></div>\n          </div>',
  '<div><label class="pk-label">Section Title</label><input id="home-exp-title" class="pk-input" placeholder="Beyond Sightseeing"></div>\n            <div><label class="pk-label">Experience 1</label><input id="home-exp1" class="pk-input" placeholder="Shikara Rides"></div>\n            <div><label class="pk-label">Experience 2</label><input id="home-exp2" class="pk-input" placeholder="Skiing in Gulmarg"></div>\n            <div><label class="pk-label">Experience 3</label><input id="home-exp3" class="pk-input" placeholder="Apple Orchards"></div>\n            <div><label class="pk-label">Experience 4</label><input id="home-exp4" class="pk-input" placeholder="Local Cuisine"></div>\n          </div>'
);

// 4. Add Reviews Items
html = html.replace(
  '<div><label class="pk-label">Section Title</label><input id="home-rev-title" class="pk-input" placeholder="Loved by Wanderers"></div>\n          </div>',
  '<div><label class="pk-label">Section Title</label><input id="home-rev-title" class="pk-input" placeholder="Loved by Wanderers"></div>\n            <div><label class="pk-label">Review 1 Name & Text</label><input id="home-rev1-name" class="pk-input mb-1"><input id="home-rev1-text" class="pk-input"></div>\n            <div><label class="pk-label">Review 2 Name & Text</label><input id="home-rev2-name" class="pk-input mb-1"><input id="home-rev2-text" class="pk-input"></div>\n            <div><label class="pk-label">Review 3 Name & Text</label><input id="home-rev3-name" class="pk-input mb-1"><input id="home-rev3-text" class="pk-input"></div>\n          </div>'
);

// 5. Update PAGE_FIELD_MAP
const mapAdditions = `
      {f:'home_hero_img',      el:'home-hero-img'},
      {f:'home_why1_t',        el:'home-why1-t'},
      {f:'home_why1_d',        el:'home-why1-d'},
      {f:'home_why2_t',        el:'home-why2-t'},
      {f:'home_why2_d',        el:'home-why2-d'},
      {f:'home_why3_t',        el:'home-why3-t'},
      {f:'home_why3_d',        el:'home-why3-d'},
      {f:'home_why4_t',        el:'home-why4-t'},
      {f:'home_why4_d',        el:'home-why4-d'},
      {f:'home_exp1',          el:'home-exp1'},
      {f:'home_exp2',          el:'home-exp2'},
      {f:'home_exp3',          el:'home-exp3'},
      {f:'home_exp4',          el:'home-exp4'},
      {f:'home_rev1_name',     el:'home-rev1-name'},
      {f:'home_rev1_text',     el:'home-rev1-text'},
      {f:'home_rev2_name',     el:'home-rev2-name'},
      {f:'home_rev2_text',     el:'home-rev2-text'},
      {f:'home_rev3_name',     el:'home-rev3-name'},
      {f:'home_rev3_text',     el:'home-rev3-text'},
`;
html = html.replace(
  "{f:'home_hero_title',    el:'home-hero-title'},",
  mapAdditions + "\n      {f:'home_hero_title',    el:'home-hero-title'},"
);

fs.writeFileSync('admin/index.html', html, 'utf8');
console.log('Updated admin/index.html');
