// =====================================================
//  Prebook Holidays – Shared JavaScript
// =====================================================

// ---- Supabase REST API Helper (no SDK needed) --------
const _SB_URL = 'https://loohpvsxpraeowokpkuk.supabase.co/rest/v1';
const _SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvb2hwdnN4cHJhZW93b2twa3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjI0MTksImV4cCI6MjA5MzE5ODQxOX0.vsW2LVZY9t9T9nr1dpWUJ6XZDjSMJJz1VNvv2ccRaeI';
const _SB_H = {
  'apikey': _SB_KEY,
  'Authorization': `Bearer ${_SB_KEY}`,
  'Content-Type': 'application/json',
};

async function _sbGet(table, query) {
  try {
    const r = await fetch(`${_SB_URL}/${table}?${query||''}`, { headers: _SB_H, cache: 'no-store' });
    if (!r.ok) { console.error(`DB GET error ${r.status}`); return null; }
    return r.json();
  } catch(e) { console.error('DB fetch error', e); return null; }
}
async function _sbPost(table, body, prefer) {
  try {
    const r = await fetch(`${_SB_URL}/${table}`, {
      method: 'POST',
      headers: { ..._SB_H, ...(prefer ? { 'Prefer': prefer } : {}) },
      body: JSON.stringify(body),
    });
    if (!r.ok) { console.error(`DB POST error ${r.status}`, await r.text()); return false; }
    return true;
  } catch(e) { console.error('DB fetch error', e); return false; }
}
async function _sbPatch(table, filter, body) {
  try {
    const r = await fetch(`${_SB_URL}/${table}?${filter}`, {
      method: 'PATCH', headers: _SB_H, body: JSON.stringify(body),
    });
    if (!r.ok) { console.error(`DB PATCH error ${r.status}`); return false; }
    return true;
  } catch(e) { console.error('DB fetch error', e); return false; }
}
async function _sbDelete(table, filter) {
  try {
    const r = await fetch(`${_SB_URL}/${table}?${filter}`, {
      method: 'DELETE', headers: _SB_H,
    });
    if (!r.ok) { console.error(`DB DELETE error ${r.status}`); return false; }
    return true;
  } catch(e) { console.error('DB fetch error', e); return false; }
}

