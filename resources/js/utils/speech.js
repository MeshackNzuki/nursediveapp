const speak = (() => {
  let queue = [];
  let currentIndex = 0;
  let isSpeaking = false;
  let currentNode = null;

  const defaults = {
    rate: 0.95,
    pitch: 1,
    lang: "en-US",
    pauseBetweenChunks: 700
  };

  const highlight = (node) => {
    if (!node) return;
    node.classList.add("tts-highlight");
  };

  const clearHighlight = () => {
    if (!currentNode) return;
    currentNode.classList.remove("tts-highlight");
    currentNode = null;
  };

  const pickVoice = (utterance) => {
    const voices = speechSynthesis.getVoices();
    const usVoices = voices.filter(v => v.lang === "en-US");

    const preferredNames = [
      "Google US English",
      "Samantha",
      "Allison",
      "Jenny",
      "Aria"
    ];

    const selected =
      usVoices.find(v => preferredNames.some(name => v.name.includes(name))) ||
      usVoices[0];

    if (selected) utterance.voice = selected;
  };

  const speakChunk = (text, node, opts) => {
    const utterance = new SpeechSynthesisUtterance(text.trim());

    utterance.rate = opts.rate;
    utterance.pitch = opts.pitch;
    utterance.lang = opts.lang;

    pickVoice(utterance);

    clearHighlight();
    currentNode = node;
    highlight(node);

    utterance.onend = () => {
      clearHighlight();
      setTimeout(readNext, opts.pauseBetweenChunks);
    };

    speechSynthesis.speak(utterance);
  };

  const readNext = () => {
    if (!isSpeaking) return;

    if (currentIndex >= queue.length) {
      isSpeaking = false;
      clearHighlight();
      return;
    }

    const { text, node, opts } = queue[currentIndex++];
    speakChunk(text, node, opts);
  };

  const parseHtmlToChunks = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const selectors = `
      h1, h2, h3, h4, h5, h6,
      p,
      li,
      blockquote
    `;

    return Array.from(doc.body.querySelectorAll(selectors))
      .map(node => {
        const text = node.innerText.trim();
        if (!text) return null;
        return { text, node };
      })
      .filter(Boolean);
  };

  const main = (input, options = {}) => {
    // reset
    speechSynthesis.cancel();
    clearHighlight();

    const opts = { ...defaults, ...options };

    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(input);

    queue = looksLikeHtml
      ? parseHtmlToChunks(input)
      : [{ text: input, node: null, opts }];

    // attach opts to each chunk
    queue = queue.map(chunk => ({ ...chunk, opts }));

    currentIndex = 0;
    isSpeaking = true;

    readNext();
  };

  // controls
  main.pause = () => speechSynthesis.pause();
  main.resume = () => speechSynthesis.resume();
  main.stop = () => {
    isSpeaking = false;
    speechSynthesis.cancel();
    clearHighlight();
  };

  return main;
})();

export default speak;
