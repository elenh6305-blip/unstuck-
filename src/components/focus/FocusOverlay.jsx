// ============================================================
// FocusOverlay.jsx — 纯UI组件
// 职责：全屏遮罩层，包裹 FocusCard
// Props: isActive, ...所有FocusCard需要的props
// ============================================================

/* eslint-disable no-unused-vars */
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
/* eslint-enable no-unused-vars */
import FocusCard from './FocusCard';

export default function FocusOverlay({ isActive, ...focusCardProps }) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="focus-overlay"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    <FocusCard {...focusCardProps} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
