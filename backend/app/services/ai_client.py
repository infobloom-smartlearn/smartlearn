"""Placeholder AI client service.

This module should be replaced with real integration to OpenAI/other providers.
It exposes a simple async function to request a response.
"""
import asyncio


async def generate_response(prompt: str) -> str:
    # Simulate a small delay and return a canned response for now
    await asyncio.sleep(1.0)
    return f"Simulated AI response to: {prompt}"
