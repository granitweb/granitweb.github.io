/* ===== Настройки сайта — всё, что ещё не решено, меняется здесь ===== */
const CONFIG = {
  telegram: 'https://t.me/vnecamer',
  channel: 'https://t.me/granitweb',   // кнопка «Канал» внизу
  phone: '',        // +79991234567
  email: '',        // name@example.ru
};

/* Отзывы — только настоящие, с согласия автора. Новые — сверху.
   { name: 'Имя', role: 'Кто или компания', work: 'Лендинг', rating: 5 или null, date: 'Октябрь 2026', text: 'Текст отзыва' } */
const REVIEWS = [];

/* Примеры (вымышлены) — показываются с подписью «пример отзыва», пока REVIEWS пуст; с первым настоящим исчезают все */
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
  const demo = !REVIEWS.length;
  const name = (r.name || '').trim() || 'Клиент';
  const n = Math.max(0, Math.min(5, Math.round(Number(r.rating)) || 0));
  const stars = n ? `<span aria-hidden="true">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>` : '';
  const when = demo ? '<span class="rv-demo">пример отзыва</span>' : escapeHtml(r.date || '');
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
  const cards = [...list.children];
  const nav = document.getElementById('reviewsNav');
  const dotsBox = document.getElementById('reviewsDots');
  dotsBox.innerHTML = items.map((r, i) => `<button class="rv-dot" type="button" aria-label="Отзыв ${i + 1}"></button>`).join('');
  const dots = [...dotsBox.children];
  const arrows = [...nav.querySelectorAll('[data-step]')];
  nav.hidden = items.length < 2;
  let current = -1;

  function paint(i) {
    if (i === current) return;
    current = i;
    cards.forEach((c, k) => c.classList.toggle('is-current', k === i));
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-current', String(k === i)); });
    arrows.forEach((b) => { b.disabled = !cards[i + Number(b.dataset.step)]; });
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
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  arrows.forEach((b) => b.addEventListener('click', () => go(current + Number(b.dataset.step))));
  cards.forEach((c, i) => c.addEventListener('click', () => { if (i !== current && !String(getSelection())) go(i); }));
  // начинаем со второго отзыва — с обеих сторон видны соседи
  const first = items.length > 2 ? 1 : 0;
  paint(first);
  go(first, true);
  // высота окна на телефоне меняется от клавиатуры и адресной строки — реагируем только на ширину
  let width = list.clientWidth;
  addEventListener('resize', () => { if (list.clientWidth === width) return; width = list.clientWidth; go(current, true); });
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
    status.textContent = 'Чат открыт в новой вкладке. Отзыв отправится, когда вы нажмёте там «Отправить».';
    // копия в буфер — до открытия вкладки: в некоторых клиентах Telegram текст не подставляется
    try {
      navigator.clipboard.writeText(message).then(() => { status.textContent += ' Если текст не появился, он скопирован — вставьте его в чат.'; }, () => {});
    } catch (err) { /* file:// — буфера нет */ }
    const link = document.createElement('a');
    link.href = `${CONFIG.telegram}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
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
  }
  function leave() {
    if (!opened || leaving) return;
    if (viaLink) { leaving = true; history.back(); return; }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; }
    sync();
  }
  wins.forEach((w) => {
    w.querySelector('.win-close').addEventListener('click', leave);
    w.addEventListener('cancel', (e) => { e.preventDefault(); leave(); });
    w.addEventListener('close', () => { if (opened === w) leave(); });   // Esc дважды закрывает окно в обход cancel
    // закрываем по фону, только если и нажали, и отпустили на нём (а не тянули выделение текста)
    let down = false;
    w.addEventListener('pointerdown', (e) => { down = e.target === w; });
    w.addEventListener('click', (e) => { if (down && e.target === w) leave(); });
  });
  addEventListener('hashchange', () => { if (!opened) viaLink = true; sync(); });
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
initWindows();
initBackground();