// ---- PK – Main data store (Supabase REST) --------
const PK = {
  async getSettings() {
    const data = await _sbGet('settings', 'id=eq.site');
    if (data && data.length > 0 && data[0].content) {
      return data[0].content;
    }
    // Return defaults if table doesn't exist or is empty
    return {
      heroTitle: 'Discover the Paradise on Earth',
      heroSub: 'Experience the magic of Kashmir with Prebook Holidays. Unforgettable journeys, curated just for you.',
      phone1: '+91 83779 24630',
      phone2: '+91 98991 05056',
      email: 'info@prebookholidays.com',
      footerAbout: 'Your trusted travel partner for unforgettable Kashmir experiences. Let us plan your perfect getaway.'
    };
  },
  async saveSettings(payload) {
    const body = { id: 'site', content: payload };
    return _sbPost('settings', body, 'resolution=merge-duplicates');
  },
  async getEnquiries() {
    const data = await _sbGet('enquiries', 'order=date.desc');
    return data || [];
  },
  async saveEnquiry(payload) {
    const body = { ...payload, date: new Date().toISOString(), status: 'New' };
    return _sbPost('enquiries', body);
  },
  async deleteEnquiry(id) {
    return _sbDelete('enquiries', `id=eq.${id}`);
  },
  async updateEnquiryStatus(id, status) {
    return _sbPatch('enquiries', `id=eq.${id}`, { status });
  },
  async clearAllEnquiries() {
    return _sbDelete('enquiries', `id=neq.0`);
  },
  async getPackages() {
    const data = await _sbGet('packages', 'order=id.asc');
    if (!data || data.length === 0) {
      const defaults = PK._defaultPackages();
      await _sbPost('packages', defaults, 'resolution=merge-duplicates');
      return defaults;
    }
    return data;
  },
  async saveSinglePackage(pkg) {
    return _sbPost('packages', Array.isArray(pkg) ? pkg : [pkg], 'resolution=merge-duplicates');
  },
  async savePackages(list) {
    return _sbPost('packages', list, 'resolution=merge-duplicates');
  },
  async deletePackage(id) {
    return _sbDelete('packages', `id=eq.${id}`);
  },
  async patchPackage(id, fields) {
    // Use PATCH for partial updates (no NOT NULL constraint issues)
    return _sbPatch('packages', `id=eq.${id}`, fields);
  },
  _defaultPackages() {
    return [
      { id:1, name:'Quick Escape',           nights:2, days:3,  price:9999,  badge:'Quick Getaway', rating:4.7, reviews:96,  places:'Srinagar \\u00b7 Gulmarg',                               img:'https://preview--vale-voyage-hub.lovable.app/assets/srinagar-CUCqq7tp.jpg', location: 'Srinagar, Kashmir', map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105676.8153434686!2d74.72089456578033!3d34.08365287515096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18f98f98d41e7%3A0xed4d38c642e057f9!2sSrinagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin', inclusions: '3-Star Hotel Accommodation\\nDaily Breakfast & Dinner\\nAirport Transfers\\nShikara Ride on Dal Lake', exclusions: 'Flight Tickets\\nPersonal Expenses\\nEntry tickets to gardens' },
      { id:2, name:'Most Selling Short Trip',nights:3, days:4,  price:13499, badge:'Bestseller',     rating:4.8, reviews:214, places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam',                     img:'https://preview--vale-voyage-hub.lovable.app/assets/gulmarg-Dr3BYDyx.jpg', location: 'Gulmarg, Kashmir', map_embed: '', inclusions: 'Hotel Accommodation\\nMeals (MAP)\\nPrivate Cab\\nGondola Phase 1 Ticket', exclusions: 'Flights\\nLunch' },
      { id:3, name:'Balanced Tour',          nights:4, days:5,  price:17499, badge:'Family Pick',    rating:4.9, reviews:178, places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam',                     img:'https://preview--vale-voyage-hub.lovable.app/assets/pahalgam-Cv4DMcdc.jpg' },
      { id:4, name:'Best Selling Package',   nights:5, days:6,  price:21499, badge:'Bestseller',     rating:4.9, reviews:312, places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg',           img:'https://preview--vale-voyage-hub.lovable.app/assets/sonmarg-BZ2NmOJH.jpg' },
      { id:5, name:'Extended Relaxed Tour',  nights:6, days:7,  price:25999, badge:'Relaxed Pace',   rating:4.8, reviews:142, places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg',           img:'https://preview--vale-voyage-hub.lovable.app/assets/pahalgam-Cv4DMcdc.jpg' },
      { id:6, name:'Grand Kashmir Tour',     nights:7, days:8,  price:29999, badge:'Grand Tour',     rating:4.9, reviews:118, places:'Jammu \\u00b7 Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg',   img:'https://preview--vale-voyage-hub.lovable.app/assets/gulmarg-Dr3BYDyx.jpg' },
      { id:7, name:'Premium Kashmir+Offbeat',nights:8, days:9,  price:34999, badge:'Premium',        rating:4.9, reviews:87,  places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg \\u00b7 Yusmarg', img:'https://preview--vale-voyage-hub.lovable.app/assets/sonmarg-BZ2NmOJH.jpg' },
      { id:8, name:'Deep Exploration',       nights:9, days:10, price:39999, badge:'Explorer',       rating:4.8, reviews:64,  places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg \\u00b7 Yusmarg \\u00b7 Doodhpathri', img:'https://preview--vale-voyage-hub.lovable.app/assets/pahalgam-Cv4DMcdc.jpg' },
      { id:9, name:'Kashmir + Adventure',    nights:10,days:11, price:44999, badge:'Adventure',      rating:4.9, reviews:52,  places:'Srinagar \\u00b7 Gulmarg \\u00b7 Pahalgam \\u00b7 Sonmarg \\u00b7 Yusmarg \\u00b7 Doodhpathri \\u00b7 Aru Valley', img:'https://preview--vale-voyage-hub.lovable.app/assets/gulmarg-Dr3BYDyx.jpg' },
    ];
  },
};

// ---- Mobile nav toggle ------------------------------
function initMobileNav() {
  const btn = document.getElementById('nav-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('#mobile-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// ---- Popup helpers ----------------------------------
function openPopup(id)  { document.getElementById(id)?.classList.add('open'); }
function closePopup(id) { document.getElementById(id)?.classList.remove('open'); }
function initPopups() {
  document.querySelectorAll('[data-popup-open]').forEach(el =>
    el.addEventListener('click', () => openPopup(el.dataset.popupOpen)));
  document.querySelectorAll('[data-popup-close]').forEach(el =>
    el.addEventListener('click', () => closePopup(el.dataset.popupClose)));
  document.querySelectorAll('.popup-overlay').forEach(overlay =>
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); }));
}

// ---- Callback popup form ----------------------------
function initCallbackForm() {
  const form = document.getElementById('callback-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = form.querySelector('[name=cb-name]').value.trim();
    const phone = form.querySelector('[name=cb-phone]').value.trim();
    if (!name || !phone) return;
    await PK.saveEnquiry({ type:'Callback', name, phone, email:'', message:'Instant callback request' });
    const wa = `https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'm ${name}, please call me back on ${phone}.`)}`;
    window.open(wa, '_blank');
    closePopup('callback-popup');
    form.reset();
    showToast(`\u2705 Request sent! We'll call you soon.`);
  });
}

// ---- Enquiry forms (generic) ------------------------
function initEnquiryForms() {
  document.querySelectorAll('.pk-enquiry-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {};
      new FormData(form).forEach((v, k) => data[k] = v);
      data.type = 'Enquiry';
      await PK.saveEnquiry(data);
      const msg = `Hi Prebook Holidays!\nName: ${data.name||''}\nPhone: ${data.phone||''}\nEmail: ${data.email||''}\nPackage: ${data.package||'General'}\nTravellers: ${data.travellers||''}\nDate: ${data.date||''}\nMessage: ${data.message||''}`;
      window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
      closePopup('enquiry-popup');
      showToast(`\u2705 Enquiry sent! We'll respond within 24 hours.`);
      form.reset();
    });
  });
}

