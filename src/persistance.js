export function saveScore(mode, voice, score) {
  const key = `best-score-${mode}-${voice}`;
  const bestScore = localStorage.getItem(key) || 0;
  if (score > bestScore) {
    localStorage.setItem(key, score);
  }
}

export function getScore(mode, voice) {
  const key = `best-score-${mode}-${voice}`;
  return parseInt(localStorage.getItem(key), 10) || 0;
}
