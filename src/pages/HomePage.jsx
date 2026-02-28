// ============================================================
// HomePage.jsx — 页面（组装层）
// 职责：将 useTaskBreakdown + useFocusMode 与 UI 组件连接
// 不含任何业务逻辑，只做数据传递
// ============================================================

import { useState } from 'react';
/* eslint-disable no-unused-vars */
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
/* eslint-enable no-unused-vars */
import SearchInput from '../components/home/SearchInput';
import TaskBreakdown from '../components/home/TaskBreakdown';
import FocusOverlay from '../components/focus/FocusOverlay';
import { useTaskBreakdown } from '../hooks/useTaskBreakdown';
import { useFocusMode } from '../hooks/useFocusMode';

export default function HomePage() {
    const {
        taskTitle, steps, status, errorMsg,
        submitTask, resetTask,
    } = useTaskBreakdown();

    const {
        isActive, currentIndex, totalSteps, currentStep, direction,
        isLastStep, isFirstStep,
        startFocus, nextStep, prevStep, exitFocus,
    } = useFocusMode();

    // 记录每步的完成状态（Set of completed step ids）
    const [completedIds, setCompletedIds] = useState(new Set());

    const handleToggle = (id) => {
        setCompletedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleReset = () => {
        resetTask();
        setCompletedIds(new Set());
    };

    const isIdle = status === 'idle';
    const isLoading = status === 'loading';
    const isDone = status === 'done';

    return (
        <div className="home-page">
            {/* 标题区域 - idle时居中显示，有结果后移到顶部 */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div
                        className="home-hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="home-hero__title">今天，从一步开始。</h1>
                        <p className="home-hero__subtitle">输入任何任务，我来帮你拆成最小的步骤</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 搜索输入框 */}
            <div className={`home-search-area ${isDone ? 'home-search-area--compact' : ''}`}>
                <SearchInput
                    onSubmit={submitTask}
                    isLoading={isLoading}
                    key={status === 'idle' ? 'idle' : 'active'}
                />
            </div>

            {/* 加载动画 */}
            {isLoading && (
                <motion.div
                    className="home-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="loading-dots">
                        <span /><span /><span />
                    </div>
                    <p>正在拆分任务…</p>
                </motion.div>
            )}

            {/* 错误提示 */}
            {status === 'error' && (
                <motion.div
                    className="home-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p>{errorMsg}</p>
                    <button onClick={handleReset}>重试</button>
                </motion.div>
            )}

            {/* 任务步骤列表 */}
            {isDone && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <TaskBreakdown
                        taskTitle={taskTitle}
                        steps={steps}
                        completedIds={completedIds}
                        onToggle={handleToggle}
                        onStartFocus={() => startFocus(steps)}
                        onReset={handleReset}
                    />
                </motion.div>
            )}

            {/* 专注模式全屏覆盖 */}
            <FocusOverlay
                isActive={isActive}
                step={currentStep}
                currentIndex={currentIndex}
                total={totalSteps}
                direction={direction}
                isLastStep={isLastStep}
                isFirstStep={isFirstStep}
                onNext={nextStep}
                onPrev={prevStep}
                onExit={exitFocus}
            />
        </div>
    );
}
