// ============================================================
// NanoStep.jsx — 纯UI组件
// 职责：单个纳米步骤行
//   - 拖拽排序（drag handle）
//   - hover 显示编辑按钮，点击后进入行内编辑
//   - 双击整行显示"太难了?"按钮（不会误触编辑）
//   - 只有 isCurrent 为 true 时可以划掉
// Props:
//   step{id,text,isGrounding?}, index, isCompleted, isCurrent,
//   onToggle(id), onDoubleClick(id), onUpdateText(id,text),
//   showTooHard, isAnalyzing,
//   onTooHardClick(id),
//   dragHandlers{onDragStart,onDragOver,onDragEnd,onDrop}
// ============================================================

import { useState, useRef, useEffect } from 'react';

export default function NanoStep({
    step,
    index,
    isCompleted,
    isCurrent,
    onToggle,
    onDoubleClick,
    onUpdateText,
    showTooHard,
    isAnalyzing,
    onTooHardClick,
    dragHandlers,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(step.text);
    const inputRef = useRef(null);

    // 同步外部文本变化
    useEffect(() => {
        if (!isEditing) setEditText(step.text);
    }, [step.text, isEditing]);

    // 进入编辑模式时自动聚焦
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const commitEdit = () => {
        setIsEditing(false);
        const trimmed = editText.trim();
        if (trimmed && trimmed !== step.text) {
            onUpdateText(step.id, trimmed);
        } else {
            setEditText(step.text); // 还原
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
        }
        if (e.key === 'Escape') {
            setEditText(step.text);
            setIsEditing(false);
        }
    };

    // 点击编辑按钮进入编辑模式（阻止冒泡避免触发行级事件）
    const handleEditClick = (e) => {
        e.stopPropagation();
        if (!isCompleted) {
            setIsEditing(true);
        }
    };

    // 双击整行：触发"太难了?"标记
    const handleDoubleClick = (e) => {
        e.preventDefault();
        if (!isEditing) {
            onDoubleClick(step.id);
        }
    };

    // 单击勾选（仅限当前步骤）
    const handleCheckClick = (e) => {
        e.stopPropagation();
        if (isCurrent) {
            onToggle(step.id);
        }
    };

    const isGrounding = step.isGrounding;

    return (
        <div
            className={`nano-step ${isCompleted ? 'nano-step--done' : ''} ${isCurrent ? 'nano-step--current' : ''} ${isGrounding ? 'nano-step--grounding' : ''}`}
            draggable={!isEditing}
            onDragStart={(e) => dragHandlers.onDragStart(e, index)}
            onDragOver={(e) => dragHandlers.onDragOver(e, index)}
            onDragEnd={dragHandlers.onDragEnd}
            onDrop={(e) => dragHandlers.onDrop(e, index)}
            onDoubleClick={handleDoubleClick}
        >
            {/* 拖拽手柄 */}
            <div className="nano-step__drag-handle" title="拖拽排序">
                <DragIcon />
            </div>

            {/* 序号 */}
            <div className="nano-step__number">{index + 1}</div>

            {/* 文本 / 编辑框 */}
            {isEditing ? (
                <input
                    ref={inputRef}
                    className="nano-step__edit-input"
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                />
            ) : (
                <p className="nano-step__text">{step.text}</p>
            )}

            {/* 编辑按钮 — hover时才可见，避免误触 */}
            {!isEditing && !isCompleted && (
                <button
                    className="nano-step__edit-btn"
                    onClick={handleEditClick}
                    title="编辑步骤"
                    aria-label="编辑步骤"
                >
                    <EditIcon />
                </button>
            )}

            {/* "太难了?" 按钮 */}
            {showTooHard && !isCompleted && (
                <button
                    className="nano-step__too-hard-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onTooHardClick(step.id);
                    }}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? '分析中…' : '太难了?'}
                </button>
            )}

            {/* 勾选框 */}
            <div
                className={`nano-step__check ${isCompleted ? 'nano-step__check--active' : ''} ${!isCurrent && !isCompleted ? 'nano-step__check--disabled' : ''}`}
                onClick={handleCheckClick}
                role="checkbox"
                aria-checked={isCompleted}
                title={isCurrent ? '完成此步骤' : (isCompleted ? '已完成' : '请先完成前面的步骤')}
            >
                {isCompleted && <CheckIcon />}
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function DragIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="6" r="1.5" fill="currentColor" />
            <circle cx="15" cy="6" r="1.5" fill="currentColor" />
            <circle cx="9" cy="12" r="1.5" fill="currentColor" />
            <circle cx="15" cy="12" r="1.5" fill="currentColor" />
            <circle cx="9" cy="18" r="1.5" fill="currentColor" />
            <circle cx="15" cy="18" r="1.5" fill="currentColor" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
