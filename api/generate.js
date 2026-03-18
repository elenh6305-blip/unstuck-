// ============================================================
// api/generate.js — AI 代理接口（Serverless Function / Express 路由）
//
// 双模式兼容设计：
//   - Vercel 部署: 自动识别为 Serverless Function
//   - 自有服务器:  由 server/index.js 导入并挂载到 Express 路由
//
// 后端使用 DeepSeek（OpenAI 兼容格式）
// 环境变量：
//   BACKEND_AI_API_KEY  — AI 服务的 API Key
//   BACKEND_AI_BASE_URL — AI 服务的 Base URL（默认 https://api.deepseek.com）
//   BACKEND_AI_MODEL    — 使用的模型名称（默认 deepseek-chat）
// ============================================================

/**
 * 请求处理函数
 * @param {import('http').IncomingMessage & { body: any }} req
 * @param {import('http').ServerResponse & { status: Function, json: Function }} res
 */
export default async function handler(req, res) {
  // 仅允许 POST 方法
  if (req.method !== 'POST') {
    res.status(405).json({ error: '仅支持 POST 请求' });
    return;
  }

  const { prompt, action } = req.body || {};

  if (!prompt) {
    res.status(400).json({ error: '缺少 prompt 参数' });
    return;
  }

  // ── 从环境变量读取配置 ──────────────────────────
  const apiKey = process.env.BACKEND_AI_API_KEY;
  const baseUrl = process.env.BACKEND_AI_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.BACKEND_AI_MODEL || 'deepseek-chat';

  if (!apiKey) {
    res.status(500).json({ error: '后端未配置 AI 服务密钥' });
    return;
  }

  try {
    // 智能处理 baseUrl，防止拼接出 /v1/v1/chat/completions
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, ''); // 取消末尾的多余斜杠
    const endpoint = normalizedBaseUrl.endsWith('/v1')
      ? `${normalizedBaseUrl}/chat/completions`
      : `${normalizedBaseUrl}/v1/chat/completions`;

    // ── 调用 DeepSeek / OpenAI 兼容接口 ───────────
    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的任务拆分助手，专为ADHD患者设计。请严格按照用户的格式要求返回结果。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `AI 服务返回 ${apiResponse.status}`;
      console.error('[api/generate] AI 服务错误:', errMsg);
      res.status(502).json({ error: errMsg });
      return;
    }

    const data = await apiResponse.json();
    const rawText = data?.choices?.[0]?.message?.content || '';

    // 清理可能的 markdown 代码块标记（与前端 geminiService 的处理保持一致）
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    res.status(200).json({ text: cleaned, error: null });
  } catch (e) {
    console.error('[api/generate] 请求失败:', e.message);
    res.status(500).json({ error: `后端请求失败：${e.message}` });
  }
}
