// ============================================================
// TaskBreakdown.jsx — 纯UI组件
// 职责：任务拆分结果容器
//   - 显示步骤列表（支持拖拽重排、行内编辑）
//   - 双击"太难了?"交互
//   - 灰色引导语提示
//   - 只允许划掉当前步骤
// Props:
//   taskTitle, steps[], completedIds(Set),
//   onToggle(id), onStartFocus(), onReset(),
//   onReorder(from,to), onUpdateText(id,text),
//   onTooHard(id), analyzingStepId
// ============================================================

import { useState, useRef, useCallback } from 'react';
import NanoStep from './NanoStep';

export default function TaskBreakdown({
    taskTitle,
    steps,
    completedIds,
    onToggle,
    onStartFocus,
    onReset,
    onReorder,
    onUpdateText,
    onTooHard,
    analyzingStepId,
}) {
    const completedCount = completedIds.size;
    const totalCount = steps.length;
    const allDone = completedCount === totalCount;

    // 找到当前应该进行的步骤（第一个未完成的步骤）
    const currentStepId = steps.find((s) => !completedIds.has(s.id))?.id ?? null;

    // ── 双击"太难了?" 的显示状态 ───────────────────────────
    const [tooHardIds, setTooHardIds] = useState(new Set());

    const handleDoubleClick = useCallback((stepId) => {
        setTooHardIds((prev) => {
            const next = new Set(prev);
            if (next.has(stepId)) {
                next.delete(stepId);
            } else {
                next.add(stepId);
            }
            return next;
        });
    }, []);

    // ── 拖拽排序 ────────────────────────────────────────────
    const dragIndexRef = useRef(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const dragHandlers = {
        onDragStart: (e, index) => {
            dragIndexRef.current = index;
            e.dataTransfer.effectAllowed = 'move';
            // 通过添加一个半透明效果来暗示拖拽
            e.currentTarget.style.opacity = '0.4';
        },
        onDragOver: (e, index) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverIndex(index);
        },
        onDragEnd: (e) => {
            e.currentTarget.style.opacity = '1';
            setDragOverIndex(null);
            dragIndexRef.current = null;
        },
        onDrop: (e, toIndex) => {
            e.preventDefault();
            const fromIndex = dragIndexRef.current;
            if (fromIndex !== null && fromIndex !== toIndex) {
                onReorder(fromIndex, toIndex);
            }
            setDragOverIndex(null);
            dragIndexRef.current = null;
        },
    };

    return (
        <div className="task-breakdown">
            <div className="task-breakdown__header">
                <div>
                    <h2 className="task-breakdown__title">{taskTitle}</h2>
                    <p className="task-breakdown__progress">
                        已完成 {completedCount} / {totalCount} 步
                    </p>
                </div>
                <button className="task-breakdown__reset" onClick={onReset} aria-label="重新开始">
                    重置
                </button>
            </div>

            <div className="task-breakdown__progress-bar">
                <div
                    className="task-breakdown__progress-fill"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
            </div>

            <ul className="task-breakdown__list">
                {steps.map((step, index) => (
                    <li
                        key={step.id}
                        className={dragOverIndex === index ? 'nano-step-drop-target' : ''}
                    >
                        <NanoStep
                            step={step}
                            index={index}
                            isCompleted={completedIds.has(step.id)}
                            isCurrent={step.id === currentStepId}
                            onToggle={onToggle}
                            onDoubleClick={handleDoubleClick}
                            onUpdateText={onUpdateText}
                            showTooHard={tooHardIds.has(step.id)}
                            isAnalyzing={analyzingStepId === step.id}
                            onTooHardClick={onTooHard}
                            dragHandlers={dragHandlers}
                        />
                    </li>
                ))}
            </ul>

            {/* 灰色引导语 */}
            <p className="task-breakdown__hint">
                太难了？双击任务试试
            </p>

            <div className="task-breakdown__actions">
                <button
                    className={`btn-focus ${allDone ? 'btn-focus--done' : ''}`}
                    onClick={onStartFocus}
                >
                    {allDone ? '🎉 全部完成！' : '🎯 开始专注'}
                </button>
            </div>
        </div>
    );
}
