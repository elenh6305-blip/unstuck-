// ============================================================
// useTaskBreakdown.js — 纯逻辑层
// 职责：管理任务拆分流程的全部状态
// UI层不在此处，只有状态和方法
// ============================================================

import { useState, useCallback } from 'react';
import { breakdownTask } from '../services/geminiService';
import { getApiKey, saveTask } from '../services/storageService';

/**
 * 状态说明：
 *   idle    — 初始空白状态
 *   loading — 正在调用AI
 *   done    — 步骤已生成
 *   error   — 发生错误
 */
export function useTaskBreakdown() {
    const [taskTitle, setTaskTitle] = useState('');
    const [steps, setSteps] = useState([]);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const submitTask = useCallback(async (title) => {
        if (!title.trim()) return;
        setTaskTitle(title);
        setStatus('loading');
        setErrorMsg('');
        setSteps([]);

        const apiKey = getApiKey();
        const { steps: newSteps, error } = await breakdownTask(title, apiKey);

        if (error) {
            setStatus('error');
            setErrorMsg(error);
            return;
        }

        setSteps(newSteps);
        setStatus('done');

        // 自动保存到历史
        saveTask({
            id: Date.now().toString(),
            title,
            steps: newSteps,
            createdAt: new Date().toISOString(),
        });
    }, []);

    const resetTask = useCallback(() => {
        setTaskTitle('');
        setSteps([]);
        setStatus('idle');
        setErrorMsg('');
    }, []);

    return {
        taskTitle,
        steps,
        status,
        errorMsg,
        submitTask,
        resetTask,
    };
}
