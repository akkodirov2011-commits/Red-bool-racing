/* ============================================================
   RED BULL ENERGY — asosiy mantiq (helpers + logic + events)
   ============================================================ */

/* ---------- helpers ---------- */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + ' so\'m';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Fallback agar rasm topilmasa */
function fallback(el, name){
  const ch = esc((name || '?').trim()[0].toUpperCase());
  el.onerror = null;
  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#001489"/><stop offset="1" stop-color="#DB0A40"/></linearGradient></defs>
      <rect width="200" height="200" rx="24" fill="url(%23g)"/>
      <text x="100" y="128" font-family="Arial,sans-serif" font-size="86" font-weight="bold"
        fill="rgba(255,255,255,.92)" text-anchor="middle">${ch}</text>
    </svg>`);
  el.style.opacity = '.9';
}

function toast(text, emoji = '⚡'){
  const d = document.createElement('div');
  d.className = 'toast';
  d.innerHTML = `<span style="font-size:19px">${emoji}</span><span>${esc(text)}</span>`;
  $('#toasts').appendChild(d);
  setTimeout(() => { d.style.opacity = '0'; d.style.transform = 'translateY(12px)'; d.style.transition = '.3s'; }, 2200);
  setTimeout(() => d.remove(), 2600);
}

/* ---------- state ---------- */
const cart = new Map();
let filterCat = 'all', query = '', sortBy = 'pop';

/* ---------- CATS localised ---------- */
function getCats() {
  return [
    { id:'all',     name: t('cat_all')     },
    { id:'drinks',  name: t('cat_drinks')  },
    { id:'apparel', name: t('cat_apparel') },
    { id:'gear',    name: t('cat_gear')    },
    { id:'collect', name: t('cat_collect') },
  ];
}

/* ---------- marquee ---------- */
function renderMarquee(){
  const items = [...MARQUEE, ...MARQUEE];
  $('#mqTrack').innerHTML = items.map(x => `<span class="mq-item">${esc(x)}</span>`).join('');
}

/* ---------- chips ---------- */
function renderChips(){
  const cats = getCats();
  $('#chips').innerHTML = cats.map(c => {
    const n = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c.id).length;
    return `<button class="chip ${filterCat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name}<span class="c">${n}</span></button>`;
  }).join('');
}

