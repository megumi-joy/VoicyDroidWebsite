// i18n.js — UI translations + language system
export const LANGS = ['ru','en','es','ca','fr','de','uk'];
export const LANG_NAMES = {ru:'РУ',en:'EN',es:'ES',ca:'CA',fr:'FR',de:'DE',uk:'УК'};
export const VOICE_LANG = {ru:'ru-RU',en:'en-US',es:'es-ES',ca:'ca-ES',fr:'fr-FR',de:'de-DE',uk:'uk-UA'};

export const UI = {
  title:       {ru:'Электричка',en:'Elektrichka',es:'Cercanías',ca:'Rodalies',fr:'L\'Électrique',de:'Elektritschka',uk:'Електричка'},
  subtitle:    {ru:'Визуальная Новелла · Три Поездки',en:'Visual Novel · Three Journeys',es:'Novela Visual · Tres Viajes',ca:'Novel·la Visual · Tres Viatges',fr:'Roman Visuel · Trois Voyages',de:'Visual Novel · Drei Reisen',uk:'Візуальна Новела · Три Подорожі'},
  start:       {ru:'Начать Путь',en:'Start Journey',es:'Iniciar Viaje',ca:'Iniciar Viatge',fr:'Commencer',de:'Reise Starten',uk:'Розпочати Подорож'},
  continue_:   {ru:'Продолжить',en:'Continue',es:'Continuar',ca:'Continuar',fr:'Continuer',de:'Fortsetzen',uk:'Продовжити'},
  new_game:    {ru:'Новая Игра',en:'New Game',es:'Nuevo Juego',ca:'Nou Joc',fr:'Nouvelle Partie',de:'Neues Spiel',uk:'Нова Гра'},
  settings:    {ru:'Настройки',en:'Settings',es:'Ajustes',ca:'Configuració',fr:'Paramètres',de:'Einstellungen',uk:'Налаштування'},
  pause:       {ru:'Пауза',en:'Paused',es:'Pausa',ca:'Pausa',fr:'Pause',de:'Pause',uk:'Пауза'},
  resume:      {ru:'Продолжить',en:'Resume',es:'Reanudar',ca:'Reprendre',fr:'Reprendre',de:'Fortfahren',uk:'Продовжити'},
  to_menu:     {ru:'В Меню',en:'Main Menu',es:'Menú',ca:'Menú',fr:'Menu',de:'Hauptmenü',uk:'Меню'},
  voice_on:    {ru:'Озвучка: ВКЛ',en:'Voice: ON',es:'Voz: SÍ',ca:'Veu: SÍ',fr:'Voix: OUI',de:'Stimme: AN',uk:'Озвучка: ВКЛ'},
  voice_off:   {ru:'Озвучка: ВЫКЛ',en:'Voice: OFF',es:'Voz: NO',ca:'Veu: NO',fr:'Voix: NON',de:'Stimme: AUS',uk:'Озвучка: ВИМК'},
  progress:    {ru:'Прогресс',en:'Progress',es:'Progreso',ca:'Progrés',fr:'Progrès',de:'Fortschritt',uk:'Прогрес'},
  lang:        {ru:'Язык',en:'Language',es:'Idioma',ca:'Idioma',fr:'Langue',de:'Sprache',uk:'Мова'},
};

let currentLang = localStorage.getItem('vn_lang') || 'ru';

export function getLang() { return currentLang; }
export function setLang(l) { currentLang = l; localStorage.setItem('vn_lang', l); }
export function t(key) { return UI[key]?.[currentLang] || UI[key]?.ru || key; }
