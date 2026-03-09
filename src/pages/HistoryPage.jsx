// ============================================================
// HistoryPage.jsx — 页面（组装层）
// 功能：
//   - 点击展开/折叠历史任务的具体步骤
//   - 收藏（灰色星星 ⇆ 黄色星星）
//   - 收藏的历史不会被清空且没有删除按钮
// ============================================================

import { useState, useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';

export default function HistoryPage() {
    const { history, refresh, removeTask, clearAll, toggleFavorite } = useHistory();

    // 当前展开的任务ID集合
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => { refresh(); }, [refresh]);

    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // 判断是否有非收藏的历史（决定是否显示清空按钮）
    const hasNonFavorites = history.some((t) => !t.favorite);

    if (history.length === 0) {
        return (
            <div className="history-page">
                <h2 className="page-title">历史任务</h2>
                <div className="empty-state">
                    <p>还没有完成过任何任务</p>
                    <p className="empty-state__sub">回到主页开始拆分吧 💪</p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="history-header">
                <h2 className="page-title">历史任务</h2>
                {hasNonFavorites && (
                    <button className="btn-text-danger" onClick={clearAll}>
                        清空
                    </button>
                )}
            </div>

            <ul className="history-list">
                {history.map((task) => {
                    const isExpanded = expandedIds.has(task.id);
                    const isFavorite = task.favorite;

                    return (
                        <li key={task.id} className="history-item-wrapper">
                            <div className={`history-item ${isFavorite ? 'history-item--favorite' : ''}`}>
                                {/* 收藏星星 */}
                                <button
                                    className={`history-item__star ${isFavorite ? 'history-item__star--active' : ''}`}
                                    onClick={() => toggleFavorite(task.id)}
                                    aria-label={isFavorite ? '取消收藏' : '收藏'}
                                    title={isFavorite ? '取消收藏' : '收藏'}
                                >
                                    {isFavorite ? <StarFilledIcon /> : <StarOutlineIcon />}
                                </button>

                                {/* 任务信息（可点击展开） */}
                                <div
                                    className="history-item__info"
                                    onClick={() => toggleExpand(task.id)}
                                    role="button"
                                    aria-expanded={isExpanded}
                                >
                                    <div className="history-item__title-row">
                                        <p className="history-item__title">{task.title}</p>
                                        <span className={`history-item__chevron ${isExpanded ? 'history-item__chevron--open' : ''}`}>
                                            <ChevronIcon />
                                        </span>
                                    </div>
                                    <p className="history-item__meta">
                                        {task.steps?.length || 0} 步 · {formatDate(task.createdAt)}
                                    </p>
                                </div>

                                {/* 删除按钮 — 收藏的历史不显示 */}
                                {!isFavorite && (
                                    <button
                                        className="history-item__delete"
                                        onClick={() => removeTask(task.id)}
                                        aria-label="删除"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* 展开的步骤列表 */}
                            {isExpanded && task.steps && task.steps.length > 0 && (
                                <div className="history-steps">
                                    <ol className="history-steps__list">
                                        {task.steps.map((step, idx) => (
                                            <li
                                                key={step.id || idx}
                                                className={`history-steps__item ${step.isGrounding ? 'history-steps__item--grounding' : ''}`}
                                            >
                                                <span className="history-steps__num">{idx + 1}</span>
                                                <span className="history-steps__text">{step.text}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ── 辅助函数与图标 ──────────────────────────────────────────

function formatDate(isoStr) {
    const d = new Date(isoStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function StarOutlineIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function StarFilledIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f9a825" stroke="#f9a825" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}
