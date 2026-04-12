# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/chatbot/llm_connector.py
# ============================================================

import os
import httpx
import logging
from typing import List

logger = logging.getLogger(__name__)

LLM_PROVIDER  = os.getenv("LLM_PROVIDER", "openai")  # openai | anthropic | ollama
OPENAI_KEY    = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OLLAMA_URL    = os.getenv("OLLAMA_URL", "http://localhost:11434")
LLM_MODEL     = os.getenv("LLM_MODEL", "gpt-4o-mini")


async def get_llm_response(messages: List[dict], max_tokens: int = 512) -> str:
    """
    Route to configured LLM provider and return text response.
    Supports: OpenAI, Anthropic Claude, Ollama (local).
    """
    if LLM_PROVIDER == "openai" and OPENAI_KEY:
        return await _openai(messages, max_tokens)
    elif LLM_PROVIDER == "anthropic" and ANTHROPIC_KEY:
        return await _anthropic(messages, max_tokens)
    elif LLM_PROVIDER == "ollama":
        return await _ollama(messages, max_tokens)
    else:
        raise RuntimeError(
            f"No LLM configured. Set LLM_PROVIDER and the corresponding API key."
        )


async def _openai(messages: List[dict], max_tokens: int) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_KEY}"},
            json={
                "model":      LLM_MODEL,
                "messages":   messages,
                "max_tokens": max_tokens,
                "temperature": 0.7,
            },
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()


async def _anthropic(messages: List[dict], max_tokens: int) -> str:
    # Separate system from conversation
    system = next((m["content"] for m in messages if m["role"] == "system"), "")
    conv   = [m for m in messages if m["role"] != "system"]

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key":         ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type":      "application/json",
            },
            json={
                "model":      "claude-haiku-4-5-20251001",
                "max_tokens": max_tokens,
                "system":     system,
                "messages":   conv,
            },
        )
        r.raise_for_status()
        return r.json()["content"][0]["text"].strip()


async def _ollama(messages: List[dict], max_tokens: int) -> str:
    """Use local Ollama for offline/free LLM inference."""
    prompt = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in messages
    )
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model":  LLM_MODEL or "llama3",
                "prompt": prompt,
                "stream": False,
                "options": {"num_predict": max_tokens},
            },
        )
        r.raise_for_status()
        return r.json()["response"].strip()
