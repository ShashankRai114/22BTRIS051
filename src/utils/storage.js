const DATA_KEY = "url_shortener_data_v1";

export function loadAll() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Ensure we always return an object with `links` mapping
    if (!parsed || typeof parsed !== "object") return { links: {} };
    if (!parsed.links || typeof parsed.links !== "object") parsed.links = {};
    return parsed;
  } catch (e) {
    return { links: {} };
  }
}

export function saveAll(obj) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(obj));
  } catch (e) {
    // fail silently
  }
}

export function resetAll() {
  try {
    localStorage.removeItem(DATA_KEY);
  } catch (e) {}
}
