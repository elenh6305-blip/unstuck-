// ============================================================
// FocusCard.jsx — 纯UI组件
// 职责：专注模式的单步卡片，带framer-motion推送动画
// Props: step, currentIndex, total, direction, onNext(), onPrev(), onExit()
//        isLastStep, isFirstStep
// ============================================================

/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from 'framer-motion';
/* eslint-enable no-unused-vars */

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
    }),
};

export default function FocusCard({ step, currentIndex, total, direction, onNext, onPrev, onExit, isLastStep, isFirstStep }) {
    return (
        <div className="focus-card-wrapper">
            {/* 顶部信息栏 */}
            <div className="focus-card-topbar">
                <button className="focus-exit-btn" onClick={onExit}>
                    ← 退出专注
                </button>
                <span className="focus-progress-text">
                    {currentIndex + 1} / {total}
                </span>
            </div>

            {/* 步骤轨道进度 */}
            <div className="focus-dots">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`focus-dot ${i === currentIndex ? 'focus-dot--active' : ''} ${i < currentIndex ? 'focus-dot--done' : ''}`}
                    />
                ))}
            </div>

            {/* 推送动画卡片 */}
            <div className="focus-card-stage">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        className="focus-card"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="focus-card__step-num">步骤 {currentIndex + 1}</div>
                        <p className="focus-card__text">{step?.text}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 操作按钮 */}
            <div className="focus-card-actions">
                <button
                    className="focus-btn focus-btn--secondary"
                    onClick={onPrev}
                    disabled={isFirstStep}
                >
                    ← 上一步
                </button>
                <button
                    className={`focus-btn focus-btn--primary ${isLastStep ? 'focus-btn--finish' : ''}`}
                    onClick={isLastStep ? onExit : onNext}
                >
                    {isLastStep ? '🎉 完成！' : '完成 →'}
                </button>
            </div>
        </div>
    );
}
