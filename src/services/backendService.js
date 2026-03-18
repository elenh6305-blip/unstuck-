// ============================================================
// backendService.js — 后端代理服务层
// 职责：调用自己的后端 /api/generate（DeepSeek 等第三方 AI）
// 当用户未填写 API Key 时，由 aiService.js 自动路由到此模块
// ============================================================

import { TASK_BREAKDOWN_PROMPT, TASK_DIFFICULTY_ANALYSIS_PROMPT } from '../prompts';

/**
 * 后端 API 的基础路径
 * 使用相对路径，确保 Vercel 和自有服务器通用：
 *   - Vercel:  自动路由到 api/generate.js Serverless Function
 *   - Express: server/index.js 挂载同一个 handler
 *   - 本地开发: Vite proxy 转发到本地 Express
 */
const BACKEND_API_URL = '/api/generate';

/**
 * 通用的后端代理调用
 * @param {string} promptText - 提示词文本
 * @param {string} action - 操作类型 ('breakdown' | 'analyze')
 * @returns {Promise<{text: string, error: string|null}>}
 */
async function callBackend(promptText, action) {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText, action }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        text: null,
        error: `后端服务错误：${err?.error || response.status}`,
      };
    }

    const data = await response.json();

    if (data.error) {
      return { text: null, error: `后端服务错误：${data.error}` };
    }

    return { text: data.text || '', error: null };
  } catch (e) {
    return { text: null, error: `无法连接后端服务：${e.message}` };
  }
}

/**
 * 通过后端代理将任务拆分为纳米步骤
 * 函数签名与 geminiService.breakdownTask 保持一致
 * @param {string} taskTitle - 用户输入的任务名称
 * @returns {Promise<{steps: Array, error: string|null}>}
 */
export async function breakdownTask(taskTitle) {
  if (!taskTitle || taskTitle.trim() === '') {
    return { steps: null, error: '任务名称不能为空' };
  }

  const { text, error } = await callBackend(
    TASK_BREAKDOWN_PROMPT(taskTitle),
    'breakdown'
  );
  if (error) return { steps: null, error };

  try {
    const steps = JSON.parse(text);
    if (!Array.isArray(steps)) throw new Error('返回格式不正确');
    return { steps, error: null };
  } catch (e) {
    return { steps: null, error: `解析失败：${e.message}` };
  }
}

/**
 * 通过后端代理分析步骤是否可进一步拆解
 * 函数签名与 geminiService.analyzeTaskDifficulty 保持一致
 * @param {string} stepText - 步骤文本
 * @returns {Promise<{canBreakdown: boolean, steps?: Array, reason?: string, error: string|null}>}
 */
export async function analyzeTaskDifficulty(stepText) {
  if (!stepText || stepText.trim() === '') {
    return { canBreakdown: false, error: '步骤内容不能为空' };
  }

  const { text, error } = await callBackend(
    TASK_DIFFICULTY_ANALYSIS_PROMPT(stepText),
    'analyze'
  );
  if (error) return { canBreakdown: false, error };

  try {
    const result = JSON.parse(text);
    return { ...result, error: null };
  } catch (e) {
    return { canBreakdown: false, error: `解析失败：${e.message}` };
  }
}
