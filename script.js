/* ===== Настройки сайта — всё, что ещё не решено, меняется здесь ===== */
const CONFIG = {
  telegram: 'https://t.me/vnecamer',
  channel: 'https://t.me/granitweb',   // кнопка «Канал» внизу
  phone: '',        // +79991234567
  email: '',        // name@example.ru
};

/* ===== Цены — единственное место. ЧЕРНОВИК: числа предложены для примера, подтвердить перед выкладкой =====
   price — рубли, days — [от, до] рабочих дней, includes — что уже входит в тип сайта (не суммируется),
   monthly — оплата в месяц (отдельной строкой), instead — вариант, который эта услуга заменяет.
   Пакеты считаются по составу той же формулой, что и калькулятор; чтобы задать цену пакета вручную, добавьте price: 90000. */
const PRICING = {
  types: [
    { id: 'landing', name: 'Лендинг', price: 25000, days: [7, 10], includes: ['leads'] },
    { id: 'card', name: 'Визитка', price: 20000, days: [5, 8] },
    { id: 'corporate', name: 'Корпоративный сайт', price: 50000, days: [14, 20], includes: ['leads'] },
    { id: 'catalog', name: 'Каталог', price: 65000, days: [15, 22], includes: ['leads', 'admin'] },
    { id: 'shop', name: 'Интернет-магазин', price: 110000, days: [25, 35], includes: ['leads', 'admin'] },
    { id: 'custom', name: 'Индивидуальный проект', price: 85000, days: [20, 30], includes: ['leads'] },
  ],
  features: [
    { id: 'admin', name: 'Админ-панель', note: 'Тексты, цены и фото меняете сами', price: 15000, days: [3, 5] },
    { id: 'bot', name: 'Telegram-бот', note: 'Заявки, запись, ответы на вопросы', price: 20000, days: [4, 6] },
    { id: 'api', name: 'Интеграции', note: 'CRM и сторонние сервисы', price: 15000, days: [3, 6] },
    { id: 'leads', name: 'Онлайн-заявки', note: 'Форма на сайте, уведомления в Telegram', price: 5000, days: [1, 1] },
    { id: 'booking', name: 'Бронирование', note: 'Выбор даты и времени', price: 20000, days: [4, 7] },
  ],
  services: [
    { id: 'seo', name: 'Базовое SEO', note: 'Структура, заголовки, метатеги', price: 15000, days: [2, 4], instead: 'seoPlus' },
    { id: 'seoPlus', name: 'Расширенное SEO', note: 'Семантика, тексты, отчёт о работе', price: 35000, days: [5, 8], instead: 'seo' },
    { id: 'copy', name: 'Копирайтинг', note: 'Тексты для страниц, товаров, статей', price: 8000, days: [2, 4] },
    { id: 'support', name: 'Техническая поддержка', note: 'Правки и обслуживание', price: 5000, monthly: true },
  ],
  plans: {
    start: { name: 'START', type: 'landing', options: [] },
    business: { name: 'BUSINESS', type: 'catalog', options: ['seo'] },
    pro: { name: 'PRO', type: 'custom', options: ['admin', 'bot', 'api', 'seoPlus'] },
  },
};

/* Отзывы — только настоящие, с согласия автора. Новые — сверху.
   { name: 'Имя', role: 'Кто или компания', work: 'Лендинг', rating: 5 или null, date: 'Октябрь 2026', text: 'Текст отзыва' } */
const REVIEWS = [];

