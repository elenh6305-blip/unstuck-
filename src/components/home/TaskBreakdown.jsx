// ============================================================
// TaskBreakdown.jsx — 纯UI组件
// 职责：任务拆分结果容器，显示步骤列表和操作按钮
// Props: taskTitle, steps[], completedIds(Set), onToggle(id), onStartFocus(), onReset()
// ============================================================

import NanoStep from './NanoStep';

export default function TaskBreakdown({ taskTitle, steps, completedIds, onToggle, onStartFocus, onReset }) {
    const completedCount = completedIds.size;
    const totalCount = steps.length;
    const allDone = completedCount === totalCount;

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
                    <li key={step.id}>
                        <NanoStep
                            step={step}
                            index={index}
                            isCompleted={completedIds.has(step.id)}
                            onToggle={onToggle}
                        />
                    </li>
                ))}
            </ul>

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
