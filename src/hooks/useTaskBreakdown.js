// ============================================================
// useTaskBreakdown.js — 纯逻辑层
// 职责：管理任务拆分流程的全部状态
//       包含：拆分、重排、编辑、"太难了"分析
//       编辑/重排/拆解后自动同步到历史记录
// UI层不在此处，只有状态和方法
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { breakdownTask, analyzeTaskDifficulty } from '../services/geminiService';
import { getApiKey, saveTask, updateTaskSteps } from '../services/storageService';
import { GROUNDING_STEPS } from '../prompts';

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
    // 正在分析"太难了"的步骤ID
    const [analyzingStepId, setAnalyzingStepId] = useState(null);
    // 当前任务在历史中的ID，用于同步编辑
    const taskIdRef = useRef(null);

    // 辅助：同步步骤变更到 localStorage
    const syncSteps = useCallback((newSteps) => {
        if (taskIdRef.current) {
            updateTaskSteps(taskIdRef.current, newSteps);
        }
    }, []);

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

        // 自动保存到历史，并记住任务ID
        const id = Date.now().toString();
        taskIdRef.current = id;
        saveTask({
            id,
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
        setAnalyzingStepId(null);
        taskIdRef.current = null;
    }, []);

    // ── 拖拽重排 ────────────────────────────────────────────
    const reorderSteps = useCallback((fromIndex, toIndex) => {
        setSteps((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            syncSteps(updated);
            return updated;
        });
    }, [syncSteps]);

    // ── 编辑步骤文本 ────────────────────────────────────────
    const updateStepText = useCallback((stepId, newText) => {
        setSteps((prev) => {
            const updated = prev.map((s) =>
                s.id === stepId ? { ...s, text: newText } : s
            );
            syncSteps(updated);
            return updated;
        });
    }, [syncSteps]);

    // ── "太难了?" —— 分析并拆解/插入落地步骤 ────────────────
    const handleTooHard = useCallback(async (stepId) => {
        const step = steps.find((s) => s.id === stepId);
        if (!step) return;

        setAnalyzingStepId(stepId);
        const apiKey = getApiKey();
        const result = await analyzeTaskDifficulty(step.text, apiKey);
        setAnalyzingStepId(null);

        if (result.error) {
            setErrorMsg(result.error);
            return;
        }

        setSteps((prev) => {
            const idx = prev.findIndex((s) => s.id === stepId);
            if (idx === -1) return prev;

            const updated = [...prev];

            if (result.canBreakdown && result.steps?.length) {
                // 用更细的子步骤替换原步骤
                const subSteps = result.steps.map((s, i) => ({
                    ...s,
                    id: `${stepId}-sub${i + 1}`,
                }));
                updated.splice(idx, 1, ...subSteps);
            } else {
                // 无法拆解 → 在原步骤后插入落地/脱困引导
                const groundingSteps = GROUNDING_STEPS.map((g, i) => ({
                    ...g,
                    id: `${stepId}-g${i + 1}`,
                }));
                updated.splice(idx + 1, 0, ...groundingSteps);
            }

            syncSteps(updated);
            return updated;
        });
    }, [steps, syncSteps]);

    return {
        taskTitle,
        steps,
        status,
        errorMsg,
        analyzingStepId,
        submitTask,
        resetTask,
        reorderSteps,
        updateStepText,
        handleTooHard,
    };
}
