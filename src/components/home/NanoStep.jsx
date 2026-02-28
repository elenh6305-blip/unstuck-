// ============================================================
// NanoStep.jsx — 纯UI组件
// 职责：单个纳米步骤行（序号 + 文字 + 勾选）
// Props: step{id,text}, index, isCompleted, onToggle(id)
// ============================================================

export default function NanoStep({ step, index, isCompleted, onToggle }) {
    return (
        <div
            className={`nano-step ${isCompleted ? 'nano-step--done' : ''}`}
            onClick={() => onToggle(step.id)}
            role="checkbox"
            aria-checked={isCompleted}
        >
            <div className="nano-step__number">{index + 1}</div>
            <p className="nano-step__text">{step.text}</p>
            <div className={`nano-step__check ${isCompleted ? 'nano-step__check--active' : ''}`}>
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
