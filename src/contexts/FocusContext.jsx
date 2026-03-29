// ============================================================
// FocusContext.jsx — 全局专注模式状态 Provider
// 职责：管理专注模式的状态（当前步骤索引、方向动画）
//       存活于路由切换之外
// ============================================================

import { createContext, useContext, useState, useCallback } from 'react';

const FocusContext = createContext(null);

export function FocusProvider({ children }) {
    const [isActive, setIsActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [steps, setSteps] = useState([]);
    const [direction, setDirection] = useState(1); // 1=向左推出, -1=向右推出

    const startFocus = useCallback((allSteps) => {
        setSteps(allSteps);
        setCurrentIndex(0);
        setDirection(1);
        setIsActive(true);
    }, []);

    const nextStep = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => {
            if (prev < steps.length - 1) return prev + 1;
            return prev; // 已是最后一步
        });
    }, [steps.length]);

    const prevStep = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => {
            if (prev > 0) return prev - 1;
            return prev;
        });
    }, []);

    const exitFocus = useCallback(() => {
        setIsActive(false);
        setCurrentIndex(0);
    }, []);

    const isLastStep = currentIndex === steps.length - 1;
    const isFirstStep = currentIndex === 0;

    const value = {
        isActive,
        currentIndex,
        totalSteps: steps.length,
        currentStep: steps[currentIndex] || null,
        direction,
        isLastStep,
        isFirstStep,
        startFocus,
        nextStep,
        prevStep,
        exitFocus,
    };

    return (
        <FocusContext.Provider value={value}>
            {children}
        </FocusContext.Provider>
    );
}

/**
 * 消费专注模式状态的 Hook
 * 必须在 FocusProvider 内部使用
 */
export function useFocus() {
    const ctx = useContext(FocusContext);
    if (!ctx) {
        throw new Error('useFocus() must be used within <FocusProvider>');
    }
    return ctx;
}
