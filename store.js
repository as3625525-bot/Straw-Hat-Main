/**
 * Store - Centralized State Management
 * Handles all data persistence and state
 */

const Store = {
  // Keys
  KEYS: {
    USER: 'progressPro_user',
    CATEGORIES: 'progressPro_categories',
    ENTRIES: 'progressPro_entries',
    STREAK: 'progressPro_streak',
    LAST_ENTRY: 'progressPro_lastEntry'
  },

  // Default categories with emojis
  DEFAULT_CATEGORIES: [
    { id: 'todo', name: 'To Do List', emoji: '📋' },
    { id: 'missions', name: 'Missions', emoji: '🎯' },
    { id: 'english', name: 'English Spoken', emoji: '🗣️' },
    { id: 'stocks', name: 'Stock Market', emoji: '📈' },
    { id: 'trading', name: 'Trading', emoji: '💹' },
    { id: 'python', name: 'Learning Python', emoji: '🐍' },
    { id: 'sql', name: 'Learning SQL', emoji: '🗄️' },
    { id: 'ml', name: 'Learning ML', emoji: '🤖' },
    { id: 'git', name: 'Learning GIT', emoji: '🔀' },
    { id: 'exercise', name: 'Exercise', emoji: '💪' }
  ],

  // Emoji mapping for custom categories
  EMOJI_MAP: {
    'reading': '📚',
    'meditation': '🧘',
    'writing': '✍️',
    'coding': '💻',
    'health': '❤️',
    'finance': '💰',
    'music': '🎵',
    'art': '🎨',
    'cooking': '👨‍🍳',
    'travel': '✈️',
    'default': '📌'
  },

  /**
   * Get data from localStorage
   */
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Store.get error:', e);
      return null;
    }
  },

  /**
   * Set data to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Store.set error:', e);
      return false;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  // ---- USER ----
  
  getUser() {
    return this.get(this.KEYS.USER) || null;
  },

  setUser(name) {
    return this.set(this.KEYS.USER, { name, createdAt: new Date().toISOString() });
  },

  removeUser() {
    this.remove(this.KEYS.USER);
  },

  // ---- CATEGORIES ----

  getCategories() {
    return this.get(this.KEYS.CATEGORIES) || [...this.DEFAULT_CATEGORIES];
  },

  setCategories(categories) {
    return this.set(this.KEYS.CATEGORIES, categories);
  },

  addCategory(name) {
    const categories = this.getCategories();
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if exists
    if (categories.some(c => c.id === id)) {
      return { success: false, message: 'Category already exists' };
    }

    // Find emoji
    const emoji = this.EMOJI_MAP[id] || this.EMOJI_MAP.default;
    
    categories.push({ id, name, emoji });
    this.setCategories(categories);
    
    return { success: true, category: { id, name, emoji } };
  },

  getCategoryById(id) {
    const categories = this.getCategories();
    return categories.find(c => c.id === id) || null;
  },

  // ---- ENTRIES ----

  getEntries() {
    return this.get(this.KEYS.ENTRIES) || [];
  },

  setEntries(entries) {
    return this.set(this.KEYS.ENTRIES, entries);
  },

  addEntry(categoryId, text) {
    const user = this.getUser();
    if (!user) return { success: false, message: 'Not logged in' };

    const entries = this.getEntries();
    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      categoryId,
      text,
      user: user.name,
      createdAt: new Date().toISOString()
    };

    entries.push(entry);
    this.setEntries(entries);
    this.updateStreak();

    return { success: true, entry };
  },

  deleteEntry(entryId) {
    const entries = this.getEntries();
    const filtered = entries.filter(e => e.id !== entryId);
    this.setEntries(filtered);
    return { success: true };
  },

  getEntriesByCategory(categoryId) {
    const user = this.getUser();
    if (!user) return [];

    const entries = this.getEntries();
    return entries
      .filter(e => e.categoryId === categoryId && e.user === user.name)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getEntryCountByCategory(categoryId) {
    const user = this.getUser();
    if (!user) return 0;

    const entries = this.getEntries();
    return entries.filter(e => e.categoryId === categoryId && e.user === user.name).length;
  },

  // ---- STATS ----

  getStats() {
    const user = this.getUser();
    if (!user) return { total: 0, today: 0, week: 0, categories: 0 };

    const entries = this.getEntries().filter(e => e.user === user.name);
    const categories = this.getCategories();
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: entries.length,
      today: entries.filter(e => new Date(e.createdAt).toDateString() === today).length,
      week: entries.filter(e => new Date(e.createdAt) >= weekAgo).length,
      categories: categories.length
    };
  },

  // ---- STREAK ----

  getStreak() {
    return this.get(this.KEYS.STREAK) || 0;
  },

  getLastEntryDate() {
    return this.get(this.KEYS.LAST_ENTRY) || null;
  },

  updateStreak() {
    const today = new Date().toDateString();
    const lastEntry = this.getLastEntryDate();
    let streak = this.getStreak();

    if (lastEntry === today) {
      return streak; // Already counted today
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastEntry === yesterday) {
      streak++;
    } else if (lastEntry !== today) {
      streak = 1;
    }

    this.set(this.KEYS.STREAK, streak);
    this.set(this.KEYS.LAST_ENTRY, today);
    
    return streak;
  }
};

// Export for modules or make global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Store;
} else {
  window.Store = Store;
}
