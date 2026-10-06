/* Keep the fixed Ghost Protocol header clear of its sidebar and content when links wrap. */
(() => {
  const header = document.querySelector('.sc-site-header.site-bridge');
  if (!header || document.documentElement.classList.contains('embedded')) return;
  let lastHeight = 0;
  const updateHeight = () => {
    const height = Math.ceil(header.getBoundingClientRect().height);
    if (height > 0 && height !== lastHeight) {
      document.documentElement.style.setProperty('--sitebar-h', `${height}px`);
      lastHeight = height;
    }
  };
  updateHeight();
  if ('ResizeObserver' in window) new ResizeObserver(updateHeight).observe(header);
  else window.addEventListener('resize', updateHeight, { passive: true });
})();
