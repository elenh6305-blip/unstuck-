// ============================================================
// SearchInput.jsx — 纯UI组件
// 职责：谷歌主页风格的任务输入框
// Props: onSubmit(text), isLoading, defaultValue
// ============================================================

import { useState } from 'react';

export default function SearchInput({ onSubmit, isLoading, defaultValue = '' }) {
    const [value, setValue] = useState(defaultValue);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            onSubmit(value);
        }
    };

    const handleSubmit = () => {
        if (!isLoading) onSubmit(value);
    };

    return (
        <div className="search-input-wrapper">
            <div className="search-input-box">
                <span className="search-input-icon">
                    <SearchIcon />
                </span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="今天想完成什么？"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                />
                {value && !isLoading && (
                    <button className="search-input-clear" onClick={() => setValue('')} aria-label="清除">
                        <ClearIcon />
                    </button>
                )}
            </div>
            <button
                className="search-submit-btn"
                onClick={handleSubmit}
                disabled={isLoading || !value.trim()}
            >
                {isLoading ? '拆分中…' : '开始拆分'}
            </button>
        </div>
    );
}

function SearchIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function ClearIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