/* Вымышлены — показываются, пока REVIEWS пуст, вместе со строкой reviewsNote под заголовком; с первым настоящим исчезают все */
const DEMO_REVIEWS = [
  { name: 'Алексей М.', role: 'Автосервис', work: 'Лендинг', rating: 5, text: 'Нужна была простая страница с услугами и заявками. Сначала согласовали структуру, потом дизайн. Заявки теперь приходят в Telegram, ничего не теряется.' },
  { name: 'Марина К.', role: 'Студия маникюра', work: 'Чат-бот', rating: 5, text: 'Бот записывает клиентов и отвечает на частые вопросы, а я больше не сижу в переписке вечером. Пару раз просила поправить тексты — сделали без споров.' },
  { name: 'Игорь В.', role: 'Магазин запчастей', work: 'Сайт с каталогом', rating: 5, text: 'Цены и фото меняю сам через админку, разобрался за вечер. Понравилось, что промежуточный результат всё время был по ссылке и правки видно сразу.' },
  { name: 'Ольга С.', role: 'Кондитерская', work: 'Сайт-визитка', rating: 4, text: 'Сайт аккуратно смотрится на телефоне, всё понятно с первого экрана. Немного задержались с фото с моей стороны, но в остальном шли по плану.' },
  { name: 'Денис Р.', role: 'Грузоперевозки', work: 'SEO', rating: 5, text: 'Начали с проверки сайта: исправили ошибки, переписали заголовки, подключили Вебмастер. Каждый месяц получаю понятный отчёт, что сделано.' },
];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function applyConfig() {
  document.querySelectorAll('[data-contact]').forEach((el) => {
    const kind = el.dataset.contact;
    const value = CONFIG[kind];
    if (kind === 'phone' || kind === 'email') {
      if (!value) return;
      el.href = (kind === 'phone' ? 'tel:' : 'mailto:') + value;
      el.textContent = value;
      el.hidden = false;
      return;
    }
    if (value) el.href = value;
    else {
      el.classList.add('is-todo');
      el.removeAttribute('target');
      el.title = 'Ссылка не указана (CONFIG в script.js)';
    }
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function reviewHtml(r, i, total) {
  const name = (r.name || '').trim() || 'Клиент';
  const n = Math.max(0, Math.min(5, Math.round(Number(r.rating)) || 0));
  const stars = n ? `<span aria-hidden="true">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>` : '';
  const when = escapeHtml(r.date || '');
  return `
    <figure class="rv" role="group" aria-label="Отзыв ${i + 1} из ${total}">
      <p class="rv-head">Проект <b>${escapeHtml(r.work || 'Сайт')}</b></p>
      ${n ? `<p class="rv-stars" role="img" aria-label="Оценка ${n} из 5">${stars}</p>` : ''}
      <div class="rv-card">
        <div class="rv-who"><span class="rv-avatar" aria-hidden="true">${escapeHtml(Array.from(name)[0].toUpperCase())}</span><span><b>${escapeHtml(name)}</b><i>${escapeHtml(r.role || '')}</i></span></div>
        <p class="rv-meta">${n ? `<span class="rv-stars" aria-hidden="true">${stars}</span>` : ''}${when}</p>
        <blockquote>${escapeHtml(r.text)}</blockquote>
      </div>
    </figure>`;
}

function renderReviews() {
  const list = document.getElementById('reviewsList');
  if (!list) return;
  const items = REVIEWS.length ? REVIEWS : DEMO_REVIEWS;
  list.innerHTML = items.map((r, i) => reviewHtml(r, i, items.length)).join('');
  document.getElementById('reviewsNote').hidden = REVIEWS.length > 0;
  const nav = document.getElementById('reviewsNav');
  const dotsBox = document.getElementById('reviewsDots');
  dotsBox.innerHTML = items.map((r, i) => `<button class="rv-dot" type="button" aria-label="Отзыв ${i + 1}"></button>`).join('');
  const dots = [...dotsBox.children];
  const arrows = [...nav.querySelectorAll('[data-step]')];
  nav.hidden = items.length < 2;
  // начинаем со второго отзыва — с обеих сторон видны соседи
  const move = carousel(list, {
    first: items.length > 2 ? 1 : 0,
    onChange(i) {
      dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-current', String(k === i)); });
      arrows.forEach((b) => { b.disabled = !items[i + Number(b.dataset.step)]; });
    },
  });
  dots.forEach((d, i) => d.addEventListener('click', () => move.go(i)));
  arrows.forEach((b) => b.addEventListener('click', () => move.go(move.current() + Number(b.dataset.step))));
}

/* Лента карточек со свайпом: средняя — is-current, нажатие на соседнюю листает к ней (отзывы; пакеты на телефоне) */
function carousel(list, { first = 0, onChange = () => {}, enabled = () => true } = {}) {
  const cards = [...list.children];
  let current = -1;

  function paint(i) {
    if (i === current) return;
    current = i;
    cards.forEach((c, k) => c.classList.toggle('is-current', k === i));
    onChange(i);
  }
  // offsetLeft не зависит от scale соседних карточек
  const leftOf = (i) => cards[i].offsetLeft + cards[i].offsetWidth / 2 - list.clientWidth / 2;
  function go(i, instant) {
    if (!cards[i]) return;
    list.scrollTo(instant ? { left: leftOf(i), behavior: 'instant' } : { left: leftOf(i) });
  }
  function nearest() {
    let best = 0;
    cards.forEach((c, i) => { if (Math.abs(leftOf(i) - list.scrollLeft) < Math.abs(leftOf(best) - list.scrollLeft)) best = i; });
    paint(best);
  }
  let frame = 0;
  list.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(nearest); }, { passive: true });
  // capture: кнопка на соседней карточке сначала листает к ней, а не срабатывает
  list.addEventListener('click', (e) => {
    const i = cards.findIndex((c) => c.contains(e.target));
    if (!enabled() || i < 0 || i === current || String(getSelection())) return;
    e.preventDefault();
    e.stopPropagation();
    go(i);
  }, true);
  paint(first);
  go(first, true);
  // высота окна на телефоне меняется от клавиатуры и адресной строки — реагируем только на ширину
  let width = list.clientWidth;
  addEventListener('resize', () => { if (list.clientWidth === width) return; width = list.clientWidth; go(current, true); });
  return { go, current: () => current };
}

/* Отзыв с сайта: сервера нет, поэтому открываем чат в Telegram с готовым текстом — отправляет сам человек */
function initReviewForm() {
  const form = document.getElementById('reviewForm');
  const open = document.getElementById('reviewOpen');
  if (!form || !open) return;
  open.addEventListener('click', () => {
    form.hidden = !form.hidden;
    open.setAttribute('aria-expanded', String(!form.hidden));
    if (!form.hidden) form.elements.text.focus();
  });
  const stars = [...form.querySelectorAll('.rate-star')];
  form.addEventListener('change', () => {
    const value = Number(form.elements.rating.value) || 0;
    stars.forEach((s, i) => s.classList.toggle('is-on', i < value));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.rv-status');
    const text = form.elements.text.value.trim();
    if (text.length < 10) { status.textContent = 'Напишите хотя бы пару слов.'; form.elements.text.focus(); return; }
    const rating = Number(form.elements.rating.value) || 0;
    const name = form.elements.name.value.trim();
    const message = ['Отзыв для сайта GRANIT', rating ? `Оценка: ${rating} из 5` : '', name ? `Имя: ${name}` : '', '', text, '', 'Публикация имени и текста на сайте: согласие дано'].filter((s, i) => s || i > 2).join('\n');
    sendToTelegram(message, status, 'Открываем чат. Отзыв отправится, когда вы нажмёте там «Отправить».');
  });
}

/* ===== Расчёт стоимости: пакеты и калькулятор ===== */
const PHONE = matchMedia('(max-width: 767px)');
const OPTIONS = [...PRICING.features, ...PRICING.services];
const money = (n) => `${n.toLocaleString('ru-RU').replace(/\s/g, '\u00a0')}\u00a0₽`;
const moneyHtml = (n) => money(n).replace('₽', '<span class="cur">₽</span>');   // знак ₽ — шрифтом текста: у Unbounded ради него грузится файл 118 КБ
function daysText([a, b]) {
  const one = b % 10 === 1 && b % 100 !== 11;
  const few = b % 10 >= 2 && b % 10 <= 4 && (b % 100 < 12 || b % 100 > 14);
  return `${a === b ? a : `${a}–${b}`}\u00a0${one ? 'рабочий день' : few ? 'рабочих дня' : 'рабочих дней'}`;
}
const nb = (s) => escapeHtml(s).replace(/ (в|и|с|о|на|по|под|от) /g, ' $1\u00a0');   // предлоги не висят в конце строки
const findType = (id) => PRICING.types.find((t) => t.id === id) || PRICING.types[0];
const isIncluded = (type, id) => (type.includes || []).includes(id);

function estimate(typeId, ids) {
  const type = findType(typeId);
  const sum = { type, lines: [], total: type.price, days: [...type.days], monthly: 0 };
  OPTIONS.forEach((o) => {
    const included = isIncluded(type, o.id);
    if (!included && !ids.includes(o.id)) return;
    sum.lines.push({ option: o, included });
    if (included) return;
    if (o.monthly) { sum.monthly += o.price; return; }
    sum.total += o.price;
    sum.days[0] += o.days[0];
    sum.days[1] += o.days[1];
  });
  return sum;
}
function planEstimate(id) {
  const plan = PRICING.plans[id];
  const sum = estimate(plan.type, plan.options);
  if (plan.price) sum.total = plan.price;
  return sum;
}

function renderPlans() {
  document.querySelectorAll('[data-plan-price]').forEach((el) => {
    el.innerHTML = `<span class="from">от</span> ${moneyHtml(planEstimate(el.dataset.planPrice).total)}`;
  });
  document.querySelectorAll('[data-plan-days]').forEach((el) => { el.textContent = daysText(planEstimate(el.dataset.planDays).days); });
  document.querySelectorAll('[data-days]').forEach((el) => { el.textContent = daysText(findType(el.dataset.days).days); });   // сроки в FAQ
  // телефон: лента, начинаем с рекомендуемого пакета; шире — обычная сетка
  const list = document.getElementById('planList');
  if (!list) return;
  list.classList.add('is-carousel');
  carousel(list, { first: Math.max(0, [...list.children].findIndex((c) => c.classList.contains('is-main'))), enabled: () => PHONE.matches });
}

function initCalc() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const live = document.getElementById('calcLive');
  const lines = document.getElementById('calcLines');
  const chosen = new Set();   // выбор человека хранится отдельно от «входит»: сменили тип — он не теряется
  let typeId = PRICING.types[0].id;
  let shown = '';
  let timer = 0;

  document.getElementById('calcTypes').innerHTML = PRICING.types.map((t) => `
    <label class="type"><input type="radio" name="type" value="${t.id}"><span class="type-in"><b>${escapeHtml(t.name)}</b><i>от ${moneyHtml(t.price)}</i></span></label>`).join('');
  const optionHtml = (o) => `
    <label class="opt"><input type="checkbox" name="opt" value="${o.id}"><span class="opt-in"><span class="opt-text"><b>${escapeHtml(o.name)}</b><i>${nb(o.note || '')}</i></span><span class="opt-price"></span></span></label>`;
  document.getElementById('calcFeatures').innerHTML = PRICING.features.map(optionHtml).join('');
  document.getElementById('calcServices').innerHTML = PRICING.services.map(optionHtml).join('');
  form.hidden = false;

  function paint() {
    const sum = estimate(typeId, [...chosen]);
    form.querySelectorAll('[name="type"]').forEach((i) => { i.checked = i.value === typeId; });
    document.querySelectorAll('input[name="opt"]').forEach((i) => {
      const o = OPTIONS.find((x) => x.id === i.value);
      const included = isIncluded(sum.type, o.id);
      i.checked = included || chosen.has(o.id);
      i.disabled = included;
      i.parentElement.querySelector('.opt-price').innerHTML = included ? 'входит' : `+ ${moneyHtml(o.price)}${o.monthly ? ' / мес' : ''}`;
    });
    lines.innerHTML = `<li><span>${escapeHtml(sum.type.name)}</span><b>${moneyHtml(sum.type.price)}</b></li>` + sum.lines.map(({ option: o, included }) => `
      <li><span>${escapeHtml(o.name)}</span><b>${included ? 'входит' : moneyHtml(o.price) + (o.monthly ? ' / мес' : '')}</b></li>`).join('');
    const days = daysText(sum.days);
    document.querySelectorAll('[data-calc="total"]').forEach((el) => {
      el.innerHTML = `<span class="from">от</span> ${moneyHtml(sum.total)}`;
      // короткое проявление новой суммы; цифры не «бегут»
      if (shown && shown !== String(sum.total) && el.animate) el.animate([{ opacity: .25 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    });
    shown = String(sum.total);
    document.querySelectorAll('[data-calc="days"]').forEach((el) => { el.textContent = days; });
    const picked = (list) => sum.lines.filter((l) => list.includes(l.option)).map((l) => l.option.name).join(', ') || 'Не выбрано';
    document.querySelector('[data-picked="features"]').textContent = picked(PRICING.features);
    document.querySelector('[data-picked="extras"]').textContent = picked(PRICING.services);
    document.getElementById('calcMonthly').hidden = !sum.monthly;
    form.querySelector('[data-calc="monthly"]').innerHTML = sum.monthly ? `${moneyHtml(sum.monthly)} / мес` : '';
    clearTimeout(timer);
    timer = setTimeout(() => { live.textContent = `Предварительно от ${money(sum.total)}, ${days}`; }, 700);
  }
  function onChange(e) {
    const { name, value, checked } = e.target;
    if (name === 'type') typeId = value;
    if (name === 'opt') {
      if (checked) chosen.add(value); else chosen.delete(value);
      const o = OPTIONS.find((x) => x.id === value);
      if (checked && o.instead) chosen.delete(o.instead);
    }
    paint();
  }
  form.addEventListener('change', onChange);
  // телефон: списки функций и услуг лежат в окнах #features и #extras, шире — на странице
  const lists = [['features', document.getElementById('calcFeatures')], ['extras', document.getElementById('calcServices')]].map(([id, el]) => ({ el, win: document.getElementById(id), home: el.parentElement }));
  lists.forEach(({ win }) => win.addEventListener('change', onChange));
  function place() {
    const inWin = PHONE.matches && Boolean(lists[0].win.showModal);
    form.classList.toggle('is-windowed', inWin);
    lists.forEach(({ el, win, home }) => {
      if (!inWin && win.open) win.querySelector('.win-close').click();   // телефон повернули при открытом окне
      (inWin ? win.querySelector('.pick-slot') : home).append(el);
    });
  }
  if (PHONE.addEventListener) PHONE.addEventListener('change', place); else PHONE.addListener(place);   // iOS до 14
  place();
  form.addEventListener('submit', (e) => e.preventDefault());
  document.querySelectorAll('[data-preset]').forEach((a) => a.addEventListener('click', () => {
    const plan = PRICING.plans[a.dataset.preset];
    typeId = plan.type;
    chosen.clear();
    plan.options.forEach((id) => chosen.add(id));
    paint();
  }));
  initCalc.current = () => estimate(typeId, [...chosen]);
  paint();
  live.textContent = '';
  clearTimeout(timer);
}

/* ===== Заявка: пакет или расчёт + имя, Telegram, комментарий ===== */
function initOrder() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  const box = document.getElementById('orderSum');
  const lead = document.getElementById('orderLead');
  const status = form.querySelector('.rv-status');
  let rows = [];   // выбранное: [подпись, значение]

  function fromPlan(id) {
    const sum = planEstimate(id);
    return [['Пакет', PRICING.plans[id].name], ['Стоимость', `от ${money(sum.total)} (предварительно)`], ['Срок', daysText(sum.days)]];
  }
  function fromCalc() {
    const sum = initCalc.current();
    const names = (list) => sum.lines.filter((l) => list.includes(l.option)).map((l) => l.option.name + (l.included ? ' (входит)' : '')).join(', ');
    return [
      ['Тип сайта', sum.type.name],
      ['Функции', names(PRICING.features)],
      ['Услуги', names(PRICING.services)],
      ['Стоимость', `от ${money(sum.total)} (предварительно)`],
      ['Поддержка', sum.monthly ? `${money(sum.monthly)} в месяц` : ''],
      ['Срок', daysText(sum.days)],
    ].filter((r) => r[1]);
  }
  // ссылка сама меняет адрес на #order, окно откроет initWindows — здесь только запоминаем выбор
  document.querySelectorAll('[data-order]').forEach((a) => a.addEventListener('click', () => {
    const id = a.dataset.order;
    rows = id === 'calc' ? fromCalc() : fromPlan(id);
    box.innerHTML = rows.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('');
    box.hidden = false;
    lead.textContent = id === 'calc' ? 'Проверьте расчёт и оставьте контакт — уточним детали и назовём точную стоимость.' : 'Пакет выбран. Оставьте контакт — обсудим задачу и назовём точную стоимость.';
    status.textContent = '';
  }));

  const tg = form.elements.tg;
  const cleanTg = () => tg.value.trim().replace(/^(https?:\/\/)?(t\.me|telegram\.me)\//i, '').replace(/^@/, '');
  function checkTg() {
    const v = cleanTg();
    const ok = !v || /^[a-z]\w{4,31}$/i.test(v) || /^\+?[\d\s()-]{10,20}$/.test(v);
    tg.setCustomValidity(ok ? '' : 'Укажите @username (от 5 латинских букв и цифр) или номер телефона');
  }
  tg.addEventListener('input', checkTg);

  function message() {
    const name = form.elements.name.value.trim();
    const contact = cleanTg();
    const comment = form.elements.comment.value.trim();
    return ['Заявка с сайта GRANIT', ...rows.map(([k, v]) => `${k}: ${v}`), '', `Имя: ${name}`,
      contact ? `Telegram: ${/^[a-z]/i.test(contact) ? '@' : ''}${contact}` : '', comment ? `Комментарий: ${comment}` : '']
      .filter((s, i) => s || i === rows.length + 1).join('\n').replace(/\u00a0/g, ' ');
  }
  function ready() {
    form.elements.name.value = form.elements.name.value.trimStart();
    checkTg();
    return form.reportValidity();
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ready()) return;
    sendToTelegram(message(), status, 'Открываем чат. Заявка отправится, когда вы нажмёте там «Отправить».');
  });
  document.getElementById('orderCopy').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (!ready()) return;
    const ok = await copyText(message(), form);
    btn.focus();
    status.innerHTML = ok ? `Заявка скопирована — отправьте её в&nbsp;чат <a href="${CONFIG.telegram}" target="_blank" rel="noopener">${CONFIG.telegram.replace(/^https:\/\//, '')}</a>` : 'Не удалось скопировать — нажмите «Открыть Telegram».';
  });
}

