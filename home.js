/**
 * Home Page - Main Dashboard Logic
 */

(function() {
  'use strict';

  // DOM Elements
  const elements = {
    // Auth
    loginSection: document.getElementById('loginSection'),
    dashboardSection: document.getElementById('dashboardSection'),
    usernameInput: document.getElementById('usernameInput'),
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // User Info
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    streakCount: document.getElementById('streakCount'),
    
    // Stats
    statTotal: document.getElementById('statTotal'),
    statToday: document.getElementById('statToday'),
    statWeek: document.getElementById('statWeek'),
    statCategories: document.getElementById('statCategories'),
    
    // Categories
    categoriesGrid: document.getElementById('categoriesGrid'),
    addCategoryBtn: document.getElementById('addCategoryBtn'),
    
    // Modal
    modalBackdrop: document.getElementById('modalBackdrop'),
    modal: document.getElementById('modal'),
    modalClose: document.getElementById('modalClose'),
    newCategoryInput: document.getElementById('newCategoryInput'),
    createCategoryBtn: document.getElementById('createCategoryBtn')
  };

  /**
   * Initialize the home page
   */
  function init() {
    // Initialize animations
    Animations.initBackground();
    
    // Check if user is logged in
    const user = Store.getUser();
    
    if (user) {
      showDashboard(user);
    } else {
      showLogin();
    }

    // Bind events
    bindEvents();
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // Login
    elements.loginBtn?.addEventListener('click', handleLogin);
    elements.usernameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });

    // Logout
    elements.logoutBtn?.addEventListener('click', handleLogout);

    // Add Category
    elements.addCategoryBtn?.addEventListener('click', openModal);
    elements.modalClose?.addEventListener('click', closeModal);
    elements.modalBackdrop?.addEventListener('click', closeModal);
    elements.createCategoryBtn?.addEventListener('click', handleCreateCategory);
    elements.newCategoryInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreateCategory();
      if (e.key === 'Escape') closeModal();
    });

    // Add ripple to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      Animations.addRipple(btn);
    });
  }

  /**
   * Show login section
   */
  function showLogin() {
    elements.loginSection?.classList.remove('hidden');
    elements.dashboardSection?.classList.add('hidden');
    
    // Focus input
    setTimeout(() => elements.usernameInput?.focus(), 100);
  }

  /**
   * Show dashboard section
   */
  function showDashboard(user) {
    elements.loginSection?.classList.add('hidden');
    elements.dashboardSection?.classList.remove('hidden');

    // Update user info
    if (elements.userAvatar) {
      elements.userAvatar.textContent = Utils.getInitials(user.name);
    }
    if (elements.userName) {
      elements.userName.textContent = user.name;
    }

    // Update streak
    updateStreak();

    // Update stats
    updateStats();

    // Render categories
    renderCategories();

    // Animate elements
    setTimeout(() => {
      Animations.staggerChildren(elements.categoriesGrid, 80);
    }, 200);
  }

  /**
   * Handle login
   */
  function handleLogin() {
    const name = elements.usernameInput?.value.trim();

    if (!name) {
      Toast.error('Please enter your name');
      Animations.shake(elements.usernameInput);
      elements.usernameInput?.focus();
      return;
    }

    Store.setUser(name);
    const user = Store.getUser();
    
    // Animate transition
    elements.loginSection.style.opacity = '0';
    elements.loginSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      showDashboard(user);
      Toast.success(`Welcome, ${name}! 🎉`);
    }, 300);
  }

  /**
   * Handle logout
   */
  function handleLogout() {
    Store.removeUser();
    
    // Animate transition
    elements.dashboardSection.style.opacity = '0';
    elements.dashboardSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      elements.dashboardSection.style.opacity = '';
      elements.dashboardSection.style.transform = '';
      showLogin();
      Toast.success('See you soon! 👋');
    }, 300);
  }

  /**
   * Update streak display
   */
  function updateStreak() {
    const streak = Store.getStreak();
    if (elements.streakCount) {
      Animations.animateCounter(elements.streakCount, streak, 500);
    }
  }

  /**
   * Update stats display
   */
  function updateStats() {
    const stats = Store.getStats();
    
    if (elements.statTotal) {
      Animations.animateCounter(elements.statTotal, stats.total, 800);
    }
    if (elements.statToday) {
      Animations.animateCounter(elements.statToday, stats.today, 600);
    }
    if (elements.statWeek) {
      Animations.animateCounter(elements.statWeek, stats.week, 700);
    }
    if (elements.statCategories) {
      Animations.animateCounter(elements.statCategories, stats.categories, 500);
    }
  }

  /**
   * Render categories grid
   */
  function renderCategories() {
    if (!elements.categoriesGrid) return;

    const categories = Store.getCategories();
    
    elements.categoriesGrid.innerHTML = categories.map(cat => {
      const entryCount = Store.getEntryCountByCategory(cat.id);
      
      return `
        <a href="category.html?id=${cat.id}" class="category-card" data-id="${cat.id}">
          <span class="emoji">${cat.emoji}</span>
          <span class="name">${Utils.escapeHtml(cat.name)}</span>
          <span class="entry-count">
            <span>📝</span> ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}
          </span>
        </a>
      `;
    }).join('');

    // Add click handlers for smooth transition
    elements.categoriesGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const url = card.getAttribute('href');
        Animations.pageTransition(url);
      });
    });
  }

  /**
   * Open modal
   */
  function openModal() {
    elements.modalBackdrop?.classList.add('active');
    elements.modal?.classList.add('active');
    elements.newCategoryInput.value = '';
    
    setTimeout(() => elements.newCategoryInput?.focus(), 100);
  }

  /**
   * Close modal
   */
  function closeModal() {
    elements.modalBackdrop?.classList.remove('active');
    elements.modal?.classList.remove('active');
  }

  /**
   * Handle create category
   */
  function handleCreateCategory() {
    const name = elements.newCategoryInput?.value.trim();

    if (!name) {
      Toast.error('Please enter a category name');
      Animations.shake(elements.newCategoryInput);
      return;
    }

    const result = Store.addCategory(name);

    if (result.success) {
      closeModal();
      renderCategories();
      updateStats();
      
      // Animate new category
      setTimeout(() => {
        const newCard = elements.categoriesGrid.querySelector(`[data-id="${result.category.id}"]`);
        if (newCard) {
          Animations.pop(newCard);
          newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      Toast.success(`Category "${name}" created! ✨`);
    } else {
      Toast.error(result.message);
      Animations.shake(elements.newCategoryInput);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
