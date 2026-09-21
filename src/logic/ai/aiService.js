/**
 * Universal AI Service - MULTI-PROVIDER v5
 * Supports: Google Gemini (AIza...), OpenAI (sk-...), OpenRouter (sk-or-...)
 */

export async function callAI(apiKey, model, systemPrompt, userMessage) {
    if (!apiKey) throw new Error("API Key missing.");
    const key = apiKey.trim();

    if (key.startsWith('AIza')) {
        return callDirectGemini(key, model, systemPrompt, userMessage);
    } else if (key.startsWith('sk-or-')) {
        return callOpenRouter(key, model, systemPrompt, userMessage);
    } else if (key.startsWith('sk-')) {
        return callDirectOpenAI(key, model, systemPrompt, userMessage);
    } else {
        // Fallback to OpenRouter for any other key format
        return callOpenRouter(key, model, systemPrompt, userMessage);
    }
}

async function callDirectOpenAI(apiKey, model, systemPrompt, userMessage) {
    // Normalize model name (strip "openai/" if present)
    const cleanModel = model.replace('openai/', '');

    console.log(`[SNTD] Calling Direct OpenAI: ${cleanModel}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: cleanModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`[GPT-DIRECT] ${err.error?.message || 'Error en comunicación con OpenAI'}`);
    }

    const data = await response.json();
    return parseAIContent(data.choices[0].message.content);
}

async function callOpenRouter(apiKey, model, systemPrompt, userMessage) {
    console.log(`[SNTD] Calling OpenRouter: ${model}`);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "SNTD Diagnostic"
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ]
        })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(`[OR] ${err.error?.message}`);
    }
    const data = await response.json();
    return parseAIContent(data.choices[0].message.content);
}

async function callDirectGemini(apiKey, model, systemPrompt, userMessage) {
    const modelsToTry = [
        "gemini-1.5-flash-latest",
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-pro-latest"
    ];

    let lastError = null;
    const unifiedPrompt = `INSTRUCCIONES: ${systemPrompt}\n\nDATOS: ${userMessage}\n\nResponde estrictamente en JSON:`;

    for (const modelId of modelsToTry) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: unifiedPrompt }] }],
                    generationConfig: { temperature: 0.1 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return parseAIContent(data.candidates[0].content.parts[0].text);
            } else {
                const errData = await response.json();
                lastError = errData.error?.message;
            }
        } catch (e) {
            lastError = e.message;
        }
    }
    throw new Error(`[CODE-FINAL] Ningún modelo de Gemini respondió. Error: ${lastError}`);
}

function parseAIContent(content) {
    try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
        throw new Error("Respuesta de IA no procesable.");
    }
}
