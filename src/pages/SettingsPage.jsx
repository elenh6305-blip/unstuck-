// ============================================================
// SettingsPage.jsx — 页面（组装层）
// ============================================================

import { useState } from 'react';
import { getApiKey, saveApiKey } from '../services/storageService';

export default function SettingsPage() {
    const [key, setKey] = useState(getApiKey);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        saveApiKey(key.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="settings-page">
            <h2 className="page-title">设置</h2>

            <section className="settings-section">
                <label className="settings-label">Gemini API Key</label>
                <p className="settings-hint">
                    在 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a> 免费获取
                </p>
                <div className="settings-input-row">
                    <input
                        className="settings-input"
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="AIza..."
                        autoComplete="off"
                    />
                    <button
                        className={`settings-save-btn ${saved ? 'settings-save-btn--saved' : ''}`}
                        onClick={handleSave}
                    >
                        {saved ? '✓ 已保存' : '保存'}
                    </button>
                </div>
                <p className="settings-note">Key 仅保存在本设备，不会上传</p>
            </section>

            <section className="settings-section settings-about">
                <p className="settings-label">关于</p>
                <p className="settings-hint">ADHD 纳米任务助手 · v1.0</p>
                <p className="settings-hint">专为启动困难设计，让每一步都小到无法拒绝。</p>
            </section>
        </div>
    );
}