/* ---------- product grid ---------- */
function visible(){
  const q = query.trim().toLowerCase();
  const catName = id => { const c = getCats().find(x => x.id === id); return c ? c.name : ''; };
  let list = PRODUCTS.filter(p =>
    (filterCat === 'all' || p.cat === filterCat) &&
    (!q || p.name.toLowerCase().includes(q) || catName(p.cat).toLowerCase().includes(q))
  );
  if (sortBy === 'asc')  list = [...list].sort((a,b) => a.price - b.price);
  if (sortBy === 'desc') list = [...list].sort((a,b) => b.price - a.price);
  if (sortBy === 'az')   list = [...list].sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

function cardHTML(p){
  const tagTxt = { hit: t('tag_hit'), new: t('tag_new'), lim: t('tag_lim') }[p.tag];
  const catLabel = getCats().find(c => c.id === p.cat)?.name || '';
  return `<article class="card" data-id="${p.id}">
    <div class="card-img">
      ${p.tag ? `<span class="tag ${p.tag}">${tagTxt}</span>` : ''}
      <img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" decoding="async"
           onerror="fallback(this,'${esc(p.name).replace(/'/g,"&#39;")}')">
      <button class="quick" data-quick="${p.id}" aria-label="${esc(p.name)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>
      </button>
    </div>
    <div class="card-b">
      <div class="card-cat">${catLabel}${p.vol ? ' · ' + p.vol : ''}</div>
      <h3 class="card-n">${esc(p.name)}</h3>
      <div class="card-f">
        <span class="price">${money(p.price)}</span>
        <button class="add" data-add="${p.id}" aria-label="${t('co_add_cart')}: ${esc(p.name)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function renderGrid(){
  const list = visible();
  $('#countLine').textContent = list.length
    ? `${t('shop_shown')}: ${list.length} ${t('shop_of')} ${PRODUCTS.length}`
    : '';
  $('#grid').innerHTML = list.length
    ? list.map(cardHTML).join('')
    : `<div class="empty"><div class="e">🔍</div>
        <h3 class="md" style="margin-bottom:8px">${t('shop_empty_h')}</h3>
        <p>${t('shop_empty_p')}</p>
        <button class="btn btn-ghost" style="margin-top:18px" id="resetF">${t('shop_reset')}</button></div>`;
}

/* ---------- cart ---------- */
const byId = id => PRODUCTS.find(p => p.id === id);
const cartQty = () => [...cart.values()].reduce((a, b) => a + b, 0);
const cartSum = () => [...cart.entries()].reduce((a, [id, q]) => a + byId(id).price * q, 0);

function renderCart(){
  const n = cartQty(), sub = cartSum();
  const badge = $('#cartBadge');
  badge.textContent = n;
  badge.classList.toggle('on', n > 0);
  $('#cartCount').textContent = n;

  if (!n){
    $('#cartBody').innerHTML = `<div class="cart-empty"><div class="e">🛒</div>
      <h3 class="md" style="margin-bottom:8px">${t('cart_empty_h')}</h3>
      <p style="font-size:14.5px">${t('cart_empty_p')}</p>
      <button class="btn btn-red" style="margin-top:20px" id="goShop">${t('cart_go_shop')}</button></div>`;
    $('#cartFoot').style.display = 'none';
    return;
  }

  $('#cartBody').innerHTML = [...cart.entries()].map(([id, q]) => {
    const p = byId(id);
    return `<div class="ci">
      <div class="ci-img"><img src="${esc(p.img)}" alt="" loading="lazy"
        onerror="fallback(this,'${esc(p.name).replace(/'/g,"&#39;")}')"></div>
      <div style="flex:1;min-width:0">
        <div class="ci-n">${esc(p.name)}</div>
        <div class="ci-p">${money(p.price * q)}</div>
        <div class="qty">
          <button data-dec="${id}" aria-label="−">−</button>
          <span>${q}</span>
          <button data-inc="${id}" aria-label="+">+</button>
        </div>
      </div>
      <button class="ci-x" data-del="${id}" aria-label="×">×</button>
    </div>`;
  }).join('');

  const ship = sub >= FREE_FROM ? 0 : SHIP_COST;
  $('#subTot').textContent = money(sub);
  $('#ship').textContent = ship ? money(ship) : t('cart_free');
  $('#ship').style.color = ship ? '' : 'var(--ok)';
  $('#grandTot').textContent = money(sub + ship);
  $('#cartFoot').style.display = '';

  /* statik matnlarni ham yangilash */
  const foot = $('#cartFoot');
  if (foot) {
    const spans = foot.querySelectorAll('[data-i18n]');
    spans.forEach(el => { el.textContent = t(el.dataset.i18n); });
  }
}

function addToCart(id, silent){
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  if (!silent) toast(byId(id).name + ' ' + t('toast_in_cart'), '🛒');
}
const openCart  = () => { $('#cart').classList.add('on'); $('#scrim').classList.add('on'); document.body.style.overflow = 'hidden'; };
const closeCart = () => { $('#cart').classList.remove('on'); $('#scrim').classList.remove('on'); document.body.style.overflow = ''; };

/* ---------- modal ---------- */
const openModal = html => { $('#modal').innerHTML = html; $('#modalWrap').classList.add('on'); document.body.style.overflow = 'hidden'; };
const closeModal = () => { $('#modalWrap').classList.remove('on'); if (!$('#cart').classList.contains('on')) document.body.style.overflow = ''; };

function quickView(id){
  const p = byId(id);
  const catLabel = getCats().find(c => c.id === p.cat)?.name || '';
  openModal(`
    <button class="modal-x" data-close aria-label="${t('nav_close')}">✕</button>
    <div class="qv">
      <div class="qv-img"><img src="${esc(p.img)}" alt="${esc(p.name)}"
        onerror="fallback(this,'${esc(p.name).replace(/'/g,"&#39;")}')"></div>
      <div class="qv-b">
        <div class="card-cat">${catLabel}${p.vol ? ' · ' + p.vol : ''}</div>
        <h3>${esc(p.name)}</h3>
        <div class="price">${money(p.price)}</div>
        <ul class="qv-feat">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg>${t('co_orig')}</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg>${t('co_days')} ${money(FREE_FROM)}</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg>${t('co_return')}</li>
        </ul>
        <button class="btn btn-red btn-block btn-lg" data-add="${p.id}">${t('qv_add')}</button>
      </div>
    </div>`);
}

/* ---------- Telegram Bot Integration ---------- */
const TG_BOT_TOKEN = '9022150381:AAHpHCxrBvLlzXJi_pr0D6RC-_n5SgJjQVM';
const TG_CHAT_ID = '6068394642';

async function sendOrderToTelegram(order) {
  const itemsText = order.items.map(it => `• <b>${esc(it.name)}</b> — ${it.qty} dona × ${money(it.price)} = <b>${money(it.sum)}</b>`).join('\n');
  const shipText = order.shipCost === 0 ? 'Bepul' : money(order.shipCost);
  const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  const message =
    `🛒 <b>YANGI BUYURTMA #${order.num}</b>\n\n` +
    `👤 <b>Mijoz:</b> ${esc(order.name)}\n` +
    `📞 <b>Telefon:</b> ${esc(order.phone)}\n` +
    `📧 <b>Email:</b> ${esc(order.email)}\n` +
    `📍 <b>Manzil:</b> ${esc(order.addr)}\n\n` +
    `🛍 <b>Buyurtma tarkibi:</b>\n${itemsText}\n\n` +
    `📦 <b>Yetkazib berish:</b> ${shipText}\n` +
    `💰 <b>JAMI TO'LOV:</b> <b>${money(order.total)}</b>\n` +
    `🕒 <b>Vaqt:</b> ${now}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const resData = await res.json();
    if (!resData.ok) {
      console.warn('Telegram API javobi:', resData);
    }
  } catch (err) {
    console.error('Telegramga xabar yuborishda xatolik:', err);
  }
}

function checkout(){
  const sub = cartSum(), ship = sub >= FREE_FROM ? 0 : SHIP_COST;
  openModal(`
    <button class="modal-x" data-close aria-label="${t('nav_close')}">✕</button>
    <div class="co-body">
      <h3>${t('co_title')}</h3>
      <p class="sub">${cartQty()} ${t('co_items')} <b style="color:var(--rb-gold)">${money(sub + ship)}</b></p>
      <form id="coForm" novalidate>
        <div class="f2">
          <div class="fld"><label>${t('co_name_lbl')}</label><input name="name" placeholder="${t('co_name_ph')}"><div class="msg">${t('co_name_err')}</div></div>
          <div class="fld"><label>${t('co_phone_lbl')}</label><input name="phone" placeholder="${t('co_phone_ph')}"><div class="msg">${t('co_phone_err')}</div></div>
        </div>
        <div class="fld"><label>${t('co_email_lbl')}</label><input name="email" type="email" placeholder="you@email.com"><div class="msg">${t('co_email_err')}</div></div>
        <div class="fld"><label>${t('co_addr_lbl')}</label><input name="addr" placeholder="${t('co_addr_ph')}"><div class="msg">${t('co_addr_err')}</div></div>
        <button type="submit" class="btn btn-red btn-block btn-lg" style="margin-top:8px">${t('co_confirm')} ${money(sub + ship)}</button>
        <p style="text-align:center;font-size:12.5px;color:var(--muted);margin-top:12px">${t('co_demo')}</p>
      </form>
    </div>`);

  $('#coForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, ok = { name: v => v.trim().length > 1, phone: v => v.replace(/\D/g,'').length >= 9,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), addr: v => v.trim().length > 4 };
    let valid = true;
    ['name','phone','email','addr'].forEach(k => {
      const el = f.elements[k], bad = !ok[k](el.value);
      el.closest('.fld').classList.toggle('err', bad);
      if (bad) valid = false;
    });
    if (!valid){ f.querySelector('.fld.err input').focus(); return; }

    const num = 'RB-' + String(100000 + Math.floor(Math.random() * 899999));

    // Telegram botga buyurtma ma'lumotlarini yuborish
    const orderItems = [...cart.entries()].map(([id, q]) => {
      const p = byId(id);
      return { name: p.name, qty: q, price: p.price, sum: p.price * q };
    });

    sendOrderToTelegram({
      num: num,
      name: f.elements['name'].value.trim(),
      phone: f.elements['phone'].value.trim(),
      email: f.elements['email'].value.trim(),
      addr: f.elements['addr'].value.trim(),
      items: orderItems,
      subTotal: sub,
      shipCost: ship,
      total: sub + ship
    });

    openModal(`<div class="done-box">
      <div class="done-ico">✓</div>
      <h3 class="md" style="margin-bottom:10px">${t('co_done_h')}</h3>
      <p style="color:var(--text-2)">${currentLang === 'uz' ? 'Buyurtma raqami' : 'Номер заказа'} <b style="color:var(--rb-gold);font-family:var(--f-display);font-size:22px">${num}</b><br>
      ${t('co_done_p')}</p>
      <button class="btn btn-red" style="margin-top:24px" data-close>${t('co_done_btn')}</button>
    </div>`);
    cart.clear(); renderCart(); closeCart();
  });
  $('#coForm').querySelectorAll('input').forEach(i =>
    i.addEventListener('input', () => i.closest('.fld').classList.remove('err')));
}

/* ---------- delegated events ---------- */
document.addEventListener('click', e => {
  const tgt = e.target;

  /* language switcher */
  const lb = tgt.closest('.lang-btn');
  if (lb && lb.dataset.lang){ setLang(lb.dataset.lang); return; }

  const chip = tgt.closest('[data-cat]');
  if (chip){ filterCat = chip.dataset.cat; renderChips(); renderGrid(); return; }

  const add = tgt.closest('[data-add]');
  if (add){
    addToCart(add.dataset.add);
    if (add.classList.contains('add')){
      add.classList.add('done');
      add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg>';
      setTimeout(() => { add.classList.remove('done');
        add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'; }, 1100);
    } else { closeModal(); openCart(); }
    return;
  }

  const qk = tgt.closest('[data-quick]');       if (qk){ quickView(qk.dataset.quick); return; }
  const inc = tgt.closest('[data-inc]');        if (inc){ addToCart(inc.dataset.inc, true); return; }
  const dec = tgt.closest('[data-dec]');
  if (dec){ const id = dec.dataset.dec, q = cart.get(id) - 1; q > 0 ? cart.set(id, q) : cart.delete(id); renderCart(); return; }
  const del = tgt.closest('[data-del]');        if (del){ cart.delete(del.dataset.del); renderCart(); return; }

  if (tgt.closest('#cartBtn') || tgt.closest('#drawerCart')){ $('#drawer').classList.remove('on'); openCart(); return; }
  if (tgt.closest('#cartX') || tgt.closest('#scrim')){ closeCart(); return; }
  if (tgt.closest('#clearBtn')){ cart.clear(); renderCart(); toast(t('toast_cleared'), '🧹'); return; }
  if (tgt.closest('#checkoutBtn')){ checkout(); return; }
  if (tgt.closest('#goShop')){ closeCart(); $('#shop').scrollIntoView(); return; }
  if (tgt.closest('[data-close]') || tgt === $('#modalWrap')){ closeModal(); return; }
  if (tgt.closest('#resetF')){ filterCat = 'all'; query = ''; $('#q').value = ''; renderChips(); renderGrid(); return; }

  const jump = tgt.closest('[data-jump]');
  if (jump){ filterCat = jump.dataset.jump; renderChips(); renderGrid(); return; }

  if (tgt.closest('#burger')){ $('#drawer').classList.add('on'); return; }
  if (tgt.closest('#drawerX') || tgt.closest('.drawer-menu a')){ $('#drawer').classList.remove('on'); return; }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ closeModal(); closeCart(); $('#drawer').classList.remove('on'); }
  if (e.key === '/' && document.activeElement !== $('#q')){ e.preventDefault(); $('#q').focus(); }
});

$('#q').addEventListener('input', e => { query = e.target.value; renderGrid(); });
$('#sort').addEventListener('change', e => { sortBy = e.target.value; renderGrid(); });

/* ---------- theme ---------- */
const root = document.documentElement;
$('#themeBtn').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  $('#icoMoon').style.display = next === 'dark' ? '' : 'none';
  $('#icoSun').style.display  = next === 'dark' ? 'none' : '';
  document.querySelector('meta[name=theme-color]').setAttribute('content', next === 'dark' ? '#04060E' : '#F4F6FC');
});

/* ---------- newsletter ---------- */
$('#nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#nlEmail').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
    $('#nlNote').textContent = t('nl_err');
    $('#nlNote').style.color = 'var(--bad)';
    $('#nlEmail').focus();
    return;
  }
  $('#nlForm').style.display = 'none';
  $('#nlNote').style.display = 'none';
  $('#nlOk').classList.add('on');
});

/* ---------- scroll: progress, sticky nav, active link ---------- */
const nav = $('#nav'), prog = $('#prog');
const sections = ['home','history','shop','f1'].map(id => document.getElementById(id));
function onScroll(){
  const y = window.scrollY;
  nav.classList.toggle('stuck', y > 20);
  $('#navShop').style.display = y > window.innerHeight * .8 ? '' : 'none';
  const h = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  let cur = 'home';
  sections.forEach(s => { if (s && s.getBoundingClientRect().top <= 120) cur = s.id; });
  $$('#navLinks a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}
addEventListener('scroll', onScroll, { passive:true });

/* ---------- reveal + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    io.unobserve(en.target);
  });
}, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
$$('.rv').forEach(el => io.observe(el));

const io2 = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.to, sfx = el.dataset.suffix || '';
    const dur = 1400, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (p === 1 ? sfx : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    io2.unobserve(el);
  });
}, { threshold:.5 });
$$('[data-to]').forEach(el => io2.observe(el));

/* ---------- boot ---------- */
/* Avval i18n ni ishga tushiramiz */
setLang(currentLang);
renderMarquee();
renderChips();
renderGrid();
renderCart();
onScroll();
