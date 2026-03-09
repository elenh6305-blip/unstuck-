// ============================================================
// geminiService.js — 纯服务层
// 职责：调用 Gemini API，返回纳米步骤数组 / 分析任务难度
// 修改提示词：请编辑 src/prompts.js
// ============================================================

import { TASK_BREAKDOWN_PROMPT, TASK_DIFFICULTY_ANALYSIS_PROMPT } from '../prompts';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * 通用的 Gemini API 调用
 * @param {string} promptText - 提示词文本
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<{text: string, error: string|null}>}
 */
async function callGemini(promptText, apiKey) {
  if (!apiKey) {
    return { text: null, error: '请先在设置页填入 Gemini API Key' };
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return { text: null, error: `API错误：${err?.error?.message || response.status}` };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    return { text: cleaned, error: null };
  } catch (e) {
    return { text: null, error: `请求失败：${e.message}` };
  }
}

/**
 * 调用 Gemini API 将任务拆分为纳米步骤
 * @param {string} taskTitle - 用户输入的任务名称
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<{steps: Array, error: string|null}>}
 */
export async function breakdownTask(taskTitle, apiKey) {
  if (!taskTitle || taskTitle.trim() === '') {
    return { steps: null, error: '任务名称不能为空' };
  }

  const { text, error } = await callGemini(TASK_BREAKDOWN_PROMPT(taskTitle), apiKey);
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
 * 分析单个步骤是否可以进一步拆解
 * @param {string} stepText - 步骤文本
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<{canBreakdown: boolean, steps?: Array, reason?: string, error: string|null}>}
 */
export async function analyzeTaskDifficulty(stepText, apiKey) {
  if (!stepText || stepText.trim() === '') {
    return { canBreakdown: false, error: '步骤内容不能为空' };
  }

  const { text, error } = await callGemini(TASK_DIFFICULTY_ANALYSIS_PROMPT(stepText), apiKey);
  if (error) return { canBreakdown: false, error };

  try {
    const result = JSON.parse(text);
    return { ...result, error: null };
  } catch (e) {
    return { canBreakdown: false, error: `解析失败：${e.message}` };
  }
}
