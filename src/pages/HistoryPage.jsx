// ============================================================
// HistoryPage.jsx — 页面（组装层）
// ============================================================

import { useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';

export default function HistoryPage() {
    const { history, refresh, removeTask, clearAll } = useHistory();

    useEffect(() => { refresh(); }, [refresh]);

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
                <button className="btn-text-danger" onClick={clearAll}>清空</button>
            </div>

            <ul className="history-list">
                {history.map((task) => (
                    <li key={task.id} className="history-item">
                        <div className="history-item__info">
                            <p className="history-item__title">{task.title}</p>
                            <p className="history-item__meta">
                                {task.steps.length} 步 · {formatDate(task.createdAt)}
                            </p>
                        </div>
                        <button
                            className="history-item__delete"
                            onClick={() => removeTask(task.id)}
                            aria-label="删除"
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function formatDate(isoStr) {
    const d = new Date(isoStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
