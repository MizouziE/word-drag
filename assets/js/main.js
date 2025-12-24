let draggedId = null;

/* ---------- PUBLIC INIT ---------- */
export async function initWordGame() {
  await makeWords();
  setupDragAndDrop();
}

/* ---------- DRAG & DROP ---------- */
function setupDragAndDrop() {
  // Make each card draggable
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', () => {
      draggedId = card.dataset.order;
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  // Set up the drop zones
  document.querySelectorAll('.zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('active');
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      const card = document.querySelector(`.card[data-order="${draggedId}"]`);
      if (card) zone.appendChild(card);
      zone.classList.remove('active');
    });
  });
}

/* ---------- WORD CREATION ---------- */
async function makeWords() {
  try {
    const response = await fetch("assets/dictionary/words.json");
    const data = await response.json();

    const sentence = pluckSentence(data);
    let startPoint = document.getElementById('start-point')

    let words = sentence.split(' ').map((word, index) => ({
      text: word,
      originalIndex: index
    }));
    shuffle(words);
    
    words.forEach(({ text, originalIndex }) => {
      const el = createWordTile(text, originalIndex);
      startPoint.appendChild(el);
    });
  } catch (e) {
    console.error('uh oh, something went wrong', e);
  }
}

/**
 * 
 * @param {string[]} dictionary 
 * @returns string
 */
function pluckSentence(dictionary) {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

/**
 * 
 * @param {string} word 
 * @param {int} index 
 * @returns HTMLDivElement
 */
function createWordTile(word, index) {
  const el = document.createElement('div');
  el.classList.add('card');
  el.draggable = true;
  el.dataset.order = index;
  el.textContent = word;

  return el;
}

/**
 * 
 * @param {object[]} array 
 * @returns void
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
