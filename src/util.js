export function getVoices() {
    const voices = speechSynthesis.getVoices();
    voices.sort((a, b) => {
        if (a.lang < b.lang) return -1;
        if (a.lang > b.lang) return 1;

        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        return 0;
    });
    return voices;
}

export function getVoice(name) {
    return speechSynthesis.getVoices().filter((v) => v.name == name)[0];
}

export default { getVoices, getVoice };
