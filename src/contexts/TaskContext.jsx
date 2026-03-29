// ============================================================
// TaskContext.jsx — 全局任务拆分状态 Provider
// 职责：管理任务拆分流程的全部状态，存活于路由切换之外
//       包含：拆分、重排、编辑、"太难了"分析、步骤完成状态
//
// taskIdRef 结构说明：
//   null                                — 无活跃任务
//   { type: 'new', id }                 — 新建任务，编辑时覆盖原条目
//   { type: 'from-history', sourceId, title } — 调用历史，首次编辑时分叉新建
// ============================================================

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { breakdownTask, analyzeTaskDifficulty } from '../services/aiService';
import { getApiKey, saveTask, updateTaskSteps } from '../services/storageService';
import { GROUNDING_STEPS } from '../prompts';

const TaskContext = createContext(null);

/**
 * 状态说明：
 *   idle    — 初始空白状态
 *   loading — 正在调用AI
 *   done    — 步骤已生成
 *   error   — 发生错误
 */
export function TaskProvider({ children }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [steps, setSteps] = useState([]);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const [analyzingStepId, setAnalyzingStepId] = useState(null);
    const taskIdRef = useRef(null);

    // 步骤完成状态（原先在 HomePage 中管理）
    const [completedIds, setCompletedIds] = useState(new Set());

    // ── 辅助：同步步骤变更到 localStorage ────────────────────
    // 根据 taskIdRef 的类型决定：覆盖原条目 or 分叉新建
    const syncSteps = useCallback((newSteps) => {
        const ref = taskIdRef.current;
        if (!ref) return;

        if (ref.type === 'new') {
            // 新建任务：原地覆盖
            updateTaskSteps(ref.id, newSteps);
        } else if (ref.type === 'from-history') {
            // 调用历史后首次编辑：分叉新建，原始历史不动
            const newId = Date.now().toString();
            saveTask({
                id: newId,
                title: ref.title,
                steps: newSteps,
                createdAt: new Date().toISOString(),
            });
            // 切换为 'new' 模式，后续编辑覆盖新条目
            taskIdRef.current = { type: 'new', id: newId };
        }
    }, []);

    // ── 提交任务 ─────────────────────────────────────────────
    const submitTask = useCallback(async (title) => {
        if (!title.trim()) return;
        setTaskTitle(title);
        setStatus('loading');
        setErrorMsg('');
        setSteps([]);
        setCompletedIds(new Set());

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
        taskIdRef.current = { type: 'new', id };
        saveTask({
            id,
            title,
            steps: newSteps,
            createdAt: new Date().toISOString(),
        });
    }, []);

    // ── 重置任务 ─────────────────────────────────────────────
    const resetTask = useCallback(() => {
        setTaskTitle('');
        setSteps([]);
        setStatus('idle');
        setErrorMsg('');
        setAnalyzingStepId(null);
        setCompletedIds(new Set());
        taskIdRef.current = null;
    }, []);

    // ── 加载历史任务（不重新调 AI，不创建新记录） ─────────────
    // 标记为 'from-history'，首次编辑时才会分叉新建
    const loadTask = useCallback((task) => {
        setTaskTitle(task.title);
        setSteps(task.steps || []);
        setStatus('done');
        setErrorMsg('');
        setAnalyzingStepId(null);
        setCompletedIds(new Set());
        taskIdRef.current = {
            type: 'from-history',
            sourceId: task.id,
            title: task.title,
        };
    }, []);

    // ── 切换步骤完成状态 ─────────────────────────────────────
    const toggleComplete = useCallback((id) => {
        setCompletedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    // ── 拖拽重排 ─────────────────────────────────────────────
    const reorderSteps = useCallback((fromIndex, toIndex) => {
        setSteps((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            syncSteps(updated);
            return updated;
        });
    }, [syncSteps]);

    // ── 编辑步骤文本 ─────────────────────────────────────────
    const updateStepText = useCallback((stepId, newText) => {
        setSteps((prev) => {
            const updated = prev.map((s) =>
                s.id === stepId ? { ...s, text: newText } : s
            );
            syncSteps(updated);
            return updated;
        });
    }, [syncSteps]);

    // ── "太难了?" —— 分析并拆解/插入落地步骤 ─────────────────
    const handleTooHard = useCallback(async (stepId) => {
        // 使用函数式获取最新 steps，避免闭包陈旧引用
        let targetStep = null;
        setSteps((prev) => {
            targetStep = prev.find((s) => s.id === stepId);
            return prev; // 不修改，仅读取
        });
        if (!targetStep) return;

        setAnalyzingStepId(stepId);
        const apiKey = getApiKey();
        const result = await analyzeTaskDifficulty(targetStep.text, apiKey);
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
    }, [syncSteps]);

    const value = {
        taskTitle,
        steps,
        status,
        errorMsg,
        analyzingStepId,
        completedIds,
        submitTask,
        resetTask,
        loadTask,
        toggleComplete,
        reorderSteps,
        updateStepText,
        handleTooHard,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}

/**
 * 消费任务拆分状态的 Hook
 * 必须在 TaskProvider 内部使用
 */
export function useTask() {
    const ctx = useContext(TaskContext);
    if (!ctx) {
        throw new Error('useTask() must be used within <TaskProvider>');
    }
    return ctx;
}
