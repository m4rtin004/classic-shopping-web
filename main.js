/* ============================================
   NOVA/3D — Catalog renderer + scroll reveal
   ============================================ */
(function () {
  const grid = document.getElementById('product-grid');
  const counter = document.getElementById('product-count');
  const items = window.NOVA_PRODUCTS || [];

  counter.textContent = `${items.length} items`;

  grid.innerHTML = items.map((p, i) => {
    const initial = (p.name || '?').charAt(0);
    const price = Number(p.price).toFixed(0);
    const stock = p.is_for_sale
      ? '<span class="stock in">● IN STOCK</span>'
      : '<span class="stock out">● UNAVAILABLE</span>';
    const cat = p.category ? `<span class="category-tag">${p.category}</span>` : '';
    const img = p.image_url
      ? `<img src="${p.image_url}" alt="${p.name}" loading="lazy" />`
      : `<div class="product-blob"></div><div class="product-initial">${initial}</div>`;

    return `
      <article class="product-card" style="transition-delay:${i * 60}ms">
        <div class="product-image">
          ${img}
          ${cat}
        </div>
        <h3>${p.name}</h3>
        <p class="product-tagline">${p.tagline || ''}</p>
        <div class="product-foot">
          <span class="price">$${price}</span>
          ${stock}
        </div>
      </article>
    `;
  }).join('');

  // Intersection-based reveal
  const cards = document.querySelectorAll('.product-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '-50px' });
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add('visible'));
  }

  /* ============================================
     Admin Modal Logic
     ============================================ */
  const adminBtn = document.getElementById('nav-admin-btn');
  const adminModal = document.getElementById('admin-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const loginForm = document.getElementById('admin-login-form');

  // Open modal
  adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminModal.classList.add('active');
    document.getElementById('admin-user').focus();
  });

  // Close modal logic
  const closeModal = () => {
    adminModal.classList.remove('active');
    loginForm.reset();
  };

  closeModalBtn.addEventListener('click', closeModal);

  // Close on clicking outside the modal content
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) closeModal();
  });

  // Mock Authentication (Replace with Supabase/Backend auth)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    // Hardcoded demo credentials: admin / nova2026
    if (user === 'admin' && pass === 'nova2026') {
      alert('Access Granted. Welcome to the NOVA/3D Dashboard.');
      closeModal();
      
      // Here is where you would redirect to an admin.html page 
      // or reveal a hidden CRUD table to edit window.NOVA_PRODUCTS
      adminBtn.textContent = 'Dashboard';
      adminBtn.classList.add('btn-primary');
      adminBtn.classList.remove('btn-outline');
    } else {
      alert('Access Denied. Invalid credentials.');
    }
  });
})();