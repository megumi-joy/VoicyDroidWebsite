// engine.js — core VN engine
import { SLIDES } from './slides.js';
import { getLang, setLang, t, LANGS, LANG_NAMES, VOICE_LANG } from './i18n.js';

let cur = 0, typing = false, timer = null, fullText = '', voiceOn = false, paused = false;
const $ = id => document.getElementById(id);

// --- Save/Load ---
function save() { localStorage.setItem('vn_cur', cur); localStorage.setItem('vn_max', Math.max(cur, +(localStorage.getItem('vn_max')||0))); }
function loadProgress() { return +(localStorage.getItem('vn_cur') || 0); }
export function getMax() { return +(localStorage.getItem('vn_max') || 0); }
export function resetProgress() { localStorage.removeItem('vn_cur'); localStorage.removeItem('vn_max'); }

// --- Render slide ---
function txt(obj) { return (typeof obj === 'string') ? obj : (obj[getLang()] || obj.ru || obj.en || ''); }

function showSlide(idx) {
  const s = SLIDES[idx]; if (!s) return;
  cur = idx; save();
  // image
  const scene = $('scene');
  const old = scene.querySelector('img.visible');
  const img = new Image();
  img.src = s.img;
  img.onload = () => { scene.appendChild(img); requestAnimationFrame(() => img.classList.add('visible')); if (old) setTimeout(() => old.remove(), 1100); };
  // meta
  $('speaker').textContent = txt(s.who);
  $('journey-tag').textContent = txt(s.who);
  $('counter').textContent = `${idx+1}/${SLIDES.length}`;
  $('progress-bar').style.width = ((idx+1)/SLIDES.length*100)+'%';
  // text
  typeText(txt(s.text));
  if (voiceOn) speak(txt(s.text));
}

// --- Typewriter ---
function typeText(text) {
  clearTimeout(timer); fullText = text; typing = true;
  const el = $('dialogue'); let i = 0;
  (function tick() {
    if (i < text.length) { el.innerHTML = text.slice(0, ++i) + '<span class="cur"></span>'; timer = setTimeout(tick, 25); }
    else { el.textContent = text; typing = false; }
  })();
}
function skipType() { clearTimeout(timer); $('dialogue').textContent = fullText; typing = false; }

// --- Navigation ---
export function advance() { if (paused) return; if (typing) { skipType(); return; } if (cur < SLIDES.length-1) showSlide(cur+1); }
export function go(d) { if (paused) return; speechSynthesis.cancel(); showSlide(Math.max(0, Math.min(SLIDES.length-1, cur+d))); }

// --- Voice ---
export function toggleVoice() {
  voiceOn = !voiceOn;
  $('voice-btn').textContent = voiceOn ? '🔊' : '🔇';
  $('voice-btn').classList.toggle('on', voiceOn);
  if (voiceOn) speak(fullText); else speechSynthesis.cancel();
}
function speak(text) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[getLang()] || 'ru-RU'; u.rate = 0.9;
  const v = speechSynthesis.getVoices().find(v => v.lang.startsWith(getLang()));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// --- Pause ---
export function togglePause() {
  paused = !paused;
  const pm = $('pause-menu');
  pm.classList.toggle('out', !paused);
  if (paused) { speechSynthesis.cancel(); refreshPauseUI(); }
}
function refreshPauseUI() {
  $('pm-title').textContent = t('pause');
  $('pm-resume').textContent = t('resume');
  $('pm-voice').textContent = voiceOn ? t('voice_on') : t('voice_off');
  $('pm-menu').textContent = t('to_menu');
  $('pm-progress').textContent = `${t('progress')}: ${cur+1}/${SLIDES.length} (${Math.round((cur+1)/SLIDES.length*100)}%)`;
}
export function pauseToggleVoice() { toggleVoice(); refreshPauseUI(); }

// --- Language ---
export function buildLangPicker(containerId) {
  const c = $(containerId); c.innerHTML = '';
  LANGS.forEach(l => {
    const b = document.createElement('button');
    b.textContent = LANG_NAMES[l]; b.className = l === getLang() ? 'active' : '';
    b.onclick = () => { setLang(l); buildLangPicker(containerId); showSlide(cur); refreshMenuUI(); };
    c.appendChild(b);
  });
}

// --- Menu UI refresh ---
function refreshMenuUI() {
  const ts = $('title-screen');
  if (ts && !ts.classList.contains('out')) {
    $('ts-title').textContent = t('title');
    $('ts-sub').textContent = t('subtitle');
    $('ts-start').textContent = loadProgress() > 0 ? t('continue_') : t('start');
    $('ts-new').textContent = t('new_game');
    buildLangPicker('ts-lang');
  }
}

// --- Start / Menu ---
export function startGame(fromSlide) {
  $('title-screen').classList.add('out');
  $('hud').style.display = 'flex';
  $('textbox').classList.remove('hidden');
  showSlide(fromSlide || loadProgress());
  buildLangPicker('hud-lang');
}
export function newGame() { resetProgress(); startGame(0); }
export function backToMenu() {
  paused = false; $('pause-menu').classList.add('out');
  $('hud').style.display = 'none'; $('textbox').classList.add('hidden');
  $('title-screen').classList.remove('out');
  refreshMenuUI();
}

// --- Init ---
export function init() {
  // keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if ($('title-screen').classList.contains('out')) togglePause(); return; }
    if (paused) return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') advance();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'v') toggleVoice();
  });
  // touch
  let tx = 0;
  document.addEventListener('touchstart', e => tx = e.touches[0].clientX);
  document.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); });
  // voices
  speechSynthesis.getVoices();
  // menu
  refreshMenuUI();
  buildLangPicker('ts-lang');
}
