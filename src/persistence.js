export const Keys = {
  LAST_MODE: 'last-selected-mode',
  LAST_VOICE: 'last-selected-voice',
}

export function loadPreference(key, defaultValue) {
  return localStorage.getItem(key) || defaultValue;
}

export function savePreference(key, value) {
  localStorage.setItem(key, value);
}

export function saveScore(mode, voice, score) {
  const key = `best-score-${mode}-${voice}`;
  const bestScore = localStorage.getItem(key) || 0;
  if (score > bestScore) {
    localStorage.setItem(key, score);
  }
}

export function loadScore(mode, voice) {
  const key = `best-score-${mode}-${voice}`;
  return parseInt(localStorage.getItem(key), 10) || 0;
}
