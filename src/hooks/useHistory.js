// ============================================================
// useHistory.js — 纯逻辑层
// 职责：读取和管理 localStorage 中的历史任务
//       包含：刷新、删除、清空（保留收藏）、收藏切换
// ============================================================

import { useState, useCallback } from 'react';
import { getTasks, deleteTask, clearHistory, toggleTaskFavorite } from '../services/storageService';

export function useHistory() {
    const [history, setHistory] = useState(getTasks);

    const refresh = useCallback(() => {
        setHistory(getTasks());
    }, []);

    const removeTask = useCallback((id) => {
        deleteTask(id);
        setHistory(getTasks());
    }, []);

    // 清空非收藏的历史
    const clearAll = useCallback(() => {
        clearHistory();
        setHistory(getTasks()); // getTasks 此时返回仅包含收藏的列表
    }, []);

    // 切换某条任务的收藏状态
    const toggleFavorite = useCallback((id) => {
        toggleTaskFavorite(id);
        setHistory(getTasks());
    }, []);

    return {
        history,
        refresh,
        removeTask,
        clearAll,
        toggleFavorite,
    };
}
