const STORAGE_KEY = "url_shortener_logs_v1";

const LoggingMiddleware = {
  log: (eventType, payload = {}) => {
    try {
      const now = new Date().toISOString();
      const entry = {
        id: Math.random().toString(36).slice(2, 9),
        eventType,
        payload,
        timestamp: now,
      };
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      return entry;
    } catch (e) {
      // If logging fails, fallback silently (do not throw)
      return null;
    }
  },
  getAll: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },
  clear: () => localStorage.removeItem(STORAGE_KEY),
};

export default LoggingMiddleware;
