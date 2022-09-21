function sortVoices(voices) {
  return voices.sort((a, b) => {
    if (a.lang < b.lang) return -1;
    if (a.lang > b.lang) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 0;
  });
}

export function getVoices(callback) {
  const voices = speechSynthesis.getVoices();

  if (typeof voices !== 'undefined' && voices.length > 0) {
    callback(sortVoices(voices));
  }

  speechSynthesis.onvoiceschanged = function () {
    callback(sortVoices(speechSynthesis.getVoices()));
  };
}

export function getVoice(name) {
  return speechSynthesis.getVoices().filter((v) => v.name == name)[0];
}

export default { getVoices, getVoice };