// ---- Exit intent popup ------------------------------
function initExitIntent() {
  if (sessionStorage.getItem('exit_shown')) return;
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 10) {
      sessionStorage.setItem('exit_shown', '1');
      openPopup('exit-popup');
    }
  });
}

// ---- Toast notification -----------------------------
function showToast(msg) {
  let t = document.getElementById('pk-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'pk-toast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:hsl(168,60%,22%);color:white;padding:0.75rem 1.5rem;border-radius:9999px;font-size:0.875rem;font-weight:500;z-index:99999;opacity:0;transition:opacity 0.3s;pointer-events:none;white-space:nowrap';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// ---- Dynamic Price Calculator -----------------------
function initPriceCalculator() {
  const wrap    = document.getElementById('price-calc');
  if (!wrap) return;
  const baseInput = wrap.querySelector('[name=base-price]');
  const people    = wrap.querySelector('[name=people]');
  const season    = wrap.querySelector('[name=season]');
  const output    = document.getElementById('calc-output');
  function update() {
    if (!baseInput || !people || !output) return;
    let base = parseFloat(baseInput.value) || 0;
    let n    = parseInt(people.value) || 1;
    let mult = season ? (season.value === 'peak' ? 1.25 : season.value === 'off' ? 0.85 : 1) : 1;
    let total = Math.round(base * n * mult);
    output.textContent = '\u20b9' + total.toLocaleString('en-IN');
  }
  [baseInput, people, season].forEach(el => el?.addEventListener('change', update));
  update();
}

// ---- Dynamic Package Rendering ------------------------
async function renderIndexPackages() {
  const container = document.querySelector('#packages .grid');
  if (!container) return; // Only run if we are on a page with packages

  // We keep the original skeleton or just load directly
  const pkgs = await PK.getPackages();
  if (!pkgs || pkgs.length === 0) return;

  container.innerHTML = pkgs.map(pkg => `
    <article class="group flex flex-col overflow-hidden rounded-2xl bg-card text-left shadow-card-soft transition-smooth hover:-translate-y-2 hover:shadow-elegant">
      <button type="button" aria-label="View details for ${pkg.name}" class="relative h-64 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset" onclick="window.location.href='package-details.html?id=${pkg.id}'">
        <img src="${pkg.img}" alt="${pkg.name}" loading="lazy" width="1024" height="1024" class="h-full w-full object-cover transition-smooth group-hover:scale-110">
        <span class="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">${pkg.badge}</span>
        <span class="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-card-soft backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3.5 w-3.5 fill-secondary text-secondary"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
          ${pkg.rating}
        </span>
      </button>
      <div class="flex flex-1 flex-col p-6">
        <div class="text-xs font-semibold uppercase tracking-wider text-primary">${pkg.nights} Nights / ${pkg.days} Days</div>
        <h3 class="mt-1 font-serif text-xl font-bold text-foreground">${pkg.name}</h3>
        <div class="mt-2 flex items-center gap-1.5">
          <div class="flex items-center" aria-label="${pkg.rating} out of 5 stars">
            ${Array(5).fill('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3.5 w-3.5 fill-secondary text-secondary"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>').join('')}
          </div>
          <span class="text-xs text-muted-foreground">${pkg.rating} (${pkg.reviews} reviews)</span>
        </div>
        <div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 text-primary"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${pkg.places}</span>
        </div>
        <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-4 w-4 text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
          <span>${pkg.days} Days / ${pkg.nights} Nights</span>
        </div>
        <div class="mt-auto flex items-end justify-between border-t border-border pt-5 mt-5">
          <div>
            <div class="text-xs text-muted-foreground mb-1 tracking-wide uppercase">Starting from</div>
            ${pkg.discount_price ? `<div class="font-serif text-sm text-muted-foreground line-through decoration-red-500/50">\u20B9${pkg.price.toLocaleString('en-IN')}</div>` : ''}
            <div class="flex items-center gap-3">
              <div class="font-serif text-3xl text-primary drop-shadow-sm" style="font-weight: 500; letter-spacing: -0.02em;">
                \u20B9${(pkg.discount_price || pkg.price).toLocaleString('en-IN')}
              </div>
              ${pkg.discount_label ? `
              <span class="relative inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-md transform -translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                ${pkg.discount_label}
                <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              </span>` : ''}
            </div>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-muted hover:text-accent-foreground h-10 px-4 py-2 mt-5 w-full transition-smooth" type="button" onclick="window.location.href='package-details.html?id=${pkg.id}'">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
        </button>
        <button data-get-price="1" onclick="openPopup('get-price-popup')" type="button"
          style="margin-top:0.5rem;width:100%;padding:0.6rem;border-radius:0.375rem;border:none;
                 background:linear-gradient(135deg,hsl(38,96%,54%),hsl(25,96%,50%));color:#111;
                 font-weight:700;font-size:0.85rem;cursor:pointer;letter-spacing:0.01em;
                 box-shadow:0 2px 12px rgba(251,146,60,0.3);transition:transform 0.2s;"
          onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
          🏷️ Get Best Price
        </button>
      </div>
    </article>
  `).join('');
}

// ---- PDF Download -----------------------------------
function downloadPackagePDF(pkg) {
  if (!pkg) return;
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>${pkg.name} – Prebook Holidays</title>
  <style>body{font-family:Georgia,serif;max-width:700px;margin:2rem auto;color:#1a2e1a}
  h1{color:hsl(168,60%,22%)}h2{color:hsl(168,60%,28%);margin-top:1.5rem}
  .meta{display:flex;gap:2rem;margin:1rem 0;color:#555;font-size:0.9rem}
  .places{background:#f0faf4;padding:1rem;border-radius:0.5rem;margin:1rem 0}
  .price{font-size:2rem;font-weight:bold;color:hsl(168,60%,22%)}
  .footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ddd;color:#888;font-size:0.8rem}
  @media print{button{display:none}}</style></head><body>
  <img src="${pkg.img}" style="width:100%;height:220px;object-fit:cover;border-radius:0.75rem" alt="${pkg.name}" onerror="this.style.display='none'">
  <h1>${pkg.name}</h1>
  <div class="meta"><span>\ud83c\udf19 ${pkg.nights} Nights / ${pkg.days} Days</span><span>\u2b50 ${pkg.rating} (${pkg.reviews} reviews)</span></div>
  <div class="places">\ud83d\udccd ${pkg.places}</div>
  <h2>Highlights</h2>
  <ul><li>Comfortable hotel accommodations throughout</li><li>Daily breakfast included</li>
  <li>All transfers in AC vehicle</li><li>Sightseeing as per itinerary</li>
  <li>Expert local guide</li><li>24/7 support from Prebook Holidays</li></ul>
  <h2>Pricing</h2>
  ${pkg.discount_price ? `<div class="price" style="font-size:1.2rem;text-decoration:line-through;color:#999">\u20b9${pkg.price.toLocaleString('en-IN')}</div>` : ''}
  <div class="price">\u20b9${(pkg.discount_price || pkg.price).toLocaleString('en-IN')} <span style="font-size:1rem;font-weight:normal;color:#666">per person ${pkg.discount_label ? `(${pkg.discount_label})` : ''}</span></div>
  <p style="color:#666;font-size:0.9rem">*Prices may vary during peak season. Contact us for exact quote.</p>
  <h2>Contact Us</h2>
  <p>\ud83d\udcde +91 83779 24630 | +91 98991 05056<br>\u2709\ufe0f info@prebookholidays.com<br>\ud83c\udf10 www.prebookholidays.com</p>
  <div class="footer">Generated by Prebook Holidays | ${new Date().toLocaleDateString('en-IN')}</div>
  <br><button onclick="window.print()" style="padding:0.75rem 2rem;background:hsl(168,60%,22%);color:white;border:none;border-radius:0.5rem;cursor:pointer;font-size:1rem">Print / Save PDF</button>
  </body></html>`);
  win.document.close();
}

// ---- Settings Apply ---------------------------------
async function applySettings() {
  const s = await PK.getSettings();
  if (!s) return;

  const txt = (sel, val) => { if (!val) return; const el = document.querySelector(sel); if (el) el.textContent = val; };

  // ── HERO ──────────────────────────────────────────────────────────
  const heroTitle = s.home_hero_title || s.heroTitle;
  const heroAccent = s.home_hero_accent || '';
  if (heroTitle) {
    const heroEl = document.querySelector('h1.font-serif.text-5xl, h1.font-serif.text-4xl');
    if (heroEl) {
      if (heroAccent && heroTitle.includes(heroAccent)) {
        heroEl.innerHTML = heroTitle.replace(heroAccent, `<br><span class="italic text-secondary">${heroAccent}</span>`);
      } else {
        const parts = heroTitle.split(' '); const last = parts.pop();
        heroEl.innerHTML = `${parts.join(' ')} <br><span class="italic text-secondary">${last}</span>`;
      }
    }
  }
  const heroSub = document.querySelector('p.max-w-xl');
  if (heroSub && (s.home_hero_sub || s.heroSub)) heroSub.textContent = s.home_hero_sub || s.heroSub;

  // ── HERO STATS ────────────────────────────────────────────────────
  const statGrid = document.querySelectorAll('.grid.max-w-2xl.grid-cols-3 > div');
  [[s.home_stat1_num, s.home_stat1_lbl],[s.home_stat2_num, s.home_stat2_lbl],[s.home_stat3_num, s.home_stat3_lbl]]
    .forEach(([num, lbl], i) => {
      if (!statGrid[i]) return;
      const n = statGrid[i].querySelector('.font-serif'); if (n && num) n.textContent = num;
      const l = statGrid[i].querySelector('.text-xs, .text-sm'); if (l && lbl) l.textContent = lbl;
    });

  // ── SECTION HEADINGS (home page) ────────────────────────────────
  txt('section#packages .uppercase.tracking-\\[0\\.2em\\]', s.home_pkg_label);
  txt('section#packages h2.font-serif', s.home_pkg_title);
  txt('section#packages p.text-muted-foreground', s.home_pkg_desc);
  txt('section#experiences .uppercase', s.home_exp_label);
  txt('section#experiences h2.font-serif', s.home_exp_title);
  txt('section#reviews .uppercase', s.home_rev_label);
  txt('section#reviews h2.font-serif', s.home_rev_title);
  txt('section#contact p.text-primary-foreground\\/80', s.home_cta_sub);
  if (s.home_cta_title) {
    const ctaH = document.querySelector('section#contact h2.font-serif');
    if (ctaH) {
      const accent = ctaH.querySelector('.italic');
      ctaH.innerHTML = s.home_cta_title + (accent ? '<br>' + accent.outerHTML : '');
    }
  }

  // ── PHONES ────────────────────────────────────────────────────────
  const ph1 = s.contact_phone1 || s.pkgpage_phone1 || s.phone1 || '';
  const ph2 = s.contact_phone2 || s.pkgpage_phone2 || s.phone2 || '';
  const waNum = (s.contact_wa || s.home_wa_number || ph1).replace(/\D/g, '');
  if (ph1) document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    const t = a.textContent.trim();
    if (t.includes('83779') || t.includes('Call') || t === ph1) {
      a.href = 'tel:' + ph1.replace(/\s/g,'');
      if (t.includes('Call')) a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Call ${ph1}`;
      else a.textContent = ph1;
    }
  });
  if (ph2) document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    if (a.textContent.trim().includes('98991') || a.textContent.trim() === ph2) {
      a.href = 'tel:' + ph2.replace(/\s/g,''); a.textContent = ph2;
    }
  });
  if (waNum) document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
    const q = a.href.includes('?') ? '?' + a.href.split('?')[1] : '';
    a.href = 'https://wa.me/' + waNum + q;
  });

  // ── EMAIL ─────────────────────────────────────────────────────────
  const em = s.contact_email || s.pkgpage_email || s.email || '';
  if (em) document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.href = 'mailto:' + em;
    if (!a.querySelector('svg')) a.textContent = em;
  });

  // ── FOOTER ────────────────────────────────────────────────────────
  const fpa = s.home_footer_about || s.footerAbout;
  if (fpa) { const fp = document.querySelector('footer p.text-sm.text-muted-foreground'); if (fp) fp.textContent = fpa; }
  if (s.home_footer_copy) { const fc = document.querySelector('footer .border-t.border-border.pt-6'); if (fc) fc.textContent = s.home_footer_copy; }
  const offLis = document.querySelectorAll('footer li span:last-child');
  if (s.home_office1 && offLis[0]) offLis[0].textContent = s.home_office1;
  if (s.home_office2 && offLis[1]) offLis[1].textContent = s.home_office2;
  if (s.home_office3 && offLis[2]) offLis[2].textContent = s.home_office3;

  // ── DYNAMIC DATA-PK ELEMENTS ──
  document.querySelectorAll('[data-pk]').forEach(el => {
    const key = el.getAttribute('data-pk');
    if (s[key]) {
      if (el.tagName === 'IFRAME' || el.tagName === 'IMG') el.src = s[key];
      else el.textContent = s[key];
    }
  });

  // ── DESTINATIONS CARDS ──
  if (window.location.pathname.includes('destinations') && s.dest_cards) {
    const grid = document.querySelector('.grid.gap-8');
    if (grid) {
      grid.innerHTML = s.dest_cards.map(c => `
      <article class="group rounded-2xl overflow-hidden bg-card shadow-card-soft card-hover">
        <div class="relative h-64 overflow-hidden ${!c.img ? 'bg-primary' : ''}">
          ${c.img ? `<img src="${c.img}" alt="${c.name}" class="h-full w-full object-cover transition-smooth group-hover:scale-110">` : `<div class="h-full w-full flex items-center justify-center text-7xl">${c.emoji||'🏔️'}</div>`}
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="font-serif text-2xl font-bold">${c.name || 'Destination'}</h3>
          </div>
        </div>
        <div class="p-6">
          <p class="text-sm text-muted-foreground">${c.desc || ''}</p>
          <div class="mt-4 flex items-center justify-between">
            <a href="packages.html?state=${encodeURIComponent(c.name || '')}" class="btn-primary text-xs px-4 py-2" style="border-radius:0.375rem; width:100%; text-align:center;">See Packages</a>
          </div>
        </div>
      </article>
      `).join('');
    }
  }
}

