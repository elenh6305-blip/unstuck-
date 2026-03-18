// ============================================================
// aiService.js — AI 服务统一入口
// 职责：根据用户是否填写了 API Key，自动路由到不同的服务：
//   - 有 Key → geminiService（直连 Gemini 官方 API）
//   - 无 Key → backendService（走自己的后端代理）
//
// Hook 层只需引用此文件，无需关心底层走哪条通路
// ============================================================

import { breakdownTask as geminiBreakdown, analyzeTaskDifficulty as geminiAnalyze } from './geminiService';
import { breakdownTask as backendBreakdown, analyzeTaskDifficulty as backendAnalyze } from './backendService';

/**
 * 判断是否应该使用后端代理
 * @param {string} apiKey - 用户填写的 API Key
 * @returns {boolean}
 */
function shouldUseBackend(apiKey) {
  return !apiKey || apiKey.trim() === '';
}

/**
 * 调用 AI 将任务拆分为纳米步骤
 * 对外接口与 geminiService.breakdownTask 完全一致
 * @param {string} taskTitle - 用户输入的任务名称
 * @param {string} apiKey - 用户填写的 API Key（可为空）
 * @returns {Promise<{steps: Array, error: string|null}>}
 */
export async function breakdownTask(taskTitle, apiKey) {
  if (shouldUseBackend(apiKey)) {
    return backendBreakdown(taskTitle);
  }
  return geminiBreakdown(taskTitle, apiKey);
}

/**
 * 分析单个步骤是否可以进一步拆解
 * 对外接口与 geminiService.analyzeTaskDifficulty 完全一致
 * @param {string} stepText - 步骤文本
 * @param {string} apiKey - 用户填写的 API Key（可为空）
 * @returns {Promise<{canBreakdown: boolean, steps?: Array, reason?: string, error: string|null}>}
 */
export async function analyzeTaskDifficulty(stepText, apiKey) {
  if (shouldUseBackend(apiKey)) {
    return backendAnalyze(stepText);
  }
  return geminiAnalyze(stepText, apiKey);
}
