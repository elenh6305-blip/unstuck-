// ============================================================
// useHistory.js — 纯逻辑层
// 职责：读取和管理 localStorage 中的历史任务
// ============================================================

import { useState, useCallback } from 'react';
import { getTasks, deleteTask, clearHistory } from '../services/storageService';

export function useHistory() {
    const [history, setHistory] = useState(getTasks);

    const refresh = useCallback(() => {
        setHistory(getTasks());
    }, []);

    const removeTask = useCallback((id) => {
        deleteTask(id);
        setHistory(getTasks());
    }, []);

    const clearAll = useCallback(() => {
        clearHistory();
        setHistory([]);
    }, []);

    return {
        history,
        refresh,
        removeTask,
        clearAll,
    };
}
