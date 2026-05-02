document.addEventListener('DOMContentLoaded', function () {
  const yesBtn = document.getElementById('yesBtn');
  const noBtn  = document.getElementById('noBtn');
  const actionsArea = document.getElementById('actionsArea');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');

  const noMessages = [
    '¿Segura? 🥺',
    'Piénsalo bien... 🙏',
    '¿En serio? 😅',
    'Última oportunidad 😬',
    'Nooo por favor 😩',
    'Ya mejor di que sí 😭'
  ];

  const PAD = 20;
  let noClicks    = 0;
  let escaped     = false;
  let isFinishing = false;
  let ghost       = null;

  yesBtn.style.display = 'none';

  function createGhost() {
    ghost = document.createElement('div');
    ghost.style.width      = noBtn.offsetWidth  + 'px';
    ghost.style.height     = noBtn.offsetHeight + 'px';
    ghost.style.visibility = 'hidden';
    ghost.style.flexShrink = '0';
    actionsArea.appendChild(ghost);
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function getSafePos() {
    const w = noBtn.offsetWidth  || 130;
    const h = noBtn.offsetHeight || 48;
    return {
      x: clamp(Math.random() * (window.innerWidth  - w - PAD * 2) + PAD, PAD, window.innerWidth  - w - PAD),
      y: clamp(Math.random() * (window.innerHeight - h - PAD * 2) + PAD, PAD, window.innerHeight - h - PAD)
    };
  }

  function escape() {
    if (isFinishing) return;

    if (!escaped) {
      const r = noBtn.getBoundingClientRect();
      createGhost();
      noBtn.style.position = 'fixed';
      noBtn.style.left     = r.left + 'px';
      noBtn.style.top      = r.top  + 'px';
      noBtn.style.width    = r.width + 'px';
      noBtn.style.margin   = '0';
      noBtn.style.zIndex   = '9999';
      noBtn.getBoundingClientRect();
      escaped = true;
    }

    const { x, y } = getSafePos();
    noBtn.style.transition = 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), top 0.28s cubic-bezier(0.34,1.56,0.64,1)';
    noBtn.style.left = x + 'px';
    noBtn.style.top  = y + 'px';
  }

  function showYes() {
    isFinishing = true;

    noBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    noBtn.style.opacity    = '0';
    noBtn.style.transform  = 'scale(0)';
    noBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      noBtn.style.display = 'none';
      if (ghost) ghost.remove();

      yesBtn.style.display     = 'block';
      yesBtn.style.opacity     = '0';
      yesBtn.style.transform   = 'scale(0.5)';
      yesBtn.style.transition  = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        yesBtn.style.opacity   = '1';
        yesBtn.style.transform = 'scale(1)';
      }));

      setTimeout(() => {
        yesBtn.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.18)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1.08)' },
          { transform: 'scale(1)' }
        ], { duration: 700, easing: 'ease-in-out' });
      }, 650);

    }, 430);
  }

  function handleNo() {
    if (isFinishing) return;

    if (noClicks < noMessages.length) {
      noBtn.textContent = noMessages[noClicks];
      noClicks++;
      setTimeout(() => escape(), 80);
    } else {
      showYes();
    }
  }

  noBtn.addEventListener('mouseenter', () => {
    if (noClicks > 0 && !isFinishing) escape();
  });

  noBtn.addEventListener('click', handleNo);

  noBtn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    handleNo();
  }, { passive: false });

  yesBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
  });

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });

  window.addEventListener('resize', () => {
    if (escaped && !isFinishing) escape();
  });
});
