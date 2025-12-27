/* ---------- PUBLIC INIT ---------- */
export async function initWordGame() {
  await makeWords();
  setupDragAndDrop();
}

/* ---------- DRAG & DROP ---------- */
let draggedId = null;
let touchCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function setupDragAndDrop() {
  // ===== DESKTOP DRAG & DROP =====
  document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('draggable', true);

    card.addEventListener('dragstart', () => {
      draggedId = card.dataset.order;
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    // ===== TOUCH SUPPORT =====
    card.addEventListener('touchstart', e => {
      e.preventDefault(); // prevents scrolling
      touchCard = card;
      draggedId = card.dataset.order;

      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();

      touchOffsetX = touch.clientX - rect.left;
      touchOffsetY = touch.clientY - rect.top;

      card.classList.add('dragging');
      card.style.position = 'fixed';
      card.style.zIndex = '1000';
      moveAt(touch.clientX, touch.clientY);
    });

    card.addEventListener('touchmove', e => {
      if (!touchCard) return;
      const touch = e.touches[0];
      moveAt(touch.clientX, touch.clientY);
    });

    card.addEventListener('touchend', e => {
      if (!touchCard) return;

      const touch = e.changedTouches[0];

      // Temporarily hide the card from hit-testing
      touchCard.style.pointerEvents = 'none';

      const dropTarget = document
        .elementFromPoint(touch.clientX, touch.clientY)
        ?.closest('.zone');

      // Restore pointer events
      touchCard.style.pointerEvents = '';

      cleanupTouchStyles();

      if (dropTarget) {
        dropTarget.appendChild(touchCard);

        if (validate(dropTarget)) {
          confetti();
        }
      }

      touchCard = null;
    });
  });

  // ===== DESKTOP DROP ZONES =====
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
      const card = document.querySelector(
        `.card[data-order="${draggedId}"]`
      );
      if (card) zone.appendChild(card);
      zone.classList.remove('active');

      if (validate(zone)) {
        confetti();
      }
    });
  });
}

// ===== HELPERS =====
function moveAt(x, y) {
  touchCard.style.left = x - touchOffsetX + 'px';
  touchCard.style.top = y - touchOffsetY + 'px';
}

function cleanupTouchStyles() {
  touchCard.classList.remove('dragging');
  touchCard.style.position = '';
  touchCard.style.left = '';
  touchCard.style.top = '';
  touchCard.style.zIndex = '';
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

/**
 * 
 * @param {HTMLHtmlElement} el 
 * @returns bool
 */
function validate(el) {
  if (el.id !== 'end point' || document.querySelectorAll('#start-point > .card').length !== 0) return false;

  let orders = [...el.querySelectorAll('.card')].map(card => Number(card.dataset.order));
  return orders.every((value, index) => value === index);
}