/* Сервера нет, поэтому открываем чат с готовым текстом — отправляет сам человек */
function sendToTelegram(message, status, done) {
  const url = `${CONFIG.telegram}?text=${encodeURIComponent(message)}`;
  const note = document.createElement('span');   // своя строка у каждой отправки: запоздавший ответ буфера не попадёт в чужой статус
  status.textContent = `${done} `;
  status.insertAdjacentHTML('beforeend', `<a href="${url}" target="_blank" rel="noopener">Не открылся? Открыть чат</a>`);   // если вкладку не пропустил блокировщик
  status.append(note);
  // копия в буфер — до открытия вкладки: в некоторых клиентах Telegram текст не подставляется
  try {
    navigator.clipboard.writeText(message).then(() => { note.textContent = ' Текст скопирован: если он не появился в чате, вставьте его.'; }, () => {});
  } catch (err) { /* file:// — буфера нет */ }
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
}
async function copyText(text, host) {
  try { await navigator.clipboard.writeText(text); return true; } catch (err) { /* нет доступа к буферу — старым способом */ }
  const area = document.createElement('textarea');   // внутри окна: всё снаружи открытого dialog недоступно для фокуса
  area.value = text;
  area.style.cssText = 'position:fixed;opacity:0';
  host.append(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (err) { /* не вышло */ }
  area.remove();
  return ok;
}

/* ===== FAQ =====
   details раскрывается с анимацией высоты (Web Animations, а не CSS transition: их отключает правило для «уменьшения движения»,
   а здесь движение вызвано самим нажатием — при этой настройке оно просто короче). Открыт один вопрос. */
function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 160 : 300;
  const running = new Map();

  function toggle(item, open) {
    const body = item.querySelector('.faq-a');
    const from = item.open ? body.offsetHeight : 0;
    if (running.has(item)) running.get(item).cancel();
    item.classList.toggle('is-open', open);
    if (open) item.open = true;
    if (!body.animate) { item.open = open; return; }
    const to = open ? body.offsetHeight : 0;
    const anim = body.animate([{ height: `${from}px`, opacity: open ? .2 : 1 }, { height: `${to}px`, opacity: open ? 1 : 0 }], { duration, easing: 'cubic-bezier(.3, .7, .2, 1)', fill: open ? 'none' : 'forwards' });
    running.set(item, anim);
    anim.onfinish = () => {
      running.delete(item);
      if (open) return;
      item.open = false;
      anim.cancel();
    };
  }
  items.forEach((item) => {
    item.querySelector('summary').addEventListener('click', (e) => {
      e.preventDefault();
      const open = !item.classList.contains('is-open');
      items.forEach((other) => { if (other !== item && other.classList.contains('is-open')) toggle(other, false); });
      toggle(item, open);
    });
    item.addEventListener('toggle', () => { if (!running.has(item)) item.classList.toggle('is-open', item.open); });   // открыл поиск по странице
  });
}

