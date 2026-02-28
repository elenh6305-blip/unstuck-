// ============================================================
// storageService.js — 纯服务层
// 职责：localStorage 读写封装
// ============================================================

const KEYS = {
    API_KEY: 'adhd_api_key',
    HISTORY: 'adhd_history',
};

// --- API Key ---
export function saveApiKey(key) {
    localStorage.setItem(KEYS.API_KEY, key);
}

export function getApiKey() {
    return localStorage.getItem(KEYS.API_KEY) || '';
}

// --- 历史记录 ---
/**
 * 保存一条任务到历史记录
 * @param {{ id: string, title: string, steps: Array, createdAt: string }} task
 */
export function saveTask(task) {
    const history = getTasks();
    // 最多保留50条
    const updated = [task, ...history].slice(0, 50);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
}

export function getTasks() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || [];
    } catch {
        return [];
    }
}

export function clearHistory() {
    localStorage.removeItem(KEYS.HISTORY);
}

export function deleteTask(id) {
    const history = getTasks().filter((t) => t.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}