// ============================================================
// ---- CRO FEATURES (Conversion Rate Optimization) -----------
// ============================================================

// 1. Floating WhatsApp Widget (all pages)
function initWhatsAppWidget() {
  if (document.getElementById('pk-wa-widget')) return; // already added
  const WA_NUM = '918377924630';
  const WA_MSG = encodeURIComponent('Hi Prebook Holidays! I\'d like to know more about your tour packages.');
  const widget = document.createElement('div');
  widget.id = 'pk-wa-widget';
  widget.innerHTML = `
    <a id="pk-wa-btn" href="https://wa.me/${WA_NUM}?text=${WA_MSG}" target="_blank" rel="noopener noreferrer"
       aria-label="Chat on WhatsApp"
       style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:99990;display:flex;align-items:center;gap:0.6rem;
              background:#25D366;color:white;padding:0.75rem 1.25rem;border-radius:9999px;
              font-weight:700;font-size:0.9rem;box-shadow:0 4px 24px rgba(37,211,102,0.45);
              text-decoration:none;transition:transform 0.25s,box-shadow 0.25s;letter-spacing:0.01em;">
      <svg style="width:22px;height:22px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.124 1.527 5.855L0 24l6.334-1.507A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.95 0-3.77-.525-5.332-1.437l-.38-.226-3.942.938.996-3.825-.247-.394A9.808 9.808 0 0 1 2.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
      </svg>
      <span class="hide-mobile">Chat on WhatsApp</span>
    </a>
    <!-- Pulsing dot -->
    <span style="position:fixed;bottom:2.95rem;right:1.5rem;z-index:99991;
                 width:12px;height:12px;background:#ff3b3b;border:2px solid white;
                 border-radius:50%;animation:pk-pulse 1.5s infinite;pointer-events:none;"></span>
  `;
  document.body.appendChild(widget);
  // hover effect
  const btn = document.getElementById('pk-wa-btn');
  btn.addEventListener('mouseenter', () => { btn.style.transform='scale(1.07)'; btn.style.boxShadow='0 8px 32px rgba(37,211,102,0.55)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform='scale(1)'; btn.style.boxShadow='0 4px 24px rgba(37,211,102,0.45)'; });
}

// 2. Sticky "Call Us" top micro-bar (one-tap call)
function initCallBar() {
  if (document.getElementById('pk-call-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'pk-call-bar';
  bar.innerHTML = `
    <div style="background:var(--primary);color:#fff;text-align:center;padding:0.4rem 1rem;
                font-size:0.78rem;font-weight:600;letter-spacing:0.02em;z-index:9999;
                display:flex;align-items:center;justify-content:center;gap:1.2rem;flex-wrap:wrap;">
      <span>📞 
        <a href="tel:+918377924630" style="color:#fbbf24;text-decoration:none;font-weight:700;">+91 83779-24630</a>
        &nbsp;|&nbsp;
        <a href="tel:+919899105056" style="color:#fbbf24;text-decoration:none;font-weight:700;">+91 98991-05056</a>
      </span>
      <span style="opacity:0.7;">|</span>
      <span>✅ 24/7 On-Ground Support &amp; Free Itinerary Planning</span>
      <a href="https://wa.me/918377924630?text=Hi!%20I%20need%20a%20Kashmir%20tour%20quote."
         target="_blank" style="background:#25D366;color:white;padding:0.2rem 0.75rem;border-radius:9999px;
                                 font-size:0.75rem;font-weight:700;text-decoration:none;white-space:nowrap;">
        Get Free Quote →
      </a>
    </div>
  `;
  // Insert before the body's first child
  document.body.insertBefore(bar, document.body.firstChild);
}

// 3. "Get Best Price" quick popup (3 fields only)
function initGetPricePopup() {
  if (document.getElementById('get-price-popup')) return;
  const popup = document.createElement('div');
  popup.id = 'get-price-popup';
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-box" style="max-width:420px;text-align:center;">
      <button class="popup-close" data-popup-close="get-price-popup" onclick="closePopup('get-price-popup')">✕</button>
      <div style="font-size:2.5rem;margin-bottom:0.5rem;">🏔️</div>
      <h2 class="font-serif" style="font-size:1.6rem;font-weight:700;color:var(--primary);margin-bottom:0.25rem;">Get Best Price</h2>
      <p style="color:var(--muted-fg);font-size:0.9rem;margin-bottom:1.5rem;">Share your details — we'll call you within 30 minutes with the best deal!</p>
      <form id="get-price-form" style="display:flex;flex-direction:column;gap:0.9rem;">
        <input name="name" type="text" placeholder="Your Name" required
               style="width:100%;border:1.5px solid var(--border);border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.95rem;outline:none;box-sizing:border-box;">
        <input name="phone" type="tel" placeholder="WhatsApp Number" required
               style="width:100%;border:1.5px solid var(--border);border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.95rem;outline:none;box-sizing:border-box;">
        <input name="date" type="date" placeholder="Travel Date"
               style="width:100%;border:1.5px solid var(--border);border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.95rem;outline:none;box-sizing:border-box;color:var(--muted-fg);">
        <button type="submit" style="background:linear-gradient(135deg,hsl(38,96%,54%),hsl(25,96%,50%));color:#111;
                font-weight:700;padding:0.9rem 2rem;border-radius:9999px;border:none;cursor:pointer;
                font-size:1rem;box-shadow:0 4px 20px rgba(251,146,60,0.4);transition:transform 0.2s;">
          📲 Get My Best Price
        </button>
      </form>
      <p style="font-size:0.75rem;color:var(--muted-fg);margin-top:1rem;">🔒 No spam. We respect your privacy.</p>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('get-price-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await PK.saveEnquiry({ type: 'GetBestPrice', name: data.name, phone: data.phone, date: data.date, email: '', message: 'Get Best Price request' });
    const msg = `Hi Prebook Holidays! 🙏\nName: ${data.name}\nPhone: ${data.phone}\nDate: ${data.date || 'Flexible'}\nPlease share best price!`;
    window.open(`https://wa.me/918377924630?text=${encodeURIComponent(msg)}`, '_blank');
    closePopup('get-price-popup');
    e.target.reset();
    showToast('✅ Request sent! We\'ll call you shortly.');
  });
}

// 4. "Recent Travelers" social proof section (inject on homepage)
function initRecentTravelers() {
  if (!window.location.pathname.match(/(index\.html|^\/$|^\/[^.]*$)/)) return;
  if (document.getElementById('recent-travelers-section')) return;
  
  const travelers = [
    { name: 'Priya & Raj', city: 'Mumbai', pkg: '7 Days Kashmir', ago: '3 days ago', rating: 5, avatar: '👩' },
    { name: 'Sharma Family', city: 'Delhi', pkg: '5 Days Honeymoon', ago: '1 week ago', rating: 5, avatar: '👨‍👩‍👧' },
    { name: 'Vikram S.', city: 'Pune', pkg: '4 Days Short Trip', ago: '2 weeks ago', rating: 5, avatar: '🧔' },
    { name: 'Meena R.', city: 'Bangalore', pkg: '6 Days Group Tour', ago: '3 weeks ago', rating: 5, avatar: '👩‍🦱' },
  ];
  
  const section = document.createElement('section');
  section.id = 'recent-travelers-section';
  section.style.cssText = 'background:#f0fdf4;padding:3rem 1.5rem;border-top:1px solid #d1fae5;';
  section.innerHTML = `
    <div class="pk-container">
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="display:inline-flex;align-items:center;gap:0.5rem;background:#dcfce7;border:1px solid #86efac;
                    padding:0.35rem 1rem;border-radius:9999px;margin-bottom:0.75rem;">
          <span style="width:8px;height:8px;background:#22c55e;border-radius:50%;display:inline-block;animation:pk-pulse 1.5s infinite;"></span>
          <span style="font-size:0.78rem;font-weight:700;color:#15803d;letter-spacing:0.05em;text-transform:uppercase;">Live Updates</span>
        </div>
        <h2 class="font-serif" style="font-size:1.8rem;font-weight:700;color:var(--primary);margin:0;">People Currently Traveling With Us</h2>
        <p style="color:var(--muted-fg);font-size:0.9rem;margin-top:0.5rem;">Join 10,000+ happy travelers who trusted Prebook Holidays</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:2rem;">
        ${travelers.map(t => `
        <div style="background:white;border:1px solid #d1fae5;border-radius:1rem;padding:1.25rem;
                    box-shadow:0 2px 12px rgba(0,0,0,0.06);display:flex;align-items:center;gap:0.85rem;">
          <div style="font-size:2rem;min-width:2.5rem;">${t.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--foreground);">${t.name} <span style="font-size:0.75rem;color:var(--muted-fg);font-weight:400;">• ${t.city}</span></div>
            <div style="font-size:0.78rem;color:var(--primary);font-weight:600;margin-top:0.15rem;">${t.pkg}</div>
            <div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem;">
              <span style="color:#fbbf24;font-size:0.7rem;">${'★'.repeat(t.rating)}</span>
              <span style="font-size:0.7rem;color:#16a34a;">✓ Verified · ${t.ago}</span>
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div style="text-align:center;display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem;align-items:center;">
        <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;font-weight:600;color:var(--primary);">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/25px-Camponotus_flavomarginatus_ant.jpg" 
               style="width:20px;height:20px;border-radius:50%;display:none;" alt="">
          ⭐ 4.9/5 on Google (820+ Reviews)
        </div>
        <div style="width:1px;height:20px;background:var(--border);"></div>
        <div style="font-size:0.85rem;font-weight:600;color:var(--primary);">🏅 TripAdvisor Certificate of Excellence</div>
        <div style="width:1px;height:20px;background:var(--border);"></div>
        <div style="font-size:0.85rem;font-weight:600;color:var(--primary);">🛡️ IATA Accredited Agency</div>
        <div style="width:1px;height:20px;background:var(--border);"></div>
        <div style="font-size:0.85rem;font-weight:600;color:#15803d;">✅ 24/7 On-Ground Support in Himachal & Kashmir</div>
      </div>
    </div>
  `;

  // Inject after the packages section on homepage
  const packagesSec = document.getElementById('packages') || document.querySelector('#packages');
  if (packagesSec && packagesSec.nextSibling) {
    packagesSec.parentNode.insertBefore(section, packagesSec.nextSibling);
  } else {
    const main = document.querySelector('main') || document.body;
    main.appendChild(section);
  }
}

// 5. Add "Get Best Price" buttons to all package cards
function addGetBestPriceButtons() {
  // Wire all [data-get-price] elements
  document.querySelectorAll('[data-get-price]').forEach(btn => {
    btn.addEventListener('click', () => openPopup('get-price-popup'));
  });
}

// 6. Inject keyframe animation for pulse effect
function injectCROStyles() {
  if (document.getElementById('pk-cro-styles')) return;
  const style = document.createElement('style');
  style.id = 'pk-cro-styles';
  style.textContent = `
    @keyframes pk-pulse {
      0%,100% { box-shadow:0 0 0 0 rgba(34,197,94,0.5); }
      50%      { box-shadow:0 0 0 8px rgba(34,197,94,0); }
    }
    #pk-wa-btn:focus { outline: 3px solid #25D366; outline-offset: 3px; }
    #pk-call-bar a:hover { text-decoration: underline; }
    #get-price-popup .popup-box input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(22,101,52,0.12); }
    #get-price-popup button[type=submit]:hover { transform: scale(1.04); }
    .pk-trust-bar { animation: fadeInDown 0.5s ease; }
    @keyframes fadeInDown { from { opacity:0;transform:translateY(-100%) } to { opacity:1;transform:translateY(0) } }
  `;
  document.head.appendChild(style);
}

function initCRO() {
  injectCROStyles();
  initWhatsAppWidget();
  // initCallBar(); // Removed as it shifts the hero image down
  initGetPricePopup();
  initRecentTravelers();
  addGetBestPriceButtons();
}

// ---- Init all on DOMContentLoaded -------------------
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPopups();
  initCallbackForm();
  initEnquiryForms();
  initExitIntent();
  initPriceCalculator();
  applySettings();
  renderIndexPackages();
  initCRO();
});