/* ===== Окна разделов =====
   Адрес #services, #case… открывает окно: поэтому работают обычные ссылки и кнопка «Назад» телефона закрывает окно. */
function initWindows() {
  const wins = [...document.querySelectorAll('dialog.win')];
  if (!wins.length) return;
  if (!wins[0].showModal) { document.documentElement.classList.add('no-dialog'); return; }   // старые браузеры: разделы просто лежат на странице
  let opened = null;
  let leaving = false;   // history.back() срабатывает не сразу — второе нажатие не должно увести с сайта
  let viaLink = false;   // окно открыли на этой странице (а не прямым адресом) — закрывать можно шагом «Назад»
  let scrollY = 0;
  let jump = null;   // ссылка внутри окна на блок страницы (например, на калькулятор)

  function lock(on) {
    const body = document.body;
    if (on) {
      scrollY = window.scrollY;
      body.style.setProperty('--lock', `${-scrollY}px`);
      body.classList.add('is-locked');
    } else {
      body.classList.remove('is-locked');
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  }
  function sync() {
    const next = wins.find((w) => `#${w.id}` === location.hash) || null;
    if (next === opened) return;
    const prev = opened;
    opened = next;
    leaving = false;
    if (prev && prev.open) prev.close();
    if (!prev) lock(true);
    if (next) { next.showModal(); next.scrollTop = 0; } else lock(false);
    if (jump && !next) {
      jump.scrollIntoView({ behavior: 'instant' });
      jump.tabIndex = -1;
      jump.focus({ preventScroll: true });
    }
    jump = null;
  }
  function leave() {
    if (!opened || leaving) return;
    jump = null;
    if (viaLink) { leaving = true; history.back(); return; }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; }
    sync();
  }
  wins.forEach((w) => {
    w.querySelectorAll('.win-close, [data-win-close]').forEach((b) => b.addEventListener('click', leave));
    w.addEventListener('cancel', (e) => { e.preventDefault(); leave(); });
    w.addEventListener('close', () => { if (opened === w) leave(); });   // Esc дважды закрывает окно в обход cancel
    // закрываем по фону, только если и нажали, и отпустили на нём (а не тянули выделение текста)
    let down = false;
    w.addEventListener('pointerdown', (e) => { down = e.target === w; });
    w.addEventListener('click', (e) => {
      if (down && e.target === w) leave();
      const a = e.target.closest('a[href^="#"]');
      const target = a && a.hash && document.getElementById(a.hash.slice(1));
      if (target && !wins.includes(target) && !e.ctrlKey && !e.metaKey && !e.shiftKey) jump = target;
    });
  });
  addEventListener('hashchange', () => { if (!opened) viaLink = true; sync(); });
  // прямой адрес окна: кладём под него в историю саму страницу, чтобы «Назад» и крестик не уводили с сайта
  const hash = location.hash;
  if (wins.some((w) => `#${w.id}` === hash)) {
    try {
      history.replaceState(null, '', location.pathname + location.search);
      history.pushState(null, '', hash);
      viaLink = true;
    } catch (e) { /* file:// в некоторых браузерах */ }
  }
  sync();
}

