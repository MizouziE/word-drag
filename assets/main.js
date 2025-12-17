  let draggedId = null;
  // Make each card draggable
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedId = card.id; // remember which card is being dragged
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', e => {
      card.classList.remove('dragging');
    });
  });
  // Set up the drop zones
  document.querySelectorAll('.zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault(); // allow dropping here
      zone.classList.add('active');
    });
    zone.addEventListener('dragleave', e => {
      zone.classList.remove('active');
    });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const card = document.getElementById(draggedId);
      zone.appendChild(card); // move the card into this zone
      zone.classList.remove('active');
    });
  });