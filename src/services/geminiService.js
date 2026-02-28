// ============================================================
// geminiService.js — 纯服务层
// 职责：调用 Gemini API，返回纳米步骤数组
// 修改提示词：只需编辑 PROMPT_TEMPLATE 常量
// ============================================================

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// 修改此处定制 AI 拆分风格
const PROMPT_TEMPLATE = (taskTitle) => `
你是一位专为ADHD患者设计的任务教练。
将以下任务拆分为"纳米步骤"，每一步必须满足：
1. 以动词开头（如：打开、找到、点击、写下、复制）
2. 在30秒到3分钟内可独立完成
3. 极其具体，不含任何模糊描述
4. 不超过20个字

共输出6到10个步骤。
只返回纯 JSON 数组，不要有任何其他文字或代码块标记：
[{"id":"1","text":"步骤描述"},{"id":"2","text":"步骤描述"}]

任务：${taskTitle}
`.trim();

/**
 * 调用 Gemini API 将任务拆分为纳米步骤
 * @param {string} taskTitle - 用户输入的任务名称
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<{steps: Array, error: string|null}>}
 */
export async function breakdownTask(taskTitle, apiKey) {
  if (!apiKey) {
    return { steps: null, error: '请先在设置页填入 Gemini API Key' };
  }
  if (!taskTitle || taskTitle.trim() === '') {
    return { steps: null, error: '任务名称不能为空' };
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT_TEMPLATE(taskTitle) }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return { steps: null, error: `API错误：${err?.error?.message || response.status}` };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 清理可能的代码块标记
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const steps = JSON.parse(cleaned);

    if (!Array.isArray(steps)) throw new Error('返回格式不正确');

    return { steps, error: null };
  } catch (e) {
    return { steps: null, error: `解析失败：${e.message}` };
  }
}