/* ===== Фоновое видео =====
   Грузится после загрузки страницы. При «уменьшении движения» (в Windows — выключенные эффекты анимации)
   и экономии трафика стоит заставка, анимацию включает тумблер вверху первого экрана; у остальных он же — пауза.
   Выбор запоминается. На скрытой вкладке видео стоит. */
function initBackground() {
  const video = document.getElementById('bgVideo');
  const btn = document.getElementById('bgToggle');
  const note = document.getElementById('bgNote');
  if (!video || !btn) return;
  const KEY = 'granit:bg';
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* хранилище недоступно */ }
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(navigator.connection && navigator.connection.saveData);
  let on = saved ? saved === 'on' : !calm;

  // начинаем с кадра заставки (POSTER_FRAME в tools/assets.py), чтобы картинка не прыгала
  video.addEventListener('loadedmetadata', () => { video.currentTime = 70 / 30; }, { once: true });

  function paint() {
    btn.classList.toggle('is-on', on);
    btn.parentElement.classList.toggle('is-on', on);   // свечение за тумблером
    btn.setAttribute('aria-checked', String(on));
    btn.title = on ? 'Остановить анимацию фона' : 'Включить анимацию фона';
    note.textContent = '';
  }
  function apply() {
    paint();
    if (!on || document.hidden) { video.pause(); return; }
    // портрет — весь кадр, остальное — широкая полоса (те же условия, что у заставки в style.css)
    if (!video.src) video.src = matchMedia('(max-aspect-ratio: 1/1)').matches ? video.dataset.tall : video.dataset.wide;
    // режим экономии на iPhone не даёт автозапуск — остаётся заставка и кнопка
    video.play().catch((e) => {
      if (e.name === 'AbortError' || document.hidden || !video.paused) return;
      const broken = video.error || e.name === 'NotSupportedError';
      if (broken) { video.removeAttribute('src'); video.load(); }  // сбой сети — следующее нажатие загрузит заново
      on = false;
      paint();
      if (broken) note.textContent = 'Не загрузилось — нажмите ещё раз';   // чтобы нажатие не выглядело как «ничего не произошло»
    });
  }
  btn.addEventListener('click', (e) => {
    if (e.detail > 0) btn.blur();   // после мыши или пальца рамка фокуса не нужна; с клавиатуры (detail = 0) остаётся
    btn.classList.add('is-moved');   // движение — только после нажатия, не при загрузке страницы
    on = !on;
    saved = on ? 'on' : 'off';
    try { localStorage.setItem(KEY, saved); } catch (e) { /* не запомним — не страшно */ }
    apply();
  });
  document.addEventListener('visibilitychange', apply);
  paint();
  btn.classList.add('is-ready');
  // само видео — после загрузки страницы, чтобы не мешать тексту и фото первого экрана
  if (document.readyState === 'complete') apply(); else addEventListener('load', apply);
}

applyConfig();
renderReviews();
initReviewForm();
renderPlans();
initCalc();
initOrder();
initFaq();
initWindows();
initBackground();
