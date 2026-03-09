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
 * @param {{ id: string, title: string, steps: Array, createdAt: string, favorite?: boolean }} task
 * @returns {string} 新任务的 id
 */
export function saveTask(task) {
    const history = getTasks();
    const newTask = { ...task, favorite: task.favorite ?? false };
    // 最多保留50条
    const updated = [newTask, ...history].slice(0, 50);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return newTask.id;
}

export function getTasks() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || [];
    } catch {
        return [];
    }
}

/**
 * 清空非收藏的历史记录（收藏的保留）
 */
export function clearHistory() {
    const history = getTasks();
    const favorites = history.filter((t) => t.favorite);
    if (favorites.length > 0) {
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(favorites));
    } else {
        localStorage.removeItem(KEYS.HISTORY);
    }
}

export function deleteTask(id) {
    const history = getTasks().filter((t) => t.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

/**
 * 更新已保存任务的步骤（编辑/排序/拆解后同步）
 * @param {string} taskId
 * @param {Array} newSteps
 */
export function updateTaskSteps(taskId, newSteps) {
    const history = getTasks();
    const updated = history.map((t) =>
        t.id === taskId ? { ...t, steps: newSteps } : t
    );
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
}

/**
 * 切换任务的收藏状态
 * @param {string} taskId
 * @returns {boolean} 切换后的收藏状态
 */
export function toggleTaskFavorite(taskId) {
    const history = getTasks();
    let newState = false;
    const updated = history.map((t) => {
        if (t.id === taskId) {
            newState = !t.favorite;
            return { ...t, favorite: newState };
        }
        return t;
    });
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return newState;
}
